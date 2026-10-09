'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { orderBySortOrder } from '@/lib/db/order'
import { getSection, updateSectionConfig } from '@/lib/db/sections'

// =============================================
// GET
// =============================================

export async function getAbout() {
  await requireAuth()
  
  const [[profile], section, details] = await Promise.all([
    db.select().from(schema.profile).limit(1),
    getSection('about'),
    db.select().from(schema.profileFacts).orderBy(
      ...orderBySortOrder(schema.profileFacts.sortOrder, schema.profileFacts.id),
    ),
  ])
  
  return {
    id: 0,
    buttonText: section?.config.buttonText ?? null,
    buttonUrl: section?.config.buttonUrl ?? null,
    title: section?.title ?? null,
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
  
  const name = formData.get('name') as string
  const jobTitle = formData.get('jobTitle') as string
  const description = formData.get('description') as string
  const buttonText = formData.get('buttonText') as string
  const buttonUrl = formData.get('buttonUrl') as string
  
  const profileValues = {
    name: name || null,
    jobTitle: jobTitle || null,
    biography: description || null,
  }
  const about = await db.transaction(async (transaction) => {
    const { config } = await updateSectionConfig(
      'about',
      { buttonText, buttonUrl },
      transaction,
    )

    const [existingProfile] = await transaction
      .select()
      .from(schema.profile)
      .limit(1)
    if (existingProfile) {
      await transaction.update(schema.profile)
        .set(profileValues)
        .where(eq(schema.profile.id, existingProfile.id))
    } else {
      await transaction.insert(schema.profile).values(profileValues)
    }

    return config
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
    .orderBy(...orderBySortOrder(schema.profileFacts.sortOrder, schema.profileFacts.id))
  
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