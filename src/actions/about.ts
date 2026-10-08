'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { ensurePortfolioSections } from '@/lib/db/portfolio-sections'

// =============================================
// GET
// =============================================

export async function getAbout() {
  await requireAuth()
  
  const [[about], [profile], [section], details] = await Promise.all([
    db.select().from(schema.aboutSection).limit(1),
    db.select().from(schema.portfolioProfile).limit(1),
    db.select().from(schema.pageSections).where(eq(schema.pageSections.sectionKey, 'about')).limit(1),
    db.select().from(schema.profileFacts).orderBy(
      asc(schema.profileFacts.sortOrder),
      asc(schema.profileFacts.id),
    ),
  ])
  
  return {
    ...about,
    title: section?.title ?? null,
    overlayTitle: section?.overlayTitle ?? null,
    name: profile?.name ?? null,
    jobTitle: profile?.jobTitle ?? null,
    description: profile?.biography ?? null,
    details,
  }
}

// =============================================
// UPDATE ABOUT SECTION
// =============================================

export async function updateAbout(formData: FormData) {
  await requireAuth()
  await ensurePortfolioSections()
  
  const name = formData.get('name') as string
  const jobTitle = formData.get('jobTitle') as string
  const description = formData.get('description') as string
  const buttonText = formData.get('buttonText') as string
  const buttonUrl = formData.get('buttonUrl') as string
  
  const aboutValues = {
    buttonText: buttonText || null,
    buttonUrl: buttonUrl || null,
  }
  const profileValues = {
    name: name || null,
    jobTitle: jobTitle || null,
    biography: description || null,
  }
  const [about] = await db.transaction(async (transaction) => {
    const [existingAbout] = await transaction
      .select()
      .from(schema.aboutSection)
      .where(eq(schema.aboutSection.sectionKey, 'about'))
      .limit(1)
    const [updatedAbout] = existingAbout
      ? await transaction.update(schema.aboutSection)
          .set(aboutValues)
          .where(eq(schema.aboutSection.id, existingAbout.id))
          .returning()
      : await transaction.insert(schema.aboutSection)
          .values({ ...aboutValues, sectionKey: 'about' })
          .returning()

    const [existingProfile] = await transaction
      .select()
      .from(schema.portfolioProfile)
      .limit(1)
    if (existingProfile) {
      await transaction.update(schema.portfolioProfile)
        .set(profileValues)
        .where(eq(schema.portfolioProfile.id, existingProfile.id))
    } else {
      await transaction.insert(schema.portfolioProfile).values(profileValues)
    }

    return [updatedAbout]
  })
  
  revalidatePath('/admin/about')
  revalidatePath('/')
  revalidatePath('/api/all')
  
  return about
}

// =============================================
// DETAILS CRUD
// =============================================

export async function createDetail(formData: FormData) {
  await requireAuth()
  
  const number = parseInt(formData.get('number') as string)
  const title = formData.get('title') as string
  
  const existing = await db.select()
    .from(schema.profileFacts)
    .orderBy(asc(schema.profileFacts.sortOrder), asc(schema.profileFacts.id))
  
  const sortOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder! + 1 : 0
  
  const [detail] = await db.insert(schema.profileFacts)
    .values({
      number,
      title,
      sortOrder,
    })
    .returning()
  
  revalidatePath('/admin/about')
  revalidatePath('/api/all')
  
  return detail
}

export async function updateDetail(id: number, formData: FormData) {
  await requireAuth()
  
  const number = parseInt(formData.get('number') as string)
  const title = formData.get('title') as string
  
  const [detail] = await db.update(schema.profileFacts)
    .set({
      number,
      title,
    })
    .where(eq(schema.profileFacts.id, id))
    .returning()
  
  revalidatePath('/admin/about')
  revalidatePath('/api/all')
  
  return detail
}

export async function deleteDetail(id: number) {
  await requireAuth()
  
  await db.delete(schema.profileFacts)
    .where(eq(schema.profileFacts.id, id))
  
  revalidatePath('/admin/about')
  revalidatePath('/api/all')
}

// =============================================
// REORDER
// =============================================

export async function reorderDetails(ids: number[]) {
  await requireAuth()
  
  await Promise.all(
    ids.map((id, index) =>
      db.update(schema.profileFacts)
        .set({ sortOrder: index })
        .where(eq(schema.profileFacts.id, id))
    )
  )
  
  revalidatePath('/admin/about')
  revalidatePath('/api/all')
}