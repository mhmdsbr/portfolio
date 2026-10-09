import { sql } from 'drizzle-orm'
import type { DbExecutor } from './executor'

// Advisory lock namespaces; the second key serializes a specific resource.
// Inlined as literals so Postgres resolves the (int, int) overload.
const ACCOUNT_LOCK = sql.raw('735241')
const CHALLENGE_LOCK = sql.raw('735242')

/** Serializes creation of the first admin account. */
export function lockInitialSignup(executor: DbExecutor) {
  return executor.execute(sql`SELECT pg_advisory_xact_lock(${ACCOUNT_LOCK}, 1)`)
}

/** Serializes changes to which admin accounts are active. */
export function lockAdminActivation(executor: DbExecutor) {
  return executor.execute(sql`SELECT pg_advisory_xact_lock(${ACCOUNT_LOCK}, 2)`)
}

/** Serializes verification and account changes for one email address. */
export function lockEmail(executor: DbExecutor, email: string) {
  return executor.execute(
    sql`SELECT pg_advisory_xact_lock(${ACCOUNT_LOCK}, hashtext(${email}))`,
  )
}

/** Serializes verification attempts for one challenge. */
export function lockChallenge(executor: DbExecutor, challengeId: string) {
  return executor.execute(
    sql`SELECT pg_advisory_xact_lock(${CHALLENGE_LOCK}, hashtext(${challengeId}))`,
  )
}
