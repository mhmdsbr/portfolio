import { eq } from 'drizzle-orm'
import * as schema from '@/lib/db/schema'
import { defaultExecutor, type DbExecutor } from './executor'

export const adminProfilesRepo = {
  async findByUserId(userId: number, executor: DbExecutor = defaultExecutor) {
    const [profile] = await executor
      .select({
        displayName: schema.adminProfiles.displayName,
        bio: schema.adminProfiles.bio,
        preferences: schema.adminProfiles.preferences,
      })
      .from(schema.adminProfiles)
      .where(eq(schema.adminProfiles.userId, userId))
      .limit(1)
    return profile
  },

  async insert(
    values: { userId: number; displayName: string; preferences: Record<string, unknown> },
    executor: DbExecutor = defaultExecutor,
  ) {
    await executor.insert(schema.adminProfiles).values(values)
  },

  async update(
    userId: number,
    values: {
      displayName: string
      bio: string | null
      preferences: Record<string, unknown>
    },
    executor: DbExecutor = defaultExecutor,
  ) {
    await executor
      .update(schema.adminProfiles)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(schema.adminProfiles.userId, userId))
  },
}
