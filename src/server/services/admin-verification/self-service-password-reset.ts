import {
  EmailVerificationDeliveryError,
  sendAdminEmailVerification,
} from '@/server/email'
import {
  generateChallengeId,
  generateVerificationCode,
  hashPassword,
} from '@/server/auth/password'
import { validateAdminEmail } from '@/server/auth/validation'
import { adminEmailVerificationsRepo } from '@/server/repos/admin-email-verifications'
import { adminSessionsRepo } from '@/server/repos/admin-sessions'
import { adminUsersRepo } from '@/server/repos/admin-users'
import { lockChallenge, lockEmail } from '@/server/repos/advisory-locks'
import { runInTransaction } from '@/server/repos/executor'
import {
  VERIFICATION_DURATION_MS,
  VERIFICATION_RESEND_COOLDOWN_MS,
  MAX_VERIFICATION_ATTEMPTS,
  isWithinCooldown,
  isValidChallengeInput,
  checkChallengeCode,
} from './shared'

const SELF_SERVICE_RESET_PASSWORD_MARKER = 'self-service-password-reset'

export async function beginSelfServiceAdminPasswordReset(email: string) {
  const validated = validateAdminEmail(email)
  if (!validated.success) return validated

  const now = new Date()
  const reservation = await runInTransaction(async (transaction) => {
    await lockEmail(transaction, validated.email)
    await adminEmailVerificationsRepo.deleteExpired(now, transaction)

    const target = await adminUsersRepo.findActiveIdByEmail(
      validated.email,
      transaction,
    )
    if (!target) {
      return {
        status: 'not-found' as const,
        challengeId: generateChallengeId(),
      }
    }

    const recentChallenge =
      await adminEmailVerificationsRepo.findPendingCreatedAt(
        {
          purpose: 'password_reset',
          email: validated.email,
          createdByUserId: null,
          expiresAfter: new Date(
            now.getTime() - VERIFICATION_RESEND_COOLDOWN_MS,
          ),
        },
        transaction,
      )
    if (isWithinCooldown(now, recentChallenge?.createdAt)) {
      return {
        status: 'cooldown' as const,
        challengeId: recentChallenge!.id,
      }
    }

    await adminEmailVerificationsRepo.deleteByPurpose(
      'password_reset',
      validated.email,
      transaction,
    )

    const { code, codeSalt, codeHash } = await generateVerificationCode()
    const challengeId = generateChallengeId()
    await adminEmailVerificationsRepo.insert(
      {
        id: challengeId,
        purpose: 'password_reset',
        email: validated.email,
        displayName: validated.email,
        passwordHash: SELF_SERVICE_RESET_PASSWORD_MARKER,
        codeSalt,
        codeHash,
        createdByUserId: null,
        expiresAt: new Date(now.getTime() + VERIFICATION_DURATION_MS),
      },
      transaction,
    )
    return { status: 'created' as const, challengeId, code }
  })

  if (reservation.status === 'created') {
    try {
      await sendAdminEmailVerification(
        validated.email,
        reservation.code,
        'password-reset',
      )
    } catch (error) {
      await adminEmailVerificationsRepo.deleteById(reservation.challengeId)
      if (!(error instanceof EmailVerificationDeliveryError)) throw error
      console.error('Failed to send admin password reset email:', error.message)
      return {
        success: false as const,
        error: 'Unable to send a reset code right now. Please try again later.',
      }
    }
  }

  return {
    success: true as const,
    challengeId: reservation.challengeId,
    message:
      'If an active admin account matches that email, a reset code has been sent.',
  }
}

export async function completeSelfServiceAdminPasswordReset(
  challengeId: string,
  code: string,
  newPassword: string,
) {
  if (!isValidChallengeInput(challengeId, code)) {
    return { success: false as const, error: 'Invalid or expired code.' }
  }
  if (newPassword.length < 12 || newPassword.length > 256) {
    return {
      success: false as const,
      error: 'Choose a password between 12 and 256 characters.',
    }
  }

  const result = await runInTransaction(async (transaction) => {
    await lockChallenge(transaction, challengeId)
    const challenge = await adminEmailVerificationsRepo.findOpenForUpdate(
      {
        id: challengeId,
        purpose: 'password_reset',
        createdByUserId: null,
        maxAttempts: MAX_VERIFICATION_ATTEMPTS,
      },
      transaction,
    )
    if (!challenge) return { status: 'expired' as const }

    const outcome = await checkChallengeCode(
      transaction,
      challenge,
      code,
      'consume',
    )
    if (outcome === 'expired') return { status: 'expired' as const }
    if (outcome === 'invalid') return { status: 'invalid' as const }

    const passwordHash = await hashPassword(newPassword)
    const target = await adminUsersRepo.updatePasswordByActiveEmail(
      challenge.email,
      passwordHash,
      transaction,
    )
    if (!target) {
      await adminEmailVerificationsRepo.markConsumed(challengeId, transaction)
      return { status: 'expired' as const }
    }

    await adminSessionsRepo.deleteByUserId(target.id, transaction)
    await adminEmailVerificationsRepo.markConsumed(challengeId, transaction)
    return { status: 'updated' as const }
  })

  if (result.status === 'invalid') {
    return {
      success: false as const,
      error: 'Incorrect code. Please try again.',
    }
  }
  if (result.status !== 'updated') {
    return { success: false as const, error: 'Invalid or expired code.' }
  }
  return { success: true as const }
}
