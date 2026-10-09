'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import {
  requireSection,
  requireSectionId,
  updateSectionConfig,
} from '@/lib/db/sections'
import { requiredText } from '@/lib/validation'

// =============================================
// GET
// =============================================

export async function getHero() {
  await requireAuth()

  const { section, config } = await requireSection('hero')
  const titles = await db.select()
    .from(schema.heroTitles)
    .where(eq(schema.heroTitles.sectionId, section.id))
    .orderBy(asc(schema.heroTitles.sortOrder), asc(schema.heroTitles.id))

  return { section, config, titles: titles.map((t) => t.title) }
}

// =============================================
// UPDATE HERO SECTION
// =============================================

export async function updateHero(formData: FormData) {
  await requireAuth()

  const { config } = await updateSectionConfig('hero', {
    location: formData.get('location'),
    subtitleOne: formData.get('subtitleOne'),
    subtitleTwo: formData.get('subtitleTwo'),
    logoUrl: formData.get('logoUrl'),
  })

  revalidatePath('/admin/hero')
  revalidatePath('/api/all')

  return config
}

// =============================================
// UPDATE HERO TITLES
// =============================================

export async function updateHeroTitles(titles: string[]) {
  await requireAuth()

  const cleanTitles = titles.map((title) => requiredText(title, 'Hero title'))

  await db.transaction(async (transaction) => {
    const sectionId = await requireSectionId('hero', transaction)

    await transaction.delete(schema.heroTitles)
      .where(eq(schema.heroTitles.sectionId, sectionId))
    if (cleanTitles.length > 0) {
      await transaction.insert(schema.heroTitles)
        .values(
          cleanTitles.map((title, index) => ({
            sectionId,
            title,
            sortOrder: index,
          }))
        )
    }
  })

  revalidatePath('/admin/hero')
  revalidatePath('/api/all')
}
