import { and, eq, gt, isNull, lt, sql } from 'drizzle-orm'
import * as schema from '@/lib/db/schema'
import { defaultExecutor, type DbExecutor } from './executor'

type Purpose = schema.AdminVerificationPurpose

export const adminEmailVerificationsRepo = {
  async deleteExpired(now: Date, executor: DbExecutor = defaultExecutor) {
    await executor
      .delete(schema.adminEmailVerifications)
      .where(lt(schema.adminEmailVerifications.expiresAt, now))
  },

  /** Creation time of an unconsumed challenge that expires after `expiresAfter`. */
  async findPendingCreatedAt(
    filter: { purpose: Purpose; email?: string; expiresAfter: Date },
    executor: DbExecutor = defaultExecutor,
  ) {
    const [challenge] = await executor
      .select({ createdAt: schema.adminEmailVerifications.createdAt })
      .from(schema.adminEmailVerifications)
      .where(
        and(
          isNull(schema.adminEmailVerifications.consumedAt),
          filter.email === undefined
            ? undefined
            : eq(schema.adminEmailVerifications.email, filter.email),
          eq(schema.adminEmailVerifications.purpose, filter.purpose),
          gt(schema.adminEmailVerifications.expiresAt, filter.expiresAfter),
        ),
      )
      .limit(1)
    return challenge
  },

  /** Deletes challenges of a purpose, narrowed to one email when given. */
  async deleteByPurpose(
    purpose: Purpose,
    email: string | undefined,
    executor: DbExecutor = defaultExecutor,
  ) {
    await executor
      .delete(schema.adminEmailVerifications)
      .where(
        email === undefined
          ? eq(schema.adminEmailVerifications.purpose, purpose)
          : and(
              eq(schema.adminEmailVerifications.email, email),
              eq(schema.adminEmailVerifications.purpose, purpose),
            ),
      )
  },

  async insert(
    values: typeof schema.adminEmailVerifications.$inferInsert,
    executor: DbExecutor = defaultExecutor,
  ) {
    await executor.insert(schema.adminEmailVerifications).values(values)
  },

  /** Locks the row (FOR UPDATE) if it is unconsumed, unexpired and under the attempt limit. */
  async findOpenForUpdate(
    filter: {
      id: string
      purpose: Purpose
      createdByUserId?: number
      maxAttempts: number
    },
    executor: DbExecutor = defaultExecutor,
  ) {
    const [challenge] = await executor
      .select()
      .from(schema.adminEmailVerifications)
      .where(
        and(
          isNull(schema.adminEmailVerifications.consumedAt),
          eq(schema.adminEmailVerifications.id, filter.id),
          eq(schema.adminEmailVerifications.purpose, filter.purpose),
          filter.createdByUserId === undefined
            ? undefined
            : eq(
                schema.adminEmailVerifications.createdByUserId,
                filter.createdByUserId,
              ),
          gt(schema.adminEmailVerifications.expiresAt, new Date()),
          sql`${schema.adminEmailVerifications.attempts} < ${filter.maxAttempts}`,
        ),
      )
      .for('update')
      .limit(1)
    return challenge
  },

  async setAttempts(id: string, attempts: number, executor: DbExecutor = defaultExecutor) {
    await executor
      .update(schema.adminEmailVerifications)
      .set({ attempts })
      .where(eq(schema.adminEmailVerifications.id, id))
  },

  async markConsumed(id: string, executor: DbExecutor = defaultExecutor) {
    await executor
      .update(schema.adminEmailVerifications)
      .set({ consumedAt: new Date() })
      .where(eq(schema.adminEmailVerifications.id, id))
  },

  async deleteById(id: string, executor: DbExecutor = defaultExecutor) {
    await executor
      .delete(schema.adminEmailVerifications)
      .where(eq(schema.adminEmailVerifications.id, id))
  },
}
