import { SECTION_KINDS } from '@/shared/constants'
import type { SectionKind } from '@/shared/types'
import type { SectionConfigMap } from '@/shared/types'
import { runInTransaction, type DbExecutor } from '@/server/repos/executor'
import * as sections from '@/server/repos/page-sections'
import type { SectionMeta, SectionWithConfig } from '@/server/repos/types'
import { assertFound, ValidationError } from './shared'

export const isSectionKind = (value: unknown): value is SectionKind =>
  typeof value === 'string' && (SECTION_KINDS as readonly string[]).includes(value)

function assertSectionKind(kind: unknown): asserts kind is SectionKind {
  if (!isSectionKind(kind)) throw new ValidationError('Invalid portfolio section')
}

/** Creates default rows for any missing section kinds (admin paths only). */
export function ensureSections(executor?: DbExecutor) {
  return sections.insertMissingSections(executor)
}

/** Admin-facing section data: shared metadata plus the typed config. */
export async function requireSection<K extends SectionKind>(
  kind: K,
  executor?: DbExecutor,
) {
  let section = await sections.getSection(kind, executor)
  if (!section) {
    await ensureSections(executor)
    section = await sections.getSection(kind, executor)
  }
  if (!section) throw new Error(`Page section "${kind}" could not be created.`)
  const meta: SectionMeta = {
    id: section.id,
    kind,
    navigationTitle: section.navigationTitle,
    title: section.title,
    isEnabled: section.isEnabled,
  }
  return { section: meta, config: section.config }
}

/** Replaces a section's config; callers pass input already parsed by its Zod schema. */
export async function updateSectionConfig<K extends SectionKind>(
  kind: K,
  config: SectionConfigMap[K],
): Promise<SectionWithConfig<K>> {
  await ensureSections()
  const section = assertFound(
    await sections.saveSectionConfig(kind, config),
    `Page section "${kind}"`,
  )
  return { ...section, kind, config }
}

export async function listSections() {
  await ensureSections()
  return { sections: await sections.listSections() }
}

export async function updatePresentation(
  kind: unknown,
  values: { navigationTitle: string; title: string | null },
) {
  assertSectionKind(kind)
  await ensureSections()
  return assertFound(
    await sections.savePresentation(kind, values),
    'Portfolio section',
  )
}

export async function setSectionEnabled(kind: SectionKind, isEnabled: boolean) {
  assertSectionKind(kind)
  if (typeof isEnabled !== 'boolean') {
    throw new ValidationError('Invalid portfolio section update')
  }

  await runInTransaction(async (transaction) => {
    await ensureSections(transaction)
    const states = await sections.listSectionStates(transaction)
    const current = assertFound(
      states.find((state) => state.kind === kind),
      'Portfolio section',
    )
    const enabledCount = states.filter((state) => state.isEnabled).length
    if (!isEnabled && current.isEnabled && enabledCount <= 1) {
      throw new ValidationError('At least one portfolio section must remain visible')
    }
    await sections.saveEnabled(kind, isEnabled, transaction)
  })
}

export async function reorderPageLayoutSections(kinds: SectionKind[]) {
  if (
    !Array.isArray(kinds) ||
    kinds.length === 0 ||
    !kinds.every(isSectionKind) ||
    new Set(kinds).size !== kinds.length
  ) {
    throw new ValidationError('Invalid portfolio section order')
  }

  await runInTransaction(async (transaction) => {
    await ensureSections(transaction)
    const existing = new Set<string>(
      (await sections.listSectionStates(transaction)).map(({ kind }) => kind),
    )
    if (kinds.length !== existing.size || kinds.some((kind) => !existing.has(kind))) {
      throw new ValidationError('Portfolio section order does not match the configured sections')
    }
    for (const [index, kind] of kinds.entries()) {
      await sections.saveSortOrder(kind, index, transaction)
    }
  })
}
