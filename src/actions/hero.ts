'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'

// =============================================
// GET
// =============================================

export async function getHero() {
  await requireAuth()

  const [hero] = await db.select()
    .from(schema.heroSection)
    .limit(1)

  const titles = await db.select()
    .from(schema.heroTitles)
    .orderBy(asc(schema.heroTitles.sortOrder))

  return {
    id: hero?.id ?? 0,
    location: hero?.location ?? null,
    subtitleOne: hero?.subtitleOne ?? null,
    subtitleTwo: hero?.subtitleTwo ?? null,
    logoUrl: hero?.logoUrl ?? null,
    titles: titles.map(t => t.title),
  }
}

// =============================================
// UPDATE HERO SECTION
// =============================================

export async function updateHero(formData: FormData) {
  await requireAuth()

  const location = formData.get('location') as string
  const subtitleOne = formData.get('subtitleOne') as string
  const subtitleTwo = formData.get('subtitleTwo') as string
  const logoUrl = formData.get('logoUrl') as string

  const values = {
    location: location || null,
    subtitleOne: subtitleOne || null,
    subtitleTwo: subtitleTwo || null,
    logoUrl: logoUrl || null,
  }

  const [existingHero] = await db.select()
    .from(schema.heroSection)
    .limit(1)

  const [hero] = existingHero
    ? await db.update(schema.heroSection)
        .set(values)
        .where(eq(schema.heroSection.id, existingHero.id))
        .returning()
    : await db.insert(schema.heroSection)
        .values(values)
        .returning()

  revalidatePath('/admin/hero')
  revalidatePath('/api/all')

  return hero
}

// =============================================
// UPDATE HERO TITLES
// =============================================

export async function updateHeroTitles(titles: string[]) {
  await requireAuth()

  const [hero] = await db.select()
    .from(schema.heroSection)
    .limit(1)

  const heroRecord = hero ?? (await db.insert(schema.heroSection)
    .values({})
    .returning())[0]

  // Delete existing titles
  await db.delete(schema.heroTitles)
    .where(eq(schema.heroTitles.heroId, heroRecord.id))

  // Insert new titles
  if (titles.length > 0) {
    await db.insert(schema.heroTitles)
      .values(
        titles.map((title, index) => ({
          heroId: heroRecord.id,
          title: title.trim(),
          sortOrder: index,
        }))
      )
  }

  revalidatePath('/admin/hero')
  revalidatePath('/api/all')
}