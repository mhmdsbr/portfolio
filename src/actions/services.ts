'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'

// =============================================
// GET
// =============================================

export async function getServices() {
  await requireAuth()
  
  const [services] = await db.select()
    .from(schema.servicesSection)
    .limit(1)
  
  const items = await db.select()
    .from(schema.serviceItems)
    .orderBy(asc(schema.serviceItems.sortOrder))
  
  return {
    ...services,
    items,
  }
}

// =============================================
// UPDATE SERVICES SECTION
// =============================================

export async function updateServices(formData: FormData) {
  await requireAuth()
  
  const title = formData.get('title') as string
  const overlayTitle = formData.get('overlayTitle') as string
  
  const values = {
      title: title || null,
      overlayTitle: overlayTitle || null,
  }
  const [existingServices] = await db.select().from(schema.servicesSection).limit(1)
  const [services] = existingServices
    ? await db.update(schema.servicesSection).set(values).where(eq(schema.servicesSection.id, existingServices.id)).returning()
    : await db.insert(schema.servicesSection).values(values).returning()
  
  revalidatePath('/admin/services')
  revalidatePath('/api/all')
  
  return services
}

// =============================================
// SERVICE ITEMS CRUD
// =============================================

export async function createServiceItem(formData: FormData) {
  await requireAuth()
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const icon = formData.get('icon') as string
  
  const [services] = await db.select()
    .from(schema.servicesSection)
    .limit(1)
  
  const servicesRecord = services ?? (await db.insert(schema.servicesSection).values({}).returning())[0]
  
  // Get current max sort order
  const existing = await db.select()
    .from(schema.serviceItems)
    .where(eq(schema.serviceItems.servicesId, servicesRecord.id))
    .orderBy(asc(schema.serviceItems.sortOrder))
  
  const sortOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder! + 1 : 0
  
  const [item] = await db.insert(schema.serviceItems)
    .values({
      servicesId: servicesRecord.id,
      title,
      content: content || null,
      icon: (icon || null) as schema.NewServiceItem['icon'],
      sortOrder,
    })
    .returning()
  
  revalidatePath('/admin/services')
  revalidatePath('/api/all')
  
  return item
}

export async function updateServiceItem(id: number, formData: FormData) {
  await requireAuth()
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const icon = formData.get('icon') as string
  
  const [item] = await db.update(schema.serviceItems)
    .set({
      title,
      content: content || null,
      icon: (icon || null) as schema.NewServiceItem['icon'],
    })
    .where(eq(schema.serviceItems.id, id))
    .returning()
  
  revalidatePath('/admin/services')
  revalidatePath('/api/all')
  
  return item
}

export async function deleteServiceItem(id: number) {
  await requireAuth()
  
  await db.delete(schema.serviceItems)
    .where(eq(schema.serviceItems.id, id))
  
  revalidatePath('/admin/services')
  revalidatePath('/api/all')
}

export async function reorderServiceItems(ids: number[]) {
  await requireAuth()
  
  await Promise.all(
    ids.map((id, index) =>
      db.update(schema.serviceItems)
        .set({ sortOrder: index })
        .where(eq(schema.serviceItems.id, id))
    )
  )
  
  revalidatePath('/admin/services')
  revalidatePath('/api/all')
}