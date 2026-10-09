import { asc } from 'drizzle-orm'
import type { AnyPgColumn } from 'drizzle-orm/pg-core'

export function orderBySortOrder(sortOrder: AnyPgColumn, id: AnyPgColumn) {
  return [asc(sortOrder), asc(id)] as const
}
