import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import type { SectionKind } from '@/lib/db/constants'
import {
  readSectionConfig,
  sanitizeSectionConfig,
  type SectionConfigMap,
} from '@/lib/db/section-config'

export type DbExecutor =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0]

export type SectionWithConfig<K extends SectionKind> = Omit<
  schema.PageSection,
  'kind' | 'config'
> & {
  kind: K
  config: SectionConfigMap[K]
}

/** Reads a section and its normalized config; returns null when not seeded. */
export async function getSection<K extends SectionKind>(
  kind: K,
  executor: DbExecutor = db,
): Promise<SectionWithConfig<K> | null> {
  const [section] = await executor
    .select()
    .from(schema.pageSections)
    .where(eq(schema.pageSections.kind, kind))
    .limit(1)
  if (!section) return null
  return {
    ...section,
    kind,
    config: readSectionConfig(kind, section.config),
  }
}

/** Replaces a section's config with validated input. */
export async function updateSectionConfig<K extends SectionKind>(
  kind: K,
  input: Record<string, unknown>,
  executor: DbExecutor = db,
): Promise<SectionWithConfig<K>> {
  const config = sanitizeSectionConfig(kind, input)
  const [section] = await executor
    .update(schema.pageSections)
    .set({ config })
    .where(eq(schema.pageSections.kind, kind))
    .returning()
  if (!section) throw new Error(`Page section "${kind}" not found`)
  return { ...section, kind, config }
}

/** Resolves the row id of a section kind, throwing when it does not exist. */
export async function requireSectionId(
  kind: SectionKind,
  executor: DbExecutor = db,
): Promise<number> {
  const [section] = await executor
    .select({ id: schema.pageSections.id })
    .from(schema.pageSections)
    .where(eq(schema.pageSections.kind, kind))
    .limit(1)
  if (!section) throw new Error(`Page section "${kind}" not found`)
  return section.id
}
