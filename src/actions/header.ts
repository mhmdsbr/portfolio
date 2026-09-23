'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq, asc, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'

export async function getHeader() {
  await requireAuth()
  
  const [settings] = await db.select()
    .from(schema.headerSettings)
    .limit(1)
  
  const sections = await db.select()
    .from(schema.headerSections)
    .orderBy(asc(schema.headerSections.sortOrder))
  
  return {
    settings: settings || { defaultTitle: 'Welcome' },
    sections,
  }
}

export async function updateHeaderSection(id: number, title: string) {
  await requireAuth()
  
  const [section] = await db.update(schema.headerSections)
    .set({ title })
    .where(eq(schema.headerSections.id, id))
    .returning()
  
  revalidatePath('/admin/header')
  revalidatePath('/api/all')
  
  return section
}

export async function addHeaderSection(sectionId: string, title: string) {
  await requireAuth()

  const normalizedSectionId = sectionId.trim()
  const normalizedTitle = title.trim()

  if (!normalizedSectionId || !normalizedTitle) {
    throw new Error('Section ID and title are required')
  }

  const [lastSection] = await db.select({ sortOrder: schema.headerSections.sortOrder })
    .from(schema.headerSections)
    .orderBy(desc(schema.headerSections.sortOrder))
    .limit(1)

  const [section] = await db.insert(schema.headerSections)
    .values({
      sectionId: normalizedSectionId,
      title: normalizedTitle,
      sortOrder: (lastSection?.sortOrder ?? -1) + 1,
    })
    .returning()

  revalidatePath('/admin/header')
  revalidatePath('/api/all')

  return section
}

export async function updateHeaderSettings(formData: FormData) {
  await requireAuth()
  
  const defaultTitle = formData.get('defaultTitle') as string

  const values = { defaultTitle: defaultTitle || 'Welcome' }
  const [existingSettings] = await db.select().from(schema.headerSettings).limit(1)
  const [settings] = existingSettings
    ? await db.update(schema.headerSettings).set(values).where(eq(schema.headerSettings.id, existingSettings.id)).returning()
    : await db.insert(schema.headerSettings).values(values).returning()
  
  revalidatePath('/admin/header')
  revalidatePath('/api/all')
  
  return settings
}

export async function reorderHeaderSections(ids: number[]) {
  await requireAuth()
  
  await Promise.all(
    ids.map((id, index) => 
      db.update(schema.headerSections)
        .set({ sortOrder: index })
        .where(eq(schema.headerSections.id, id))
    )
  )
  
  revalidatePath('/admin/header')
  revalidatePath('/api/all')
}