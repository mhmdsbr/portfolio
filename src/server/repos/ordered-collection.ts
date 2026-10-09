import { asc, eq, inArray, sql } from 'drizzle-orm'
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core'
import { defaultExecutor, runInTransaction, type DbExecutor } from './executor'

type OrderedTable = PgTable & { id: PgColumn; sortOrder: PgColumn }
type ManagedColumn = 'id' | 'sortOrder' | 'createdAt' | 'updatedAt'

export type OrderedInput<T extends OrderedTable> = Omit<
  T['$inferInsert'],
  ManagedColumn
>

/**
 * Data access for a table that is an admin-ordered list (`id` + `sort_order`).
 * Every method is a single query or one transaction; no validation happens here.
 */
export function createOrderedRepo<T extends OrderedTable>(table: T) {
  type Row = T['$inferSelect']

  return {
    list(executor: DbExecutor = defaultExecutor): Promise<Row[]> {
      return executor
        .select()
        .from(table as PgTable)
        .orderBy(asc(table.sortOrder), asc(table.id)) as unknown as Promise<Row[]>
    },

    /** Inserts at the end of the list; the position is computed inside the INSERT. */
    async append(
      values: OrderedInput<T>,
      executor: DbExecutor = defaultExecutor,
    ): Promise<Row> {
      const [row] = await executor
        .insert(table)
        .values({
          ...values,
          sortOrder: sql`(select coalesce(max(${table.sortOrder}), -1) + 1 from ${table})`,
        } as T['$inferInsert'])
        .returning()
      return row as Row
    },

    async update(
      id: number,
      values: Partial<OrderedInput<T>>,
      executor: DbExecutor = defaultExecutor,
    ): Promise<Row | undefined> {
      const [row] = await executor
        .update(table)
        .set(values as never)
        .where(eq(table.id, id))
        .returning()
      return row as Row | undefined
    },

    /** Returns true when a row was removed. */
    async remove(id: number, executor: DbExecutor = defaultExecutor) {
      const deleted = await executor
        .delete(table)
        .where(eq(table.id, id))
        .returning({ id: table.id })
      return deleted.length > 0
    },

    /** Assigns positions 0..n-1 in the given order, atomically. */
    reorder(ids: number[]) {
      return runInTransaction(async (transaction) => {
        const existing = await transaction
          .select({ id: table.id })
          .from(table as PgTable)
          .where(inArray(table.id, ids))
        if (existing.length !== ids.length) {
          throw new Error('Order contains items that do not exist')
        }
        for (const [index, id] of ids.entries()) {
          await transaction
            .update(table)
            .set({ sortOrder: index } as never)
            .where(eq(table.id, id))
        }
      })
    },
  }
}
