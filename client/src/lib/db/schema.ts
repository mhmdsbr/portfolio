import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core'
import {  } from 'drizzle-orm'

// =============================================
// ENUMS
// =============================================
export const iconEnum = pgEnum('icon_enum', [
  'palette',
  'desktop',
  'pen-ruler',
  'paintbrush',
  'chart-area',
  'bullhorn'
])

export const ratingEnum = pgEnum('rating_enum', [
  '1 Star',
  '2 Stars',
  '3 Stars',
  '4 Stars',
  '5 Stars'
])

// =============================================
// 1. SIDEBAR (Profile)
// =============================================
export const sidebar = pgTable('sidebar', {
  id: serial('id').primaryKey(),
  profileImageUrl: text('profile_image_url'),
  profileImageAlt: text('profile_image_alt'),
  profileTitle: text('profile_title'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type Sidebar = typeof sidebar.$inferSelect
export type NewSidebar = typeof sidebar.$inferInsert

// =============================================
// 2. SOCIAL MEDIA
// =============================================
export const socialMedia = pgTable('social_media', {
  id: serial('id').primaryKey(),
  platform: text('platform').notNull(),
  url: text('url').notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type SocialMedia = typeof socialMedia.$inferSelect
export type NewSocialMedia = typeof socialMedia.$inferInsert

// =============================================
// 3. GENERAL SETTINGS
// =============================================
export const generalSettings = pgTable('general_settings', {
  id: serial('id').primaryKey(),
  portfolioTitle: text('portfolio_title'),
  portfolioOverlayTitle: text('portfolio_overlay_title'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type GeneralSettings = typeof generalSettings.$inferSelect
export type NewGeneralSettings = typeof generalSettings.$inferInsert

// =============================================
// 4. HERO SECTION
// =============================================
export const heroSection = pgTable('hero_section', {
  id: serial('id').primaryKey(),
  location: text('location'),
  subtitleOne: text('subtitle_one'),
  subtitleTwo: text('subtitle_two'),
  logoUrl: text('logo_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type HeroSection = typeof heroSection.$inferSelect
export type NewHeroSection = typeof heroSection.$inferInsert

export const heroTitles = pgTable('hero_titles', {
  id: serial('id').primaryKey(),
  heroId: integer('hero_id')
    .notNull()
    .references(() => heroSection.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

export type HeroTitle = typeof heroTitles.$inferSelect
export type NewHeroTitle = typeof heroTitles.$inferInsert

// =============================================
// 5. ABOUT SECTION
// =============================================
export const aboutSection = pgTable('about_section', {
  id: serial('id').primaryKey(),
  title: text('title'),
  overlayTitle: text('overlay_title'),
  name: text('name'),
  jobTitle: text('job_title'),
  description: text('description'),
  buttonText: text('button_text'),
  buttonUrl: text('button_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type AboutSection = typeof aboutSection.$inferSelect
export type NewAboutSection = typeof aboutSection.$inferInsert

export const aboutContactInfo = pgTable('about_contact_info', {
  id: serial('id').primaryKey(),
  aboutId: integer('about_id')
    .notNull()
    .references(() => aboutSection.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

export type AboutContactInfo = typeof aboutContactInfo.$inferSelect
export type NewAboutContactInfo = typeof aboutContactInfo.$inferInsert

export const aboutDetails = pgTable('about_details', {
  id: serial('id').primaryKey(),
  aboutId: integer('about_id')
    .notNull()
    .references(() => aboutSection.id, { onDelete: 'cascade' }),
  number: integer('number').notNull(),
  title: text('title').notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

export type AboutDetail = typeof aboutDetails.$inferSelect
export type NewAboutDetail = typeof aboutDetails.$inferInsert

// =============================================
// 6. SERVICES SECTION
// =============================================
export const servicesSection = pgTable('services_section', {
  id: serial('id').primaryKey(),
  title: text('title'),
  overlayTitle: text('overlay_title'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type ServicesSection = typeof servicesSection.$inferSelect
export type NewServicesSection = typeof servicesSection.$inferInsert

export const serviceItems = pgTable('service_items', {
  id: serial('id').primaryKey(),
  servicesId: integer('services_id')
    .notNull()
    .references(() => servicesSection.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content'),
  icon: iconEnum('icon'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

export type ServiceItem = typeof serviceItems.$inferSelect
export type NewServiceItem = typeof serviceItems.$inferInsert

// =============================================
// 7. SUMMARY / RESUME SECTION
// =============================================
export const summarySection = pgTable('summary_section', {
  id: serial('id').primaryKey(),
  title: text('title'),
  overlayTitle: text('overlay_title'),
  buttonText: text('button_text'),
  buttonUrl: text('button_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type SummarySection = typeof summarySection.$inferSelect
export type NewSummarySection = typeof summarySection.$inferInsert

export const summaryJobs = pgTable('summary_jobs', {
  id: serial('id').primaryKey(),
  summaryId: integer('summary_id')
    .notNull()
    .references(() => summarySection.id, { onDelete: 'cascade' }),
  fromYear: integer('from_year'),
  toYear: text('to_year'),
  jobTitle: text('job_title').notNull(),
  company: text('company').notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

export type SummaryJob = typeof summaryJobs.$inferSelect
export type NewSummaryJob = typeof summaryJobs.$inferInsert

export const summaryExperiences = pgTable('summary_experiences', {
  id: serial('id').primaryKey(),
  summaryId: integer('summary_id')
    .notNull()
    .references(() => summarySection.id, { onDelete: 'cascade' }),
  skill: text('skill').notNull(),
  level: integer('level'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

export type SummaryExperience = typeof summaryExperiences.$inferSelect
export type NewSummaryExperience = typeof summaryExperiences.$inferInsert

// =============================================
// 8. TESTIMONIALS SECTION
// =============================================
export const testimonialsSection = pgTable('testimonials_section', {
  id: serial('id').primaryKey(),
  title: text('title'),
  overlayTitle: text('overlay_title'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type TestimonialsSection = typeof testimonialsSection.$inferSelect
export type NewTestimonialsSection = typeof testimonialsSection.$inferInsert

export const testimonialItems = pgTable('testimonial_items', {
  id: serial('id').primaryKey(),
  testimonialsId: integer('testimonials_id')
    .notNull()
    .references(() => testimonialsSection.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url'),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  rating: ratingEnum('rating'),
  content: text('content'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

export type TestimonialItem = typeof testimonialItems.$inferSelect
export type NewTestimonialItem = typeof testimonialItems.$inferInsert


// =============================================
// 12. PROJECTS SECTION
// =============================================
export const projectsSection = pgTable('projects_section', {
  id: serial('id').primaryKey(),
  title: text('title'),
  overlayTitle: text('overlay_title'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type ProjectsSection = typeof projectsSection.$inferSelect
export type NewProjectsSection = typeof projectsSection.$inferInsert

export const projectItems = pgTable('project_items', {
  id: serial('id').primaryKey(),
  projectsId: integer('projects_id')
    .notNull()
    .references(() => projectsSection.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  image: text('image'),
  link: text('link'),
  github: text('github'),
  tech: text('tech').array(), // Array of technologies
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

export type ProjectItem = typeof projectItems.$inferSelect
export type NewProjectItem = typeof projectItems.$inferInsert

// =============================================
// 9. CONTACT SECTION
// =============================================
export const contactSection = pgTable('contact_section', {
  id: serial('id').primaryKey(),
  title: text('title'),
  overlayTitle: text('overlay_title'),
  formTitle: text('form_title'),
  buttonText: text('button_text'),
  buttonUrl: text('button_url'),
  infoTitle: text('info_title'),
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type ContactSection = typeof contactSection.$inferSelect
export type NewContactSection = typeof contactSection.$inferInsert

// =============================================
// 10. FOOTER
// =============================================
export const footer = pgTable('footer', {
  id: serial('id').primaryKey(),
  termsPolicies: text('terms_policies'),
  disclaimer: text('disclaimer'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type Footer = typeof footer.$inferSelect
export type NewFooter = typeof footer.$inferInsert

// =============================================
// 11. CONFIGURATION
// =============================================
export const config = pgTable('config', {
  id: serial('id').primaryKey(),
  apiBaseUrl: text('api_base_url'),
  smtpHost: text('smtp_host'),
  smtpPort: text('smtp_port'),
  smtpUsername: text('smtp_username'),
  smtpPassword: text('smtp_password'),
  recaptchaSiteKey: text('recaptcha_site_key'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type Config = typeof config.$inferSelect
export type NewConfig = typeof config.$inferInsert