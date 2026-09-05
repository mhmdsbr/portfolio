'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'

export async function getAbout() {
  await requireAuth()
  
  const [about] = await db.select()
    .from(schema.aboutSection)
    .limit(1)
  
  const contactInfo = await db.select()
    .from(schema.aboutContactInfo)
    .orderBy(schema.aboutContactInfo.sortOrder)
  
  const details = await db.select()
    .from(schema.aboutDetails)
    .orderBy(schema.aboutDetails.sortOrder)
  
  return { ...about, contactInfo, details }
}

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

// Update contact info
export async function updateContactInfo(infoId: number, formData: FormData) {
  await requireAuth()
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  await db.update(schema.aboutContactInfo)
    .set({ title, content })
    .where(eq(schema.aboutContactInfo.id, infoId))
  
  revalidatePath('/admin/about')
  revalidatePath('/api/all')
}