import { db } from '@/lib/db'

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

/** Either the shared connection or an open transaction. */
export type DbExecutor = typeof db | Transaction

/** Lets services group several repo calls atomically without importing `db`. */
export function runInTransaction<T>(work: (transaction: Transaction) => Promise<T>) {
  return db.transaction(work)
}

export { db as defaultExecutor }
