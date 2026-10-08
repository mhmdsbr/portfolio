'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'

// =============================================
// GET
// =============================================

export async function getTestimonials() {
  await requireAuth()

  const items = await db.select()
    .from(schema.testimonials)
    .orderBy(asc(schema.testimonials.sortOrder), asc(schema.testimonials.id))
  
  return { items }
}

// =============================================
// TESTIMONIAL ITEMS CRUD
// =============================================

export async function createTestimonialItem(formData: FormData) {
  await requireAuth()
  
  const imageUrl = formData.get('imageUrl') as string
  const title = formData.get('title') as string
  const subtitle = formData.get('subtitle') as string
  const ratingValue = String(formData.get('rating') ?? '').trim()
  const rating = ratingValue ? Number(ratingValue) : null
  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    throw new Error('Rating must be an integer from 1 to 5')
  }
  const body = formData.get('body') as string
  
  const existing = await db.select()
    .from(schema.testimonials)
    .orderBy(asc(schema.testimonials.sortOrder), asc(schema.testimonials.id))
  
  const sortOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder! + 1 : 0
  
  const [item] = await db.insert(schema.testimonials)
    .values({
      imageUrl: imageUrl || null,
      title,
      subtitle: subtitle || null,
      rating,
      body: body || null,
      sortOrder,
    })
    .returning()
  
  revalidatePath('/admin/testimonials')
  revalidatePath('/api/all')
  
  return item
}

export async function updateTestimonialItem(id: number, formData: FormData) {
  await requireAuth()
  
  const imageUrl = formData.get('imageUrl') as string
  const title = formData.get('title') as string
  const subtitle = formData.get('subtitle') as string
  const ratingValue = String(formData.get('rating') ?? '').trim()
  const rating = ratingValue ? Number(ratingValue) : null
  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    throw new Error('Rating must be an integer from 1 to 5')
  }
  const body = formData.get('body') as string
  
  const [item] = await db.update(schema.testimonials)
    .set({
      imageUrl: imageUrl || null,
      title,
      subtitle: subtitle || null,
      rating,
      body: body || null,
    })
    .where(eq(schema.testimonials.id, id))
    .returning()
  
  revalidatePath('/admin/testimonials')
  revalidatePath('/api/all')
  
  return item
}

export async function deleteTestimonialItem(id: number) {
  await requireAuth()
  
  await db.delete(schema.testimonials)
    .where(eq(schema.testimonials.id, id))
  
  revalidatePath('/admin/testimonials')
  revalidatePath('/api/all')
}

export async function reorderTestimonialItems(ids: number[]) {
  await requireAuth()
  
  await Promise.all(
    ids.map((id, index) =>
      db.update(schema.testimonials)
        .set({ sortOrder: index })
        .where(eq(schema.testimonials.id, id))
    )
  )
  
  revalidatePath('/admin/testimonials')
  revalidatePath('/api/all')
}