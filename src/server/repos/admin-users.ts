import { and, count, eq } from 'drizzle-orm'
import * as schema from '@/lib/db/schema'
import { defaultExecutor, type DbExecutor } from './executor'

export const adminUsersRepo = {
  async count(executor: DbExecutor = defaultExecutor) {
    const [result] = await executor.select({ value: count() }).from(schema.adminUsers)
    return result.value
  },

  async countActive(executor: DbExecutor = defaultExecutor) {
    const [result] = await executor
      .select({ value: count() })
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.isActive, true))
    return result.value
  },

  async findIdByEmail(email: string, executor: DbExecutor = defaultExecutor) {
    const [user] = await executor
      .select({ id: schema.adminUsers.id })
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.email, email))
      .limit(1)
    return user
  },

  async findPasswordHashById(id: number, executor: DbExecutor = defaultExecutor) {
    const [user] = await executor
      .select({ passwordHash: schema.adminUsers.passwordHash })
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.id, id))
      .limit(1)
    return user
  },

  async findLoginByEmail(email: string, executor: DbExecutor = defaultExecutor) {
    const [user] = await executor
      .select({
        id: schema.adminUsers.id,
        passwordHash: schema.adminUsers.passwordHash,
        isActive: schema.adminUsers.isActive,
      })
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.email, email))
      .limit(1)
    return user
  },

  async findActiveId(id: number, executor: DbExecutor = defaultExecutor) {
    const [user] = await executor
      .select({ id: schema.adminUsers.id })
      .from(schema.adminUsers)
      .where(and(eq(schema.adminUsers.id, id), eq(schema.adminUsers.isActive, true)))
      .limit(1)
    return user
  },

  /** Active account with its display name (null when the profile row is missing). */
  async findActiveWithDisplayName(id: number, executor: DbExecutor = defaultExecutor) {
    const [user] = await executor
      .select({
        email: schema.adminUsers.email,
        displayName: schema.adminProfiles.displayName,
      })
      .from(schema.adminUsers)
      .leftJoin(
        schema.adminProfiles,
        eq(schema.adminProfiles.userId, schema.adminUsers.id),
      )
      .where(and(eq(schema.adminUsers.id, id), eq(schema.adminUsers.isActive, true)))
      .limit(1)
    return user
  },

  listWithProfiles(executor: DbExecutor = defaultExecutor) {
    return executor
      .select({
        id: schema.adminUsers.id,
        email: schema.adminUsers.email,
        displayName: schema.adminProfiles.displayName,
        isActive: schema.adminUsers.isActive,
        createdAt: schema.adminUsers.createdAt,
      })
      .from(schema.adminUsers)
      .innerJoin(
        schema.adminProfiles,
        eq(schema.adminProfiles.userId, schema.adminUsers.id),
      )
      .orderBy(schema.adminUsers.createdAt, schema.adminUsers.id)
  },

  async insert(
    values: { email: string; passwordHash: string },
    executor: DbExecutor = defaultExecutor,
  ) {
    const [user] = await executor
      .insert(schema.adminUsers)
      .values(values)
      .returning({ id: schema.adminUsers.id })
    return user
  },

  async updateEmail(id: number, email: string, executor: DbExecutor = defaultExecutor) {
    await executor
      .update(schema.adminUsers)
      .set({ email, updatedAt: new Date() })
      .where(eq(schema.adminUsers.id, id))
  },

  async updatePasswordByActiveEmail(
    email: string,
    passwordHash: string,
    executor: DbExecutor = defaultExecutor,
  ) {
    const [user] = await executor
      .update(schema.adminUsers)
      .set({ passwordHash, updatedAt: new Date() })
      .where(and(eq(schema.adminUsers.email, email), eq(schema.adminUsers.isActive, true)))
      .returning({ id: schema.adminUsers.id })
    return user
  },

  async updatePasswordByActiveIdAndEmail(
    id: number,
    email: string,
    passwordHash: string,
    executor: DbExecutor = defaultExecutor,
  ) {
    const [user] = await executor
      .update(schema.adminUsers)
      .set({ passwordHash, updatedAt: new Date() })
      .where(
        and(
          eq(schema.adminUsers.id, id),
          eq(schema.adminUsers.email, email),
          eq(schema.adminUsers.isActive, true),
        ),
      )
      .returning({ id: schema.adminUsers.id })
    return user
  },

  async setActive(id: number, isActive: boolean, executor: DbExecutor = defaultExecutor) {
    const [user] = await executor
      .update(schema.adminUsers)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(schema.adminUsers.id, id))
      .returning({ id: schema.adminUsers.id })
    return user
  },
}
