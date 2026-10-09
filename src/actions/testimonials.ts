'use server'

import { requireAuth } from '@/lib/auth'
import { revalidateContent } from '@/server/revalidate'
import * as service from '@/server/services/testimonials'

function readForm(formData: FormData) {
  return {
    imageUrl: formData.get('imageUrl'),
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    rating: formData.get('rating'),
    body: formData.get('body'),
  }
}

export async function getTestimonials() {
  await requireAuth()
  return service.getTestimonials()
}

export async function createTestimonialItem(formData: FormData) {
  await requireAuth()
  const item = await service.createTestimonial(readForm(formData))
  revalidateContent('/admin/testimonials')
  return item
}

export async function updateTestimonialItem(id: number, formData: FormData) {
  await requireAuth()
  const item = await service.updateTestimonial(id, readForm(formData))
  revalidateContent('/admin/testimonials')
  return item
}

export async function deleteTestimonialItem(id: number) {
  await requireAuth()
  await service.deleteTestimonial(id)
  revalidateContent('/admin/testimonials')
}

export async function reorderTestimonialItems(ids: number[]) {
  await requireAuth()
  await service.reorderTestimonials(ids)
  revalidateContent('/admin/testimonials')
}
