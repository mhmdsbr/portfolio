'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'

// =============================================
// GET
// =============================================

export async function getAbout() {
  await requireAuth()
  
  const [about] = await db.select()
    .from(schema.aboutSection)
    .limit(1)
  
  const contactInfo = await db.select()
    .from(schema.aboutContactInfo)
    .orderBy(asc(schema.aboutContactInfo.sortOrder))
  
  const details = await db.select()
    .from(schema.aboutDetails)
    .orderBy(asc(schema.aboutDetails.sortOrder))
  
  return {
    ...about,
    contactInfo,
    details,
  }
}

// =============================================
// UPDATE ABOUT SECTION
// =============================================

export async function updateAbout(formData: FormData) {
  await requireAuth()
  
  const title = formData.get('title') as string
  const overlayTitle = formData.get('overlayTitle') as string
  const name = formData.get('name') as string
  const jobTitle = formData.get('jobTitle') as string
  const description = formData.get('description') as string
  const buttonText = formData.get('buttonText') as string
  const buttonUrl = formData.get('buttonUrl') as string
  
  const [about] = await db.update(schema.aboutSection)
    .set({
      title: title || null,
      overlayTitle: overlayTitle || null,
      name: name || null,
      jobTitle: jobTitle || null,
      description: description || null,
      buttonText: buttonText || null,
      buttonUrl: buttonUrl || null,
    })
    .where(eq(schema.aboutSection.id, 1))
    .returning()
  
  revalidatePath('/admin/about')
  revalidatePath('/api/all')
  
  return about
}

// =============================================
// CONTACT INFO CRUD
// =============================================

export async function createContactInfo(formData: FormData) {
  await requireAuth()
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  // Get the about section ID (should be 1)
  const [about] = await db.select()
    .from(schema.aboutSection)
    .limit(1)
  
  if (!about) {
    throw new Error('About section not found')
  }
  
  // Get current max sort order
  const existing = await db.select()
    .from(schema.aboutContactInfo)
    .where(eq(schema.aboutContactInfo.aboutId, about.id))
    .orderBy(asc(schema.aboutContactInfo.sortOrder))
  
  const sortOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder! + 1 : 0
  
  const [contactInfo] = await db.insert(schema.aboutContactInfo)
    .values({
      aboutId: about.id,
      title,
      content,
      sortOrder,
    })
    .returning()
  
  revalidatePath('/admin/about')
  revalidatePath('/api/all')
  
  return contactInfo
}

export async function updateContactInfo(id: number, formData: FormData) {
  await requireAuth()
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  const [contactInfo] = await db.update(schema.aboutContactInfo)
    .set({
      title,
      content,
    })
    .where(eq(schema.aboutContactInfo.id, id))
    .returning()
  
  revalidatePath('/admin/about')
  revalidatePath('/api/all')
  
  return contactInfo
}

export async function deleteContactInfo(id: number) {
  await requireAuth()
  
  await db.delete(schema.aboutContactInfo)
    .where(eq(schema.aboutContactInfo.id, id))
  
  revalidatePath('/admin/about')
  revalidatePath('/api/all')
}

// =============================================
// DETAILS CRUD
// =============================================

export async function createDetail(formData: FormData) {
  await requireAuth()
  
  const number = parseInt(formData.get('number') as string)
  const title = formData.get('title') as string
  
  const [about] = await db.select()
    .from(schema.aboutSection)
    .limit(1)
  
  if (!about) {
    throw new Error('About section not found')
  }
  
  // Get current max sort order
  const existing = await db.select()
    .from(schema.aboutDetails)
    .where(eq(schema.aboutDetails.aboutId, about.id))
    .orderBy(asc(schema.aboutDetails.sortOrder))
  
  const sortOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder! + 1 : 0
  
  const [detail] = await db.insert(schema.aboutDetails)
    .values({
      aboutId: about.id,
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
  
  const [detail] = await db.update(schema.aboutDetails)
    .set({
      number,
      title,
    })
    .where(eq(schema.aboutDetails.id, id))
    .returning()
  
  revalidatePath('/admin/about')
  revalidatePath('/api/all')
  
  return detail
}

export async function deleteDetail(id: number) {
  await requireAuth()
  
  await db.delete(schema.aboutDetails)
    .where(eq(schema.aboutDetails.id, id))
  
  revalidatePath('/admin/about')
  revalidatePath('/api/all')
}

// =============================================
// REORDER
// =============================================

export async function reorderContactInfo(ids: number[]) {
  await requireAuth()
  
  await Promise.all(
    ids.map((id, index) =>
      db.update(schema.aboutContactInfo)
        .set({ sortOrder: index })
        .where(eq(schema.aboutContactInfo.id, id))
    )
  )
  
  revalidatePath('/admin/about')
  revalidatePath('/api/all')
}

export async function reorderDetails(ids: number[]) {
  await requireAuth()
  
  await Promise.all(
    ids.map((id, index) =>
      db.update(schema.aboutDetails)
        .set({ sortOrder: index })
        .where(eq(schema.aboutDetails.id, id))
    )
  )
  
  revalidatePath('/admin/about')
  revalidatePath('/api/all')
}