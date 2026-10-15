import {
  EmailVerificationDeliveryError,
  sendAdminEmailVerification,
} from '@/server/email'
import {
  generateChallengeId,
  generateVerificationCode,
  hashPassword,
} from '@/server/auth/password'
import { createSession, getSessionAdmin } from '@/server/auth/session'
import { validateAdminInput } from '@/server/auth/validation'
import { adminEmailVerificationsRepo } from '@/server/repos/admin-email-verifications'
import { adminProfilesRepo } from '@/server/repos/admin-profiles'
import { adminUsersRepo } from '@/server/repos/admin-users'
import {
  lockChallenge,
  lockEmail,
  lockInitialSignup,
} from '@/server/repos/advisory-locks'
import { runInTransaction } from '@/server/repos/executor'
import { getAdminCount } from '../admin-accounts'
import {
  VERIFICATION_DURATION_MS,
  VERIFICATION_RESEND_COOLDOWN_MS,
  MAX_VERIFICATION_ATTEMPTS,
  isWithinCooldown,
  isValidChallengeInput,
  checkChallengeCode,
} from './shared'

export async function beginAdminEmailVerification(
  email: string,
  displayName: string,
  password: string,
  purpose: 'initial' | 'additional',
) {
  const validated = validateAdminInput({ email, displayName, password })
  if (!validated.success) return validated

  const currentAdmin = purpose === 'additional' ? await getSessionAdmin() : null
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

    const recentChallenge =
      await adminEmailVerificationsRepo.findPendingCreatedAt(
        {
          purpose,
          email: purpose === 'initial' ? undefined : validated.email,
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
      purpose,
      purpose === 'initial' ? undefined : validated.email,
      transaction,
    )
    if (purpose === 'initial') {
      if ((await adminUsersRepo.count(transaction)) > 0)
        return 'closed' as const
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

export async function verifyAdminEmail(
  challengeId: string,
  code: string,
  purpose: 'initial' | 'additional',
) {
  if (!isValidChallengeInput(challengeId, code)) {
    return { success: false as const, error: 'Invalid or expired code.' }
  }

  const currentAdmin = purpose === 'additional' ? await getSessionAdmin() : null
  if (purpose === 'additional' && !currentAdmin) {
    return { success: false as const, error: 'Sign in to add an admin.' }
  }

  const result = await runInTransaction(async (transaction) => {
    await lockChallenge(transaction, challengeId)
    const challenge = await adminEmailVerificationsRepo.findOpenForUpdate(
      {
        id: challengeId,
        purpose,
        createdByUserId:
          purpose === 'additional' ? currentAdmin!.id : undefined,
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
