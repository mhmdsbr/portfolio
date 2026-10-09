import { EmailVerificationDeliveryError, sendAdminEmailVerification } from '@/lib/email'
import {
  checkVerificationCode,
  generateChallengeId,
  generateVerificationCode,
  hashPassword,
  verifyPassword,
} from '@/server/auth/password'
import {
  createSession,
  getCurrentSessionHash,
  getSessionAdmin,
} from '@/server/auth/session'
import type { CurrentAdmin } from '@/server/auth/types'
import { validateAdminInput } from '@/server/auth/validation'
import { adminEmailVerificationsRepo } from '@/server/repos/admin-email-verifications'
import { adminProfilesRepo } from '@/server/repos/admin-profiles'
import { adminSessionsRepo } from '@/server/repos/admin-sessions'
import { adminUsersRepo } from '@/server/repos/admin-users'
import {
  lockChallenge,
  lockEmail,
  lockInitialSignup,
} from '@/server/repos/advisory-locks'
import { runInTransaction, type Transaction } from '@/server/repos/executor'
import { getAdminCount } from './admin-accounts'

const VERIFICATION_DURATION_MS = 10 * 60 * 1000
const VERIFICATION_RESEND_COOLDOWN_MS = 60 * 1000
const MAX_VERIFICATION_ATTEMPTS = 5

type Challenge = NonNullable<
  Awaited<ReturnType<typeof adminEmailVerificationsRepo.findOpenForUpdate>>
>

function isWithinCooldown(now: Date, createdAt: Date | null | undefined) {
  return (
    !!createdAt &&
    now.getTime() - createdAt.getTime() < VERIFICATION_RESEND_COOLDOWN_MS
  )
}

function isValidChallengeInput(challengeId: string, code: string) {
  return /^[A-Za-z0-9_-]{43}$/.test(challengeId) && /^\d{6}$/.test(code)
}

/**
 * Checks the submitted code against a locked challenge. A wrong code counts an
 * attempt; at the limit the challenge is deleted or marked consumed.
 */
async function checkChallengeCode(
  transaction: Transaction,
  challenge: Challenge,
  code: string,
  atMaxAttempts: 'consume' | 'delete',
) {
  const outcome = await checkVerificationCode(
    code,
    challenge.codeSalt,
    challenge.codeHash,
  )
  if (outcome === 'malformed') return 'expired' as const
  if (outcome === 'match') return 'match' as const

  const attempts = challenge.attempts + 1
  if (attempts >= MAX_VERIFICATION_ATTEMPTS) {
    if (atMaxAttempts === 'delete') {
      await adminEmailVerificationsRepo.deleteById(challenge.id, transaction)
    } else {
      await adminEmailVerificationsRepo.markConsumed(challenge.id, transaction)
    }
  } else {
    await adminEmailVerificationsRepo.setAttempts(challenge.id, attempts, transaction)
  }
  return 'invalid' as const
}

export async function beginAdminEmailVerification(
  email: string,
  displayName: string,
  password: string,
  purpose: 'initial' | 'additional',
) {
  const validated = validateAdminInput({ email, displayName, password })
  if (!validated.success) return validated

  const currentAdmin =
    purpose === 'additional' ? await getSessionAdmin() : null
  if (purpose === 'additional' && !currentAdmin) {
    return { success: false as const, error: 'Sign in to add an admin.' }
  }
  if (purpose === 'initial' && (await getAdminCount()) > 0) {
    return { success: false as const, error: 'Initial sign-up is closed.' }
  }
  const existingUser = await adminUsersRepo.findIdByEmail(validated.email)
  if (existingUser) {
    return {
      success: false as const,
      error: 'An account with that email already exists.',
    }
  }

  const now = new Date()

  const reservation = await runInTransaction(async (transaction) => {
    if (purpose === 'initial') {
      await lockInitialSignup(transaction)
    } else {
      await lockEmail(transaction, validated.email)
    }
    await adminEmailVerificationsRepo.deleteExpired(now, transaction)
    const registeredEmail = await adminUsersRepo.findIdByEmail(
      validated.email,
      transaction,
    )
    if (registeredEmail) return 'duplicate' as const

    const recentChallenge = await adminEmailVerificationsRepo.findPendingCreatedAt(
      {
        purpose,
        email: purpose === 'initial' ? undefined : validated.email,
        expiresAfter: new Date(now.getTime() - VERIFICATION_RESEND_COOLDOWN_MS),
      },
      transaction,
    )
    if (isWithinCooldown(now, recentChallenge?.createdAt)) {
      return 'cooldown' as const
    }

    await adminEmailVerificationsRepo.deleteByPurpose(
      purpose,
      purpose === 'initial' ? undefined : validated.email,
      transaction,
    )
    if (purpose === 'initial') {
      if ((await adminUsersRepo.count(transaction)) > 0) return 'closed' as const
    } else {
      const activeAdmin = await adminUsersRepo.findActiveId(
        currentAdmin!.id,
        transaction,
      )
      if (!activeAdmin) return 'unauthorized' as const
    }

    const { code, codeSalt, codeHash } = await generateVerificationCode()
    const passwordHash = await hashPassword(password)
    const challengeId = generateChallengeId()
    await adminEmailVerificationsRepo.insert(
      {
        id: challengeId,
        purpose,
        email: validated.email,
        displayName: validated.displayName,
        passwordHash,
        codeSalt,
        codeHash,
        createdByUserId: currentAdmin?.id ?? null,
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
  if (reservation === 'closed') {
    return { success: false as const, error: 'Initial sign-up is closed.' }
  }
  if (reservation === 'unauthorized') {
    return { success: false as const, error: 'Sign in to add an admin.' }
  }
  if (reservation === 'duplicate') {
    return {
      success: false as const,
      error: 'An account with that email already exists.',
    }
  }
  if (typeof reservation === 'string') {
    return {
      success: false as const,
      error: 'Could not start email verification.',
    }
  }

  try {
    await sendAdminEmailVerification(validated.email, reservation.code)
  } catch (error) {
    if (!(error instanceof EmailVerificationDeliveryError)) throw error
    console.error('Failed to send admin verification email:', error.message)
    return {
      success: false as const,
      error:
        'Could not send the verification email. Check SMTP settings in General Settings.',
    }
  }

  return { success: true as const, challengeId: reservation.challengeId }
}

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

    const recentChallenge = await adminEmailVerificationsRepo.findPendingCreatedAt(
      {
        purpose: 'password_reset',
        email: target.email,
        expiresAfter: new Date(now.getTime() - VERIFICATION_RESEND_COOLDOWN_MS),
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

    const outcome = await checkChallengeCode(transaction, challenge, code, 'consume')
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

export async function verifyAdminEmail(
  challengeId: string,
  code: string,
  purpose: 'initial' | 'additional',
) {
  if (!isValidChallengeInput(challengeId, code)) {
    return { success: false as const, error: 'Invalid or expired code.' }
  }

  const currentAdmin =
    purpose === 'additional' ? await getSessionAdmin() : null
  if (purpose === 'additional' && !currentAdmin) {
    return { success: false as const, error: 'Sign in to add an admin.' }
  }

  const result = await runInTransaction(async (transaction) => {
    await lockChallenge(transaction, challengeId)
    const challenge = await adminEmailVerificationsRepo.findOpenForUpdate(
      {
        id: challengeId,
        purpose,
        createdByUserId: purpose === 'additional' ? currentAdmin!.id : undefined,
        maxAttempts: MAX_VERIFICATION_ATTEMPTS,
      },
      transaction,
    )

    if (!challenge) return { status: 'expired' as const }
    const outcome = await checkChallengeCode(transaction, challenge, code, 'consume')
    if (outcome === 'expired') return { status: 'expired' as const }
    if (outcome === 'invalid') return { status: 'invalid' as const }

    if (purpose === 'initial') {
      await lockInitialSignup(transaction)
      if ((await adminUsersRepo.count(transaction)) > 0) {
        await adminEmailVerificationsRepo.markConsumed(challengeId, transaction)
        return { status: 'closed' as const }
      }
    } else {
      const creator = await adminUsersRepo.findActiveId(
        currentAdmin!.id,
        transaction,
      )
      if (!creator) return { status: 'expired' as const }
    }

    await lockEmail(transaction, challenge.email)
    const existingUser = await adminUsersRepo.findIdByEmail(
      challenge.email,
      transaction,
    )
    if (existingUser) {
      await adminEmailVerificationsRepo.deleteById(challengeId, transaction)
      return { status: 'duplicate' as const }
    }

    const user = await adminUsersRepo.insert(
      { email: challenge.email, passwordHash: challenge.passwordHash },
      transaction,
    )
    await adminProfilesRepo.insert(
      {
        userId: user.id,
        displayName: challenge.displayName,
        preferences: {},
      },
      transaction,
    )
    await adminEmailVerificationsRepo.markConsumed(challengeId, transaction)
    return { status: 'created' as const, userId: user.id }
  })

  if (result.status === 'invalid') {
    return {
      success: false as const,
      error: 'Incorrect code. Check your email and try again.',
    }
  }
  if (result.status === 'closed') {
    return { success: false as const, error: 'Initial sign-up is closed.' }
  }
  if (result.status === 'duplicate') {
    return {
      success: false as const,
      error: 'An account with that email already exists.',
    }
  }
  if (result.status !== 'created') {
    return { success: false as const, error: 'Invalid or expired code.' }
  }

  if (purpose === 'initial') await createSession(result.userId)
  return { success: true as const }
}

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

    const recentChallenge = await adminEmailVerificationsRepo.findPendingCreatedAt(
      {
        purpose: 'password_change',
        email: admin.email,
        expiresAfter: new Date(now.getTime() - VERIFICATION_RESEND_COOLDOWN_MS),
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

    const outcome = await checkChallengeCode(transaction, challenge, code, 'delete')
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
