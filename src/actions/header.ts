'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { asc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'

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
  sectionKey: string,
  values: { navigationTitle: string; title: string },
) {
  await requireAuth()

  if (
    !sectionKey ||
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
    .where(eq(schema.pageSections.sectionKey, sectionKey))
    .returning()

  if (!section) throw new Error('Portfolio section not found')

  revalidatePath('/admin/header')
  revalidatePath('/')
  revalidatePath('/api/all')

  return section
}

export async function togglePortfolioSection(sectionKey: string, isEnabled: boolean) {
  await requireAuth()

  if (!sectionKey || typeof isEnabled !== 'boolean') {
    throw new Error('Invalid portfolio section update')
  }

  await db.transaction(async (transaction) => {
    const [section] = await transaction.select()
      .from(schema.pageSections)
      .where(eq(schema.pageSections.sectionKey, sectionKey))
      .limit(1)
    if (!section) {
      throw new Error('Portfolio section not found')
    }

    if (!isEnabled) {
      const enabledSections = await transaction.select({ sectionKey: schema.pageSections.sectionKey })
        .from(schema.pageSections)
        .where(eq(schema.pageSections.isEnabled, true))
      if (section.isEnabled && enabledSections.length <= 1) {
        throw new Error('At least one portfolio section must remain visible')
      }
    }

    await transaction.update(schema.pageSections)
      .set({ isEnabled })
      .where(eq(schema.pageSections.sectionKey, sectionKey))
  })

  revalidatePath('/')
  revalidatePath('/api/all')
}

export async function reorderHeaderSections(sectionKeys: string[]) {
  await requireAuth()

  if (
    sectionKeys.length === 0 ||
    sectionKeys.some((sectionKey) => !sectionKey) ||
    new Set(sectionKeys).size !== sectionKeys.length
  ) {
    throw new Error('Invalid portfolio section order')
  }

  await db.transaction(async (transaction) => {
    const existingSections = await transaction.select({ sectionKey: schema.pageSections.sectionKey })
      .from(schema.pageSections)
    const existingKeys = new Set(existingSections.map(({ sectionKey }) => sectionKey))
    if (sectionKeys.some((sectionKey) => !existingKeys.has(sectionKey)) || existingKeys.size !== sectionKeys.length) {
      throw new Error('Portfolio section order does not match the configured sections')
    }

    await Promise.all(sectionKeys.map((sectionKey, index) =>
      transaction.update(schema.pageSections)
        .set({ sortOrder: index })
        .where(eq(schema.pageSections.sectionKey, sectionKey)),
    ))
  })

  revalidatePath('/admin/header')
  revalidatePath('/api/all')
  revalidatePath('/')
}
