import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
  boolean,
  jsonb,
  index,
  uniqueIndex,
  primaryKey,
  check,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// =============================================
// ENUMS
// =============================================
export const iconEnum = pgEnum('icon_enum', [
  'palette',
  'desktop',
  'pen-ruler',
  'paintbrush',
  'chart-area',
  'bullhorn',
])

export const contactMethodKindEnum = pgEnum('contact_method_kind_enum', [
  'email',
  'phone',
  'address',
  'other',
])

// =============================================
// 01. PAGE SECTIONS (hub — defined first so FKs resolve)
// =============================================
export const pageSections = pgTable('page_sections', {
  id: serial('id').primaryKey(),
  sectionKey: text('section_key').notNull().unique(),
  navigationTitle: text('navigation_title').notNull(),
  title: text('title'),
  overlayTitle: text('overlay_title'),
  sortOrder: integer('sort_order').default(0),
  isEnabled: boolean('is_enabled').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type PageSection = typeof pageSections.$inferSelect
export type NewPageSection = typeof pageSections.$inferInsert

// =============================================
// 02. SIDEBAR (singleton — id locked to 1)
// =============================================
export const sidebar = pgTable(
  'sidebar',
  {
    id: integer('id').primaryKey().default(1),
    profileImageUrl: text('profile_image_url'),
    profileImageAlt: text('profile_image_alt'),
    profileTitle: text('profile_title'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [check('sidebar_singleton', sql`${table.id} = 1`)],
)

export type Sidebar = typeof sidebar.$inferSelect
export type NewSidebar = typeof sidebar.$inferInsert

// =============================================
// 03. PORTFOLIO PROFILE (singleton)
// =============================================
export const portfolioProfile = pgTable(
  'portfolio_profile',
  {
    id: integer('id').primaryKey().default(1),
    name: text('name'),
    jobTitle: text('job_title'),
    biography: text('biography'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [check('portfolio_profile_singleton', sql`${table.id} = 1`)],
)

export type PortfolioProfile = typeof portfolioProfile.$inferSelect
export type NewPortfolioProfile = typeof portfolioProfile.$inferInsert

// =============================================
// 04. SOCIAL LINKS
// =============================================
export const socialLinks = pgTable('social_links', {
  id: serial('id').primaryKey(),
  platform: text('platform').notNull(),
  url: text('url').notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(), // #5 added
})

export type SocialLink = typeof socialLinks.$inferSelect
export type NewSocialLink = typeof socialLinks.$inferInsert

// =============================================
// 05. SITE SETTINGS (singleton)
// =============================================
export const siteSettings = pgTable(
  'site_settings',
  {
    id: integer('id').primaryKey().default(1),
    portfolioTitle: text('portfolio_title'),
    portfolioOverlayTitle: text('portfolio_overlay_title'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [check('general_settings_singleton', sql`${table.id} = 1`)],
)

export type SiteSettings = typeof siteSettings.$inferSelect
export type NewSiteSettings = typeof siteSettings.$inferInsert

// =============================================
// 06. HERO SECTION
// =============================================
export const heroSection = pgTable('hero_section', {
  id: serial('id').primaryKey(),
  sectionKey: text('section_key')
    .notNull()
    .unique()
    .references(() => pageSections.sectionKey, { onDelete: 'cascade' }),
  location: text('location'),
  subtitleOne: text('subtitle_one'),
  subtitleTwo: text('subtitle_two'),
  logoUrl: text('logo_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type HeroSection = typeof heroSection.$inferSelect
export type NewHeroSection = typeof heroSection.$inferInsert

// =============================================
// 07. HERO TITLES
// =============================================
export const heroTitles = pgTable('hero_titles', {
  id: serial('id').primaryKey(),
  heroSectionId: integer('hero_section_id')
    .notNull()
    .references(() => heroSection.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type HeroTitle = typeof heroTitles.$inferSelect
export type NewHeroTitle = typeof heroTitles.$inferInsert

// =============================================
// 08. ABOUT SECTION
// =============================================
export const aboutSection = pgTable('about_section', {
  id: serial('id').primaryKey(),
  sectionKey: text('section_key')
    .notNull()
    .unique()
    .references(() => pageSections.sectionKey, { onDelete: 'cascade' }),
  buttonText: text('button_text'),
  buttonUrl: text('button_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type AboutSection = typeof aboutSection.$inferSelect
export type NewAboutSection = typeof aboutSection.$inferInsert

// =============================================
// 09. CONTACT METHODS
// =============================================
export const contactMethods = pgTable('contact_methods', {
  id: serial('id').primaryKey(),
  kind: contactMethodKindEnum('kind').notNull().default('other'),
  title: text('title').notNull(),
  value: text('value').notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type ContactMethod = typeof contactMethods.$inferSelect
export type NewContactMethod = typeof contactMethods.$inferInsert
export type ContactMethodKind = (typeof contactMethodKindEnum.enumValues)[number]

// =============================================
// 10. PROFILE FACTS
// =============================================
export const profileFacts = pgTable('profile_facts', {
  id: serial('id').primaryKey(),
  number: integer('number').notNull(),
  title: text('title').notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(), // #5 added
})

export type ProfileFact = typeof profileFacts.$inferSelect
export type NewProfileFact = typeof profileFacts.$inferInsert

// =============================================
// 11. SERVICES SECTION
// =============================================
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  icon: iconEnum('icon'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(), // #5 added
})

export type Service = typeof services.$inferSelect
export type NewService = typeof services.$inferInsert

// =============================================
// 12. EXPERIENCE SECTION SETTINGS
// =============================================
export const experienceSection = pgTable('experience_section', {
  id: serial('id').primaryKey(),
  sectionKey: text('section_key')
    .notNull()
    .unique()
    .references(() => pageSections.sectionKey, { onDelete: 'cascade' }),
  buttonText: text('button_text'),
  buttonUrl: text('button_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type ExperienceSection = typeof experienceSection.$inferSelect
export type NewExperienceSection = typeof experienceSection.$inferInsert

// =============================================
// 13. EXPERIENCES
// =============================================
export const experiences = pgTable('experiences', {
  id: serial('id').primaryKey(),
  fromYear: integer('from_year').notNull(),
  toYear: integer('to_year'),
  jobTitle: text('job_title').notNull(),
  company: text('company').notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(), // #5 added
})

export type Experience = typeof experiences.$inferSelect
export type NewExperience = typeof experiences.$inferInsert

// =============================================
// 14. SKILLS
// =============================================
export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  skill: text('skill').notNull(),
  level: integer('level'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(), // #5 added
})

export type Skill = typeof skills.$inferSelect
export type NewSkill = typeof skills.$inferInsert

// =============================================
// 15. TESTIMONIALS SECTION
// =============================================
export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url'),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  rating: integer('rating'),
  body: text('body'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(), // #5 added
}, (table) => [
  check(
    'testimonials_rating_range',
    sql`${table.rating} BETWEEN 1 AND 5`,
  ),
])

export type Testimonial = typeof testimonials.$inferSelect
export type NewTestimonial = typeof testimonials.$inferInsert

// =============================================
// 16. PROJECTS SECTION
// =============================================
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  image: text('image'),
  link: text('link'),
  githubUrl: text('github_url'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert

// #8: normalized roles (was text[].roles)
export const projectRoles = pgTable(
  'project_roles',
  {
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    role: text('role').notNull(),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.role] }),
    index('project_roles_project_id_idx').on(table.projectId),
    index('project_roles_role_idx').on(table.role),
  ],
)

export type ProjectRole = typeof projectRoles.$inferSelect
export type NewProjectRole = typeof projectRoles.$inferInsert

// #8: normalized tech stack (was text[].tech)
export const technologies = pgTable(
  'technologies',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [uniqueIndex('technologies_name_idx').on(table.name)],
)

export type Technology = typeof technologies.$inferSelect
export type NewTechnology = typeof technologies.$inferInsert

export const projectTechnologies = pgTable(
  'project_technologies',
  {
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    technologyId: integer('technology_id')
      .notNull()
      .references(() => technologies.id, { onDelete: 'cascade' }),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.technologyId] }),
    index('project_technologies_project_id_idx').on(table.projectId),
    index('project_technologies_technology_id_idx').on(table.technologyId),
  ],
)

export type ProjectTechnology = typeof projectTechnologies.$inferSelect
export type NewProjectTechnology = typeof projectTechnologies.$inferInsert

// =============================================
// 17. CONTACT SECTION
// =============================================
export const contactSection = pgTable('contact_section', {
  id: serial('id').primaryKey(),
  sectionKey: text('section_key')
    .notNull()
    .unique()
    .references(() => pageSections.sectionKey, { onDelete: 'cascade' }),
  formTitle: text('form_title'),
  buttonText: text('button_text'),
  buttonUrl: text('button_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type ContactSection = typeof contactSection.$inferSelect
export type NewContactSection = typeof contactSection.$inferInsert

// =============================================
// 18. FOOTER (singleton — merged with former footer_section)
// =============================================
export const footer = pgTable(
  'footer',
  {
    id: integer('id').primaryKey().default(1),
    companyName: text('company_name').default('Your Company'),
    privacyPolicy: text('privacy_policy'),
    termsOfService: text('terms_of_service'),
    disclaimer: text('disclaimer'),
    copyrightText: text('copyright_text'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [check('footer_singleton', sql`${table.id} = 1`)],
)

export type Footer = typeof footer.$inferSelect
export type NewFooter = typeof footer.$inferInsert

// =============================================
// 19. APPLICATION CONFIGURATION (singleton)
// =============================================
export const appConfig = pgTable(
  'app_config',
  {
    id: integer('id').primaryKey().default(1),
    recaptchaSiteKey: text('recaptcha_site_key'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [check('config_singleton', sql`${table.id} = 1`)],
)

export type AppConfig = typeof appConfig.$inferSelect
export type NewAppConfig = typeof appConfig.$inferInsert

// =============================================
// 20. ADMIN IDENTITY, PROFILES, AND SESSIONS
// =============================================
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const adminProfiles = pgTable('admin_profiles', {
  userId: integer('user_id')
    .primaryKey()
    .references(() => adminUsers.id, { onDelete: 'cascade' }),
  displayName: text('display_name').notNull(),
  bio: text('bio'),
  preferences: jsonb('preferences')
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const adminSessions = pgTable(
  'admin_sessions',
  {
    sessionId: text('session_id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => adminUsers.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [index('admin_sessions_user_id_idx').on(table.userId)],
)

// Prevent duplicate pending verifications for the same email and purpose.
export const adminEmailVerifications = pgTable(
  'admin_email_verifications',
  {
    id: text('id').primaryKey(),
    purpose: text('purpose').notNull(),
    email: text('email').notNull(),
    displayName: text('display_name').notNull(),
    passwordHash: text('password_hash').notNull(),
    codeSalt: text('code_salt').notNull(),
    codeHash: text('code_hash').notNull(),
    attempts: integer('attempts').notNull().default(0),
    createdByUserId: integer('created_by_user_id').references(
      () => adminUsers.id,
      { onDelete: 'cascade' },
    ),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    uniqueIndex('admin_email_verifications_email_purpose_uq').on(
      table.email,
      table.purpose,
    ),
  ],
)

export type AdminUser = typeof adminUsers.$inferSelect
export type NewAdminUser = typeof adminUsers.$inferInsert
export type AdminProfile = typeof adminProfiles.$inferSelect
export type NewAdminProfile = typeof adminProfiles.$inferInsert
export type AdminSession = typeof adminSessions.$inferSelect
export type NewAdminSession = typeof adminSessions.$inferInsert
export type AdminEmailVerification =
  typeof adminEmailVerifications.$inferSelect
export type NewAdminEmailVerification =
  typeof adminEmailVerifications.$inferInsert

// =============================================
// 21. HEADER SETTINGS (singleton)
// =============================================
export const headerSettings = pgTable(
  'header_settings',
  {
    id: integer('id').primaryKey().default(1),
    defaultTitle: text('default_title').default('Welcome'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [check('header_settings_singleton', sql`${table.id} = 1`)],
)

export type HeaderSettings = typeof headerSettings.$inferSelect
export type NewHeaderSettings = typeof headerSettings.$inferInsert