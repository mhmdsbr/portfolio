import { asc, eq } from 'drizzle-orm'
import * as schema from '@/server/db/schema'
import {
  SECTION_CONFIG_DEFAULTS,
  SECTION_DEFAULT_NAVIGATION_TITLES,
  SECTION_KINDS,
} from '@/shared/constants'
import type { SectionKind } from '@/shared/types'
import { readSectionConfig } from '@/server/helpers/section-config'
import { defaultExecutor, type DbExecutor } from './executor'
import type { SectionPresentation, SectionWithConfig } from './types'

/** Reads a section and its normalized config; returns null when not seeded. */
export async function getSection<K extends SectionKind>(
  kind: K,
  executor: DbExecutor = defaultExecutor,
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

export function listSections(executor: DbExecutor = defaultExecutor) {
  return executor
    .select()
    .from(schema.pageSections)
    .orderBy(asc(schema.pageSections.sortOrder), asc(schema.pageSections.id))
}

/** Row id of a section kind, or null when it does not exist. */
export async function findSectionId(
  kind: SectionKind,
  executor: DbExecutor = defaultExecutor,
) {
  const [section] = await executor
    .select({ id: schema.pageSections.id })
    .from(schema.pageSections)
    .where(eq(schema.pageSections.kind, kind))
    .limit(1)
  return section?.id ?? null
}

export function listSectionStates(executor: DbExecutor = defaultExecutor) {
  return executor
    .select({
      kind: schema.pageSections.kind,
      isEnabled: schema.pageSections.isEnabled,
    })
    .from(schema.pageSections)
}

/**
 * Inserts a default row for every section kind that has none, so the admin
 * works on an empty database. Idempotent and safe under concurrent calls.
 */
export async function insertMissingSections(executor: DbExecutor = defaultExecutor) {
  const existing = new Set(
    (await listSectionStates(executor)).map(({ kind }) => kind),
  )
  const missing = SECTION_KINDS.filter((kind) => !existing.has(kind))
  if (missing.length === 0) return

  await executor
    .insert(schema.pageSections)
    .values(
      missing.map((kind) => ({
        kind,
        navigationTitle: SECTION_DEFAULT_NAVIGATION_TITLES[kind],
        sortOrder: SECTION_KINDS.indexOf(kind),
        config: SECTION_CONFIG_DEFAULTS[kind],
      })),
    )
    .onConflictDoNothing({ target: schema.pageSections.kind })
}

/** Stores an already-validated config; returns the updated row or undefined. */
export async function saveSectionConfig(
  kind: SectionKind,
  config: schema.PageSection['config'],
  executor: DbExecutor = defaultExecutor,
) {
  const [section] = await executor
    .update(schema.pageSections)
    .set({ config })
    .where(eq(schema.pageSections.kind, kind))
    .returning()
  return section
}

export async function savePresentation(
  kind: SectionKind,
  values: SectionPresentation,
  executor: DbExecutor = defaultExecutor,
) {
  const [section] = await executor
    .update(schema.pageSections)
    .set(values)
    .where(eq(schema.pageSections.kind, kind))
    .returning()
  return section
}

export async function saveEnabled(
  kind: SectionKind,
  isEnabled: boolean,
  executor: DbExecutor = defaultExecutor,
) {
  await executor
    .update(schema.pageSections)
    .set({ isEnabled })
    .where(eq(schema.pageSections.kind, kind))
}

export async function saveSortOrder(
  kind: SectionKind,
  sortOrder: number,
  executor: DbExecutor = defaultExecutor,
) {
  await executor
    .update(schema.pageSections)
    .set({ sortOrder })
    .where(eq(schema.pageSections.kind, kind))
}
