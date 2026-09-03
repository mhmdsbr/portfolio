import { relations } from 'drizzle-orm'
import {
  heroSection,
  heroTitles,
  aboutSection,
  aboutContactInfo,
  aboutDetails,
  servicesSection,
  serviceItems,
  summarySection,
  summaryJobs,
  summaryExperiences,
  testimonialsSection,
  testimonialItems,
  projectsSection,
  projectItems
} from './schema'

// Hero Relations
export const heroRelations = relations(heroSection, ({ many }) => ({
  titles: many(heroTitles),
}))

export const heroTitlesRelations = relations(heroTitles, ({ one }) => ({
  hero: one(heroSection, {
    fields: [heroTitles.heroId],
    references: [heroSection.id],
  }),
}))

// About Relations
export const aboutRelations = relations(aboutSection, ({ many }) => ({
  contactInfo: many(aboutContactInfo),
  details: many(aboutDetails),
}))

export const aboutContactInfoRelations = relations(aboutContactInfo, ({ one }) => ({
  about: one(aboutSection, {
    fields: [aboutContactInfo.aboutId],
    references: [aboutSection.id],
  }),
}))

export const aboutDetailsRelations = relations(aboutDetails, ({ one }) => ({
  about: one(aboutSection, {
    fields: [aboutDetails.aboutId],
    references: [aboutSection.id],
  }),
}))

// Services Relations
export const servicesRelations = relations(servicesSection, ({ many }) => ({
  items: many(serviceItems),
}))

export const serviceItemsRelations = relations(serviceItems, ({ one }) => ({
  services: one(servicesSection, {
    fields: [serviceItems.servicesId],
    references: [servicesSection.id],
  }),
}))

// Summary Relations
export const summaryRelations = relations(summarySection, ({ many }) => ({
  jobs: many(summaryJobs),
  experiences: many(summaryExperiences),
}))

export const summaryJobsRelations = relations(summaryJobs, ({ one }) => ({
  summary: one(summarySection, {
    fields: [summaryJobs.summaryId],
    references: [summarySection.id],
  }),
}))

export const summaryExperiencesRelations = relations(summaryExperiences, ({ one }) => ({
  summary: one(summarySection, {
    fields: [summaryExperiences.summaryId],
    references: [summarySection.id],
  }),
}))

// Testimonials Relations
export const testimonialsRelations = relations(testimonialsSection, ({ many }) => ({
  items: many(testimonialItems),
}))

export const testimonialItemsRelations = relations(testimonialItems, ({ one }) => ({
  testimonials: one(testimonialsSection, {
    fields: [testimonialItems.testimonialsId],
    references: [testimonialsSection.id],
  }),
}))

// Projects Relations
export const projectsRelations = relations(projectsSection, ({ many }) => ({
  items: many(projectItems),
}))

export const projectItemsRelations = relations(projectItems, ({ one }) => ({
  projects: one(projectsSection, {
    fields: [projectItems.projectsId],
    references: [projectsSection.id],
  }),
}))