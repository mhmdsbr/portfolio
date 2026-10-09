'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { SECTION_KINDS, type SectionKind } from '@/lib/db/constants'
import { asc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'

const isSectionKind = (value: unknown): value is SectionKind =>
  typeof value === 'string' && (SECTION_KINDS as readonly string[]).includes(value)

export async function getHeader() {
  await requireAuth()

  const sections = await db.select()
    .from(schema.pageSections)
    .orderBy(asc(schema.pageSections.sortOrder), asc(schema.pageSections.id))

  return {
    sections,
  }
}

export async function updatePageSection(
  kind: SectionKind,
  values: { navigationTitle: string; title: string },
) {
  await requireAuth()

  if (
    !isSectionKind(kind) ||
    !values ||
    typeof values.navigationTitle !== 'string' ||
    typeof values.title !== 'string'
  ) {
    throw new Error('Invalid page section metadata')
  }

  const normalizedValues = {
    navigationTitle: values.navigationTitle.trim(),
    title: values.title.trim() || null,
  }
  if (!normalizedValues.navigationTitle) {
    throw new Error('A valid section and non-empty navigation title are required')
  }

  const [section] = await db.update(schema.pageSections)
    .set(normalizedValues)
    .where(eq(schema.pageSections.kind, kind))
    .returning()

  if (!section) throw new Error('Portfolio section not found')

  revalidatePath('/admin/header')
  revalidatePath(`/admin/${kind}`)
  revalidatePath('/')
  revalidatePath('/api/all')

  return section
}

export async function togglePortfolioSection(kind: SectionKind, isEnabled: boolean) {
  await requireAuth()

  if (!isSectionKind(kind) || typeof isEnabled !== 'boolean') {
    throw new Error('Invalid portfolio section update')
  }

  await db.transaction(async (transaction) => {
    const [section] = await transaction.select()
      .from(schema.pageSections)
      .where(eq(schema.pageSections.kind, kind))
      .limit(1)
    if (!section) {
      throw new Error('Portfolio section not found')
    }

    if (!isEnabled) {
      const enabledSections = await transaction.select({ id: schema.pageSections.id })
        .from(schema.pageSections)
        .where(eq(schema.pageSections.isEnabled, true))
      if (section.isEnabled && enabledSections.length <= 1) {
        throw new Error('At least one portfolio section must remain visible')
      }
    }

    await transaction.update(schema.pageSections)
      .set({ isEnabled })
      .where(eq(schema.pageSections.kind, kind))
  })

  revalidatePath('/admin/header')
  revalidatePath(`/admin/${kind}`)
  revalidatePath('/')
  revalidatePath('/api/all')
}

export async function reorderHeaderSections(kinds: SectionKind[]) {
  await requireAuth()

  if (
    kinds.length === 0 ||
    !kinds.every(isSectionKind) ||
    new Set(kinds).size !== kinds.length
  ) {
    throw new Error('Invalid portfolio section order')
  }

  await db.transaction(async (transaction) => {
    const existingSections = await transaction.select({ kind: schema.pageSections.kind })
      .from(schema.pageSections)
    const existingKinds = new Set<string>(existingSections.map(({ kind }) => kind))
    if (kinds.some((kind) => !existingKinds.has(kind)) || existingKinds.size !== kinds.length) {
      throw new Error('Portfolio section order does not match the configured sections')
    }

    await Promise.all(kinds.map((kind, index) =>
      transaction.update(schema.pageSections)
        .set({ sortOrder: index })
        .where(eq(schema.pageSections.kind, kind)),
    ))
  })

  revalidatePath('/admin/header')
  revalidatePath('/api/all')
  revalidatePath('/')
}
