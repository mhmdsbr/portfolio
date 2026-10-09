import { optionalInteger, optionalText, optionalUrl, parseIdList, requiredText } from '@/lib/validation'
import { testimonialRepo } from '@/server/repos/collections'
import { requireSection } from './page-sections'
import { assertFound } from './shared'

export interface TestimonialInput {
  imageUrl: unknown
  title: unknown
  subtitle: unknown
  rating: unknown
  body: unknown
}

function parseTestimonial(input: TestimonialInput) {
  return {
    imageUrl: optionalUrl(input.imageUrl, 'Image URL', 'asset'),
    title: requiredText(input.title, 'Testimonial title'),
    subtitle: optionalText(input.subtitle),
    rating: optionalInteger(input.rating, 'Rating', { min: 1, max: 5 }),
    body: optionalText(input.body),
  }
}

export async function getTestimonials() {
  const [{ section }, items] = await Promise.all([
    requireSection('testimonials'),
    testimonialRepo.list(),
  ])
  return { section, items }
}

export async function createTestimonial(input: TestimonialInput) {
  return testimonialRepo.append(parseTestimonial(input))
}

export async function updateTestimonial(id: number, input: TestimonialInput) {
  return assertFound(
    await testimonialRepo.update(id, parseTestimonial(input)),
    'Testimonial',
  )
}

export async function deleteTestimonial(id: number) {
  await testimonialRepo.remove(id)
}

export async function reorderTestimonials(ids: unknown) {
  return testimonialRepo.reorder(parseIdList(ids))
}
