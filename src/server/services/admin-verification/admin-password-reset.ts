import {
  EmailVerificationDeliveryError,
  sendAdminEmailVerification,
} from '@/server/email'
import {
  generateChallengeId,
  generateVerificationCode,
  hashPassword,
} from '@/server/auth/password'
import type { CurrentAdmin } from '@/server/auth/types'
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

export async function beginAdminPasswordResetVerification(
  userId: number,
  password: string,
  currentAdmin: CurrentAdmin,
) {
  if (password.length < 12 || password.length > 256) {
    return {
      success: false as const,
      error: 'Choose a password between 12 and 256 characters.',
    }
  }
  if (userId === currentAdmin.id) {
    return {
      success: false as const,
      error: 'Use Change Password to update your own password.',
    }
  }

  const target = await adminUsersRepo.findActiveWithDisplayName(userId)
  if (!target) {
    return {
      success: false as const,
      error: 'Active admin account was not found.',
    }
  }

  const now = new Date()
  const passwordHash = await hashPassword(password)
  const reservation = await runInTransaction(async (transaction) => {
    await lockEmail(transaction, target.email)
    await adminEmailVerificationsRepo.deleteExpired(now, transaction)

    const activeRequester = await adminUsersRepo.findActiveId(
      currentAdmin.id,
      transaction,
    )
    const activeTarget = await adminUsersRepo.findActiveId(userId, transaction)
    if (!activeRequester || !activeTarget) return 'not-found' as const

    const recentChallenge =
      await adminEmailVerificationsRepo.findPendingCreatedAt(
        {
          purpose: 'password_reset',
          email: target.email,
          expiresAfter: new Date(
            now.getTime() - VERIFICATION_RESEND_COOLDOWN_MS,
          ),
        },
        transaction,
      )
    if (isWithinCooldown(now, recentChallenge?.createdAt)) {
      return 'cooldown' as const
    }

    await adminEmailVerificationsRepo.deleteByPurpose(
      'password_reset',
      target.email,
      transaction,
    )

    const { code, codeSalt, codeHash } = await generateVerificationCode()
    const challengeId = generateChallengeId()
    await adminEmailVerificationsRepo.insert(
      {
        id: challengeId,
        purpose: 'password_reset',
        email: target.email,
        displayName: target.displayName ?? target.email,
        passwordHash,
        codeSalt,
        codeHash,
        createdByUserId: currentAdmin.id,
        expiresAt: new Date(now.getTime() + VERIFICATION_DURATION_MS),
      },
      transaction,
    )
    return { status: 'created' as const, challengeId, code }
  })

  if (reservation === 'cooldown') {
    return {
      success: false as const,
      error: 'Please wait one minute before requesting another code.',
    }
  }
  if (reservation === 'not-found') {
    return {
      success: false as const,
      error: 'Active admin account was not found.',
    }
  }
  if (typeof reservation === 'string') {
    return {
      success: false as const,
      error: 'Could not start password reset verification.',
    }
  }

  try {
    await sendAdminEmailVerification(
      target.email,
      reservation.code,
      'password-reset',
    )
  } catch (error) {
    await adminEmailVerificationsRepo.deleteById(reservation.challengeId)
    if (!(error instanceof EmailVerificationDeliveryError)) throw error
    console.error('Failed to send admin password reset email:', error.message)
    return {
      success: false as const,
      error:
        'Could not send the password reset email. Check the server SMTP configuration.',
    }
  }

  return {
    success: true as const,
    challengeId: reservation.challengeId,
    email: target.email,
  }
}

export async function verifyAdminPasswordReset(
  challengeId: string,
  code: string,
  currentAdmin: CurrentAdmin,
) {
  if (!isValidChallengeInput(challengeId, code)) {
    return { success: false as const, error: 'Invalid or expired code.' }
  }

  const result = await runInTransaction(async (transaction) => {
    await lockChallenge(transaction, challengeId)
    const challenge = await adminEmailVerificationsRepo.findOpenForUpdate(
      {
        id: challengeId,
        purpose: 'password_reset',
        createdByUserId: currentAdmin.id,
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

    const activeRequester = await adminUsersRepo.findActiveId(
      currentAdmin.id,
      transaction,
    )
    if (!activeRequester) return { status: 'expired' as const }

    const target = await adminUsersRepo.updatePasswordByActiveEmail(
      challenge.email,
      challenge.passwordHash,
      transaction,
    )
    if (!target) {
      await adminEmailVerificationsRepo.markConsumed(challengeId, transaction)
      return { status: 'not-found' as const }
    }

    await adminSessionsRepo.deleteByUserId(target.id, transaction)
    await adminEmailVerificationsRepo.markConsumed(challengeId, transaction)
    return { status: 'updated' as const }
  })

  if (result.status === 'invalid') {
    return {
      success: false as const,
      error: "Incorrect code. Check the admin's email and try again.",
    }
  }
  if (result.status === 'not-found') {
    return {
      success: false as const,
      error: 'Active admin account was not found.',
    }
  }
  if (result.status !== 'updated') {
    return { success: false as const, error: 'Invalid or expired code.' }
  }
  return { success: true as const }
}
