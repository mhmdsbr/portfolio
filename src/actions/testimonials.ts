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
  
  const [testimonials] = await db.select()
    .from(schema.testimonialsSection)
    .limit(1)
  
  const items = await db.select()
    .from(schema.testimonialItems)
    .orderBy(asc(schema.testimonialItems.sortOrder))
  
  return {
    ...testimonials,
    items,
  }
}

// =============================================
// UPDATE TESTIMONIALS SECTION
// =============================================

export async function updateTestimonials(formData: FormData) {
  await requireAuth()
  
  const title = formData.get('title') as string
  const overlayTitle = formData.get('overlayTitle') as string
  
  const [testimonials] = await db.update(schema.testimonialsSection)
    .set({
      title: title || null,
      overlayTitle: overlayTitle || null,
    })
    .where(eq(schema.testimonialsSection.id, 1))
    .returning()
  
  revalidatePath('/admin/testimonials')
  revalidatePath('/api/all')
  
  return testimonials
}

// =============================================
// TESTIMONIAL ITEMS CRUD
// =============================================

export async function createTestimonialItem(formData: FormData) {
  await requireAuth()
  
  const imageUrl = formData.get('imageUrl') as string
  const title = formData.get('title') as string
  const subtitle = formData.get('subtitle') as string
  const rating = formData.get('rating') as string
  const content = formData.get('content') as string
  
  const [testimonials] = await db.select()
    .from(schema.testimonialsSection)
    .limit(1)
  
  if (!testimonials) {
    throw new Error('Testimonials section not found')
  }
  
  // Get current max sort order
  const existing = await db.select()
    .from(schema.testimonialItems)
    .where(eq(schema.testimonialItems.testimonialsId, testimonials.id))
    .orderBy(asc(schema.testimonialItems.sortOrder))
  
  const sortOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder! + 1 : 0
  
  const [item] = await db.insert(schema.testimonialItems)
    .values({
      testimonialsId: testimonials.id,
      imageUrl: imageUrl || null,
      title,
      subtitle: subtitle || null,
      rating: rating as any || null,
      content: content || null,
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
  const rating = formData.get('rating') as string
  const content = formData.get('content') as string
  
  const [item] = await db.update(schema.testimonialItems)
    .set({
      imageUrl: imageUrl || null,
      title,
      subtitle: subtitle || null,
      rating: rating as any || null,
      content: content || null,
    })
    .where(eq(schema.testimonialItems.id, id))
    .returning()
  
  revalidatePath('/admin/testimonials')
  revalidatePath('/api/all')
  
  return item
}

export async function deleteTestimonialItem(id: number) {
  await requireAuth()
  
  await db.delete(schema.testimonialItems)
    .where(eq(schema.testimonialItems.id, id))
  
  revalidatePath('/admin/testimonials')
  revalidatePath('/api/all')
}

export async function reorderTestimonialItems(ids: number[]) {
  await requireAuth()
  
  await Promise.all(
    ids.map((id, index) =>
      db.update(schema.testimonialItems)
        .set({ sortOrder: index })
        .where(eq(schema.testimonialItems.id, id))
    )
  )
  
  revalidatePath('/admin/testimonials')
  revalidatePath('/api/all')
}