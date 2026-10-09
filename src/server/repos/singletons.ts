import { eq } from 'drizzle-orm'
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core'
import * as schema from '@/lib/db/schema'
import { defaultExecutor, type DbExecutor } from './executor'

type SingletonTable = PgTable & { id: PgColumn }
type ManagedColumn = 'id' | 'createdAt' | 'updatedAt'

/** Data access for a single-row table whose primary key is always 1. */
function createSingletonRepo<T extends SingletonTable>(table: T) {
  type Row = T['$inferSelect']
  type Values = Partial<Omit<T['$inferInsert'], ManagedColumn>>

  return {
    async get(executor: DbExecutor = defaultExecutor): Promise<Row | undefined> {
      const [row] = await executor
        .select()
        .from(table as PgTable)
        .where(eq(table.id, 1))
        .limit(1)
      return row as Row | undefined
    },

    /** Creates the row on first save, otherwise updates it in one statement. */
    async save(values: Values, executor: DbExecutor = defaultExecutor): Promise<Row> {
      const [row] = await executor
        .insert(table)
        .values({ ...values, id: 1 } as T['$inferInsert'])
        .onConflictDoUpdate({
          target: table.id,
          set: { ...values, updatedAt: new Date() } as never,
        })
        .returning()
      return row as Row
    },
  }
}

export const profileRepo = createSingletonRepo(schema.profile)
export const siteConfigRepo = createSingletonRepo(schema.siteConfig)
