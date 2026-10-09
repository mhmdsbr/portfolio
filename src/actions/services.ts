'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { SERVICE_ICONS, type ServiceIcon } from '@/lib/db/constants'
import { optionalText, requiredText } from '@/lib/validation'

function parseServiceIcon(value: FormDataEntryValue | null): ServiceIcon | null {
  const icon = optionalText(value)
  if (icon === null) return null
  const validIcon = SERVICE_ICONS.find((candidate) => candidate === icon)
  if (!validIcon) throw new Error('Invalid service icon')
  return validIcon
}

// =============================================
// GET
// =============================================

export async function getServices() {
  await requireAuth()

  const items = await db.select()
    .from(schema.services)
    .orderBy(asc(schema.services.sortOrder), asc(schema.services.id))
  
  return { items }
}

// =============================================
// SERVICE ITEMS CRUD
// =============================================

export async function createServiceItem(formData: FormData) {
  await requireAuth()
  
  const title = requiredText(formData.get('title'), 'Service title')
  const description = formData.get('description') as string
  const icon = parseServiceIcon(formData.get('icon'))
  
  const existing = await db.select()
    .from(schema.services)
    .orderBy(asc(schema.services.sortOrder), asc(schema.services.id))
  
  const sortOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder! + 1 : 0
  
  const [item] = await db.insert(schema.services)
    .values({
      title,
      description: description || null,
      icon,
      sortOrder,
    })
    .returning()
  
  revalidatePath('/admin/services')
  revalidatePath('/api/all')
  
  return item
}

export async function updateServiceItem(id: number, formData: FormData) {
  await requireAuth()
  
  const title = requiredText(formData.get('title'), 'Service title')
  const description = formData.get('description') as string
  const icon = parseServiceIcon(formData.get('icon'))
  
  const [item] = await db.update(schema.services)
    .set({
      title,
      description: description || null,
      icon,
    })
    .where(eq(schema.services.id, id))
    .returning()
  
  revalidatePath('/admin/services')
  revalidatePath('/api/all')
  
  return item
}

export async function deleteServiceItem(id: number) {
  await requireAuth()
  
  await db.delete(schema.services)
    .where(eq(schema.services.id, id))
  
  revalidatePath('/admin/services')
  revalidatePath('/api/all')
}

export async function reorderServiceItems(ids: number[]) {
  await requireAuth()
  
  await Promise.all(
    ids.map((id, index) =>
      db.update(schema.services)
        .set({ sortOrder: index })
        .where(eq(schema.services.id, id))
    )
  )
  
  revalidatePath('/admin/services')
  revalidatePath('/api/all')
}