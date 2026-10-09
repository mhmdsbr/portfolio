import * as schema from '@/lib/db/schema'
import { createOrderedRepo } from './ordered-collection'

export const serviceRepo = createOrderedRepo(schema.services)
export const testimonialRepo = createOrderedRepo(schema.testimonials)
export const experienceRepo = createOrderedRepo(schema.experiences)
export const skillRepo = createOrderedRepo(schema.skills)
export const profileFactRepo = createOrderedRepo(schema.profileFacts)
