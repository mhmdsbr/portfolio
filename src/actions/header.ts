'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { PORTFOLIO_SECTIONS, isPortfolioSectionKey } from '@/lib/portfolio-sections'
import { ensurePortfolioSections } from '@/lib/db/portfolio-sections'
import { asc, eq, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'

export async function getHeader() {
  await requireAuth()

  await ensurePortfolioSections()

  const [sections] = await Promise.all([
    db.select()
      .from(schema.pageSections)
      .where(inArray(schema.pageSections.sectionKey, PORTFOLIO_SECTIONS.map(({ key }) => key)))
      .orderBy(asc(schema.pageSections.sortOrder)),
  ])

  return {
    sections,
  }
}

export async function updatePageSection(
  id: number,
  values: { navigationTitle: string; title: string; overlayTitle: string },
) {
  await requireAuth()

  if (
    !Number.isSafeInteger(id) ||
    id <= 0 ||
    !values ||
    typeof values.navigationTitle !== 'string' ||
    typeof values.title !== 'string' ||
    typeof values.overlayTitle !== 'string'
  ) {
    throw new Error('Invalid page section metadata')
  }

  const normalizedValues = {
    navigationTitle: values.navigationTitle.trim(),
    title: values.title.trim() || null,
    overlayTitle: values.overlayTitle.trim() || null,
  }
  if (!normalizedValues.navigationTitle) {
    throw new Error('A valid section and non-empty navigation title are required')
  }

  const [section] = await db.update(schema.pageSections)
    .set(normalizedValues)
    .where(eq(schema.pageSections.id, id))
    .returning()

  if (!section) throw new Error('Portfolio section not found')

  revalidatePath('/admin/header')
  revalidatePath('/')
  revalidatePath('/api/all')

  return section
}

export async function togglePortfolioSection(id: number, isEnabled: boolean) {
  await requireAuth()

  if (!Number.isSafeInteger(id) || id <= 0 || typeof isEnabled !== 'boolean') {
    throw new Error('Invalid portfolio section update')
  }

  await db.transaction(async (transaction) => {
    const [section] = await transaction.select()
      .from(schema.pageSections)
      .where(eq(schema.pageSections.id, id))
      .limit(1)
    if (!section || !isPortfolioSectionKey(section.sectionKey)) {
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
      .where(eq(schema.pageSections.id, id))
  })

  revalidatePath('/')
  revalidatePath('/api/all')
}

export async function reorderHeaderSections(ids: number[]) {
  await requireAuth()

  if (
    ids.length !== PORTFOLIO_SECTIONS.length ||
    ids.some((id) => !Number.isSafeInteger(id) || id <= 0) ||
    new Set(ids).size !== ids.length
  ) {
    throw new Error('Invalid portfolio section order')
  }

  await db.transaction(async (transaction) => {
    const existingSections = await transaction.select({ id: schema.pageSections.id })
      .from(schema.pageSections)
      .where(inArray(
        schema.pageSections.sectionKey,
        PORTFOLIO_SECTIONS.map(({ key }) => key),
      ))
    const existingIds = new Set(existingSections.map(({ id }) => id))
    if (ids.some((id) => !existingIds.has(id)) || existingIds.size !== ids.length) {
      throw new Error('Portfolio section order does not match the configured sections')
    }

    await Promise.all(ids.map((id, index) =>
      transaction.update(schema.pageSections)
        .set({ sortOrder: index })
        .where(eq(schema.pageSections.id, id)),
    ))
  })

  revalidatePath('/admin/header')
  revalidatePath('/api/all')
  revalidatePath('/')
}
