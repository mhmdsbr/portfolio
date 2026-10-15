import { checkVerificationCode } from '@/server/auth/password'
import { adminEmailVerificationsRepo } from '@/server/repos/admin-email-verifications'
import type { Transaction } from '@/server/repos/executor'

export const VERIFICATION_DURATION_MS = 10 * 60 * 1000

export const VERIFICATION_RESEND_COOLDOWN_MS = 60 * 1000

export const MAX_VERIFICATION_ATTEMPTS = 5

type Challenge = NonNullable<
  Awaited<ReturnType<typeof adminEmailVerificationsRepo.findOpenForUpdate>>
>

export function isWithinCooldown(
  now: Date,
  createdAt: Date | null | undefined,
) {
  return (
    !!createdAt &&
    now.getTime() - createdAt.getTime() < VERIFICATION_RESEND_COOLDOWN_MS
  )
}

export function isValidChallengeInput(challengeId: string, code: string) {
  return /^[A-Za-z0-9_-]{43}$/.test(challengeId) && /^\d{6}$/.test(code)
}

/** Verify a locked challenge, counting mismatches and applying its exhaustion policy. */
export async function checkChallengeCode(
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
    await adminEmailVerificationsRepo.setAttempts(
      challenge.id,
      attempts,
      transaction,
    )
  }
  return 'invalid' as const
}
