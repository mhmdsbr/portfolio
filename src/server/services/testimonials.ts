
import { testimonialRepo } from '@/server/repos/collections'
import { requireSection } from './page-sections'
import { assertFound } from './shared'

export interface TestimonialInput {
  imageUrl: string | null
  title: string
  subtitle: string | null
  rating: number | null
  body: string | null
}


export async function getTestimonials() {
  const [{ section }, items] = await Promise.all([
    requireSection('testimonials'),
    testimonialRepo.list(),
  ])
  return { section, items }
}

export async function createTestimonial(input: TestimonialInput) {
  return testimonialRepo.append(input)
}

export async function updateTestimonial(id: number, input: TestimonialInput) {
  return assertFound(
    await testimonialRepo.update(id, input),
    'Testimonial',
  )
}

export async function deleteTestimonial(id: number) {
  await testimonialRepo.remove(id)
}

export async function reorderTestimonials(ids: number[]) {
  return testimonialRepo.reorder(ids)
}
