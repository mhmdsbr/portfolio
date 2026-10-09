import { SECTION_KINDS, type SectionKind } from '@/lib/db/constants'
import { sanitizeSectionConfig } from '@/lib/db/section-config'
import { requiredText } from '@/lib/validation'
import { runInTransaction, type DbExecutor } from '@/server/repos/executor'
import * as sections from '@/server/repos/page-sections'
import type { SectionMeta, SectionWithConfig } from '@/server/repos/page-sections'
import { assertFound } from './shared'

export type { SectionMeta }

export const isSectionKind = (value: unknown): value is SectionKind =>
  typeof value === 'string' && (SECTION_KINDS as readonly string[]).includes(value)

function assertSectionKind(kind: unknown): asserts kind is SectionKind {
  if (!isSectionKind(kind)) throw new Error('Invalid portfolio section')
}

/** Admin-facing section data: shared metadata plus the typed config. */
export async function requireSection<K extends SectionKind>(
  kind: K,
  executor?: DbExecutor,
) {
  const section = await sections.getSection(kind, executor)
  if (!section) {
    throw new Error(
      `Page section "${kind}" not found. Seed the database or restore the page_sections row.`,
    )
  }
  const meta: SectionMeta = {
    id: section.id,
    kind,
    navigationTitle: section.navigationTitle,
    title: section.title,
    isEnabled: section.isEnabled,
  }
  return { section: meta, config: section.config }
}

/** Replaces a section's config with validated input. */
export async function updateSectionConfig<K extends SectionKind>(
  kind: K,
  input: Record<string, unknown>,
): Promise<SectionWithConfig<K>> {
  const config = sanitizeSectionConfig(kind, input)
  const section = assertFound(
    await sections.saveSectionConfig(kind, config),
    `Page section "${kind}"`,
  )
  return { ...section, kind, config }
}

export async function listSections() {
  return { sections: await sections.listSections() }
}

export async function updatePresentation(
  kind: unknown,
  values: { navigationTitle: unknown; title: unknown },
) {
  assertSectionKind(kind)
  if (
    !values ||
    typeof values.navigationTitle !== 'string' ||
    typeof values.title !== 'string'
  ) {
    throw new Error('Invalid page section metadata')
  }
  const navigationTitle = requiredText(values.navigationTitle, 'Navigation title')
  const title = values.title.trim() || null

  return assertFound(
    await sections.savePresentation(kind, { navigationTitle, title }),
    'Portfolio section',
  )
}

export async function setSectionEnabled(kind: unknown, isEnabled: unknown) {
  assertSectionKind(kind)
  if (typeof isEnabled !== 'boolean') {
    throw new Error('Invalid portfolio section update')
  }

  await runInTransaction(async (transaction) => {
    const states = await sections.listSectionStates(transaction)
    const current = assertFound(
      states.find((state) => state.kind === kind),
      'Portfolio section',
    )
    const enabledCount = states.filter((state) => state.isEnabled).length
    if (!isEnabled && current.isEnabled && enabledCount <= 1) {
      throw new Error('At least one portfolio section must remain visible')
    }
    await sections.saveEnabled(kind, isEnabled, transaction)
  })
}

export async function reorderSections(kinds: unknown) {
  if (
    !Array.isArray(kinds) ||
    kinds.length === 0 ||
    !kinds.every(isSectionKind) ||
    new Set(kinds).size !== kinds.length
  ) {
    throw new Error('Invalid portfolio section order')
  }

  await runInTransaction(async (transaction) => {
    const existing = new Set<string>(
      (await sections.listSectionStates(transaction)).map(({ kind }) => kind),
    )
    if (kinds.length !== existing.size || kinds.some((kind) => !existing.has(kind))) {
      throw new Error('Portfolio section order does not match the configured sections')
    }
    for (const [index, kind] of kinds.entries()) {
      await sections.saveSortOrder(kind, index, transaction)
    }
  })
}
