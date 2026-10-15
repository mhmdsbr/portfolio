import {
  EmailVerificationDeliveryError,
  sendAdminEmailVerification,
} from '@/server/email'
import {
  generateChallengeId,
  generateVerificationCode,
  hashPassword,
  verifyPassword,
} from '@/server/auth/password'
import { getCurrentSessionHash, getSessionAdmin } from '@/server/auth/session'
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

export async function beginCurrentAdminPasswordChange(
  currentPassword: string,
  newPassword: string,
) {
  const admin = await getSessionAdmin()
  if (!admin) return { success: false as const, error: 'Sign in again.' }
  if (newPassword.length < 12 || newPassword.length > 256) {
    return {
      success: false as const,
      error: 'New password must be between 12 and 256 characters.',
    }
  }

  const user = await adminUsersRepo.findPasswordHashById(admin.id)

  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    return { success: false as const, error: 'Current password is incorrect.' }
  }

  const passwordHash = await hashPassword(newPassword)
  const now = new Date()
  const reservation = await runInTransaction(async (transaction) => {
    await lockEmail(transaction, admin.email)
    await adminEmailVerificationsRepo.deleteExpired(now, transaction)

    const recentChallenge =
      await adminEmailVerificationsRepo.findPendingCreatedAt(
        {
          purpose: 'password_change',
          email: admin.email,
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
      'password_change',
      admin.email,
      transaction,
    )

    const activeAdmin = await adminUsersRepo.findActiveWithDisplayName(
      admin.id,
      transaction,
    )
    if (!activeAdmin) return 'not-found' as const

    const { code, codeSalt, codeHash } = await generateVerificationCode()
    const challengeId = generateChallengeId()
    await adminEmailVerificationsRepo.insert(
      {
        id: challengeId,
        purpose: 'password_change',
        email: activeAdmin.email,
        displayName: activeAdmin.displayName ?? activeAdmin.email,
        passwordHash,
        codeSalt,
        codeHash,
        createdByUserId: admin.id,
        expiresAt: new Date(now.getTime() + VERIFICATION_DURATION_MS),
      },
      transaction,
    )
    return {
      status: 'created' as const,
      challengeId,
      code,
      email: activeAdmin.email,
    }
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
      error: 'Could not start password change verification.',
    }
  }

  try {
    await sendAdminEmailVerification(
      reservation.email,
      reservation.code,
      'password-change',
    )
  } catch (error) {
    await adminEmailVerificationsRepo.deleteById(reservation.challengeId)
    if (!(error instanceof EmailVerificationDeliveryError)) throw error
    console.error('Failed to send admin password change email:', error.message)
    return {
      success: false as const,
      error:
        'Could not send the verification email. Check the server SMTP configuration.',
    }
  }

  return {
    success: true as const,
    challengeId: reservation.challengeId,
    email: reservation.email,
  }
}

export async function completeCurrentAdminPasswordChange(
  challengeId: string,
  code: string,
) {
  const admin = await getSessionAdmin()
  if (!admin) return { success: false as const, error: 'Sign in again.' }
  if (!isValidChallengeInput(challengeId, code)) {
    return { success: false as const, error: 'Invalid or expired code.' }
  }

  const result = await runInTransaction(async (transaction) => {
    await lockChallenge(transaction, challengeId)
    const challenge = await adminEmailVerificationsRepo.findOpenForUpdate(
      {
        id: challengeId,
        purpose: 'password_change',
        createdByUserId: admin.id,
        maxAttempts: MAX_VERIFICATION_ATTEMPTS,
      },
      transaction,
    )
    if (!challenge) return { status: 'expired' as const }

    const outcome = await checkChallengeCode(
      transaction,
      challenge,
      code,
      'delete',
    )
    if (outcome === 'expired') return { status: 'expired' as const }
    if (outcome === 'invalid') return { status: 'invalid' as const }

    const updatedAdmin = await adminUsersRepo.updatePasswordByActiveIdAndEmail(
      admin.id,
      challenge.email,
      challenge.passwordHash,
      transaction,
    )
    if (!updatedAdmin) return { status: 'expired' as const }

    await adminSessionsRepo.deleteByUserIdExcept(
      admin.id,
      await getCurrentSessionHash(),
      transaction,
    )
    await adminEmailVerificationsRepo.markConsumed(challengeId, transaction)
    return { status: 'updated' as const }
  })

  if (result.status === 'invalid') {
    return {
      success: false as const,
      error: 'Incorrect code. Check your email and try again.',
    }
  }
  if (result.status !== 'updated') {
    return { success: false as const, error: 'Invalid or expired code.' }
  }
  return { success: true as const }
}
