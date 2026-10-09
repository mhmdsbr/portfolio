import { asc, eq } from 'drizzle-orm'
import * as schema from '@/lib/db/schema'
import { defaultExecutor, type DbExecutor } from './executor'

export function listHeroTitles(
  sectionId: number,
  executor: DbExecutor = defaultExecutor,
) {
  return executor
    .select()
    .from(schema.heroTitles)
    .where(eq(schema.heroTitles.sectionId, sectionId))
    .orderBy(asc(schema.heroTitles.sortOrder), asc(schema.heroTitles.id))
}

export async function replaceHeroTitles(
  executor: DbExecutor,
  sectionId: number,
  titles: string[],
) {
  await executor
    .delete(schema.heroTitles)
    .where(eq(schema.heroTitles.sectionId, sectionId))
  if (titles.length === 0) return
  await executor
    .insert(schema.heroTitles)
    .values(titles.map((title, sortOrder) => ({ sectionId, title, sortOrder })))
}
