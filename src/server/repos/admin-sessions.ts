import { and, eq, gt, sql } from 'drizzle-orm'
import * as schema from '@/lib/db/schema'
import { defaultExecutor, type DbExecutor } from './executor'

/** Session ids are always passed hashed; raw ids never reach the DB. */
export const adminSessionsRepo = {
  async insert(
    values: { sessionId: string; userId: number; expiresAt: Date },
    executor: DbExecutor = defaultExecutor,
  ) {
    await executor.insert(schema.adminSessions).values(values)
  },

  async findActiveAdmin(sessionId: string, executor: DbExecutor = defaultExecutor) {
    const [admin] = await executor
      .select({
        id: schema.adminUsers.id,
        email: schema.adminUsers.email,
      })
      .from(schema.adminSessions)
      .innerJoin(
        schema.adminUsers,
        eq(schema.adminSessions.userId, schema.adminUsers.id),
      )
      .where(
        and(
          eq(schema.adminSessions.sessionId, sessionId),
          gt(schema.adminSessions.expiresAt, new Date()),
          eq(schema.adminUsers.isActive, true),
        ),
      )
      .limit(1)
    return admin
  },

  async deleteById(sessionId: string, executor: DbExecutor = defaultExecutor) {
    await executor
      .delete(schema.adminSessions)
      .where(eq(schema.adminSessions.sessionId, sessionId))
  },

  async deleteByUserId(userId: number, executor: DbExecutor = defaultExecutor) {
    await executor
      .delete(schema.adminSessions)
      .where(eq(schema.adminSessions.userId, userId))
  },

  /** Deletes all of a user's sessions except the one with `keepSessionId`, if given. */
  async deleteByUserIdExcept(
    userId: number,
    keepSessionId: string | undefined,
    executor: DbExecutor = defaultExecutor,
  ) {
    await executor
      .delete(schema.adminSessions)
      .where(
        keepSessionId
          ? and(
              eq(schema.adminSessions.userId, userId),
              sql`${schema.adminSessions.sessionId} <> ${keepSessionId}`,
            )
          : eq(schema.adminSessions.userId, userId),
      )
  },
}
