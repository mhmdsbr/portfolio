import {
  pgTable,
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

export const adminVerificationPurposeEnum = pgEnum(
  'admin_verification_purpose_enum',
  ['initial', 'additional', 'password_reset', 'password_change'],
)

// =============================================
// 01. PAGE SECTIONS (hub — defined first so FKs resolve)
// =============================================
export const pageSections = pgTable('page_sections', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  sectionKey: text('section_key')
    .notNull()
    .unique('page_sections_section_key_uq'),
  navigationTitle: text('navigation_title').notNull(),
  title: text('title'),
  sortOrder: integer('sort_order').notNull().default(0),
  isEnabled: boolean('is_enabled').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export type PageSection = typeof pageSections.$inferSelect
export type NewPageSection = typeof pageSections.$inferInsert

// =============================================
// 02. PROFILE (singleton)
// =============================================
export const profile = pgTable(
  'profile',
  {
    id: integer('id').primaryKey().default(1),
    name: text('name'),
    jobTitle: text('job_title'),
    biography: text('biography'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [check('profile_singleton_chk', sql`${table.id} = 1`)],
)

export type Profile = typeof profile.$inferSelect
export type NewProfile = typeof profile.$inferInsert

// =============================================
// 03. SOCIAL LINKS
// =============================================
export const socialLinks = pgTable('social_links', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  platform: text('platform').notNull(),
  url: text('url').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export type SocialLink = typeof socialLinks.$inferSelect
export type NewSocialLink = typeof socialLinks.$inferInsert

// =============================================
// 04. HERO SECTION
// =============================================
export const heroSection = pgTable('hero_section', {
  sectionKey: text('section_key')
    .primaryKey()
    .notNull()
    .references(() => pageSections.sectionKey, { onDelete: 'cascade', onUpdate: 'cascade' }),
  location: text('location'),
  subtitleOne: text('subtitle_one'),
  subtitleTwo: text('subtitle_two'),
  logoUrl: text('logo_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export type HeroSection = typeof heroSection.$inferSelect
export type NewHeroSection = typeof heroSection.$inferInsert

// =============================================
// 05. HERO TITLES
// =============================================
export const heroTitles = pgTable('hero_titles', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  heroSectionKey: text('hero_section_key')
    .notNull()
    .references(() => heroSection.sectionKey, { onDelete: 'cascade', onUpdate: 'cascade' }),
  title: text('title').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index('hero_titles_hero_section_key_idx').on(table.heroSectionKey),
])

export type HeroTitle = typeof heroTitles.$inferSelect
export type NewHeroTitle = typeof heroTitles.$inferInsert

// =============================================
// 06. ABOUT SECTION
// =============================================
export const aboutSection = pgTable('about_section', {
  sectionKey: text('section_key')
    .primaryKey()
    .notNull()
    .references(() => pageSections.sectionKey, { onDelete: 'cascade', onUpdate: 'cascade' }),
  buttonText: text('button_text'),
  buttonUrl: text('button_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export type AboutSection = typeof aboutSection.$inferSelect
export type NewAboutSection = typeof aboutSection.$inferInsert

// =============================================
// 07. CONTACT METHODS
// =============================================
export const contactMethods = pgTable('contact_methods', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  kind: contactMethodKindEnum('kind').notNull().default('other'),
  title: text('title').notNull(),
  value: text('value').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export type ContactMethod = typeof contactMethods.$inferSelect
export type NewContactMethod = typeof contactMethods.$inferInsert
export type ContactMethodKind = (typeof contactMethodKindEnum.enumValues)[number]

// =============================================
// 08. PROFILE FACTS
// =============================================
export const profileFacts = pgTable('profile_facts', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  number: integer('number').notNull(),
  title: text('title').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export type ProfileFact = typeof profileFacts.$inferSelect
export type NewProfileFact = typeof profileFacts.$inferInsert

// =============================================
// 09. SERVICES SECTION
// =============================================
export const services = pgTable('services', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  icon: iconEnum('icon'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export type Service = typeof services.$inferSelect
export type NewService = typeof services.$inferInsert

// =============================================
// 10. EXPERIENCE SECTION SETTINGS
// =============================================
export const experienceSection = pgTable('experience_section', {
  sectionKey: text('section_key')
    .primaryKey()
    .notNull()
    .references(() => pageSections.sectionKey, { onDelete: 'cascade', onUpdate: 'cascade' }),
  buttonText: text('button_text'),
  buttonUrl: text('button_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export type ExperienceSection = typeof experienceSection.$inferSelect
export type NewExperienceSection = typeof experienceSection.$inferInsert

// =============================================
// 11. EXPERIENCES
// =============================================
export const experiences = pgTable('experiences', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  fromYear: integer('from_year').notNull(),
  toYear: integer('to_year'),
  jobTitle: text('job_title').notNull(),
  company: text('company').notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  check(
    'experiences_year_range_chk',
    sql`${table.toYear} IS NULL OR ${table.toYear} >= ${table.fromYear}`,
  ),
])

export type Experience = typeof experiences.$inferSelect
export type NewExperience = typeof experiences.$inferInsert

// =============================================
// 12. SKILLS
// =============================================
export const skills = pgTable('skills', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  skill: text('skill').notNull(),
  level: integer('level'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  check(
    'skills_level_range_chk',
    sql`${table.level} IS NULL OR ${table.level} BETWEEN 0 AND 100`,
  ),
])

export type Skill = typeof skills.$inferSelect
export type NewSkill = typeof skills.$inferInsert

// =============================================
// 13. TESTIMONIALS SECTION
// =============================================
export const testimonials = pgTable('testimonials', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  imageUrl: text('image_url'),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  rating: integer('rating'),
  body: text('body'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  check(
    'testimonials_rating_range',
    sql`${table.rating} BETWEEN 1 AND 5`,
  ),
])

export type Testimonial = typeof testimonials.$inferSelect
export type NewTestimonial = typeof testimonials.$inferInsert

// =============================================
// 14. PROJECTS SECTION
// =============================================
export const projects = pgTable('projects', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  image: text('image'),
  link: text('link'),
  githubUrl: text('github_url'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
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
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (table) => [
    primaryKey({
      name: 'project_roles_project_id_role_pk',
      columns: [table.projectId, table.role],
    }),
    index('project_roles_role_idx').on(table.role),
  ],
)

export type ProjectRole = typeof projectRoles.$inferSelect
export type NewProjectRole = typeof projectRoles.$inferInsert

// #8: normalized tech stack (was text[].tech)
export const technologies = pgTable(
  'technologies',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('technologies_name_lower_uq').on(sql`lower(${table.name})`),
  ],
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
      sortOrder: integer('sort_order').notNull().default(0),
  },
  (table) => [
    primaryKey({
      name: 'project_technologies_project_id_technology_id_pk',
      columns: [table.projectId, table.technologyId],
    }),
    index('project_technologies_technology_id_idx').on(table.technologyId),
  ],
)

export type ProjectTechnology = typeof projectTechnologies.$inferSelect
export type NewProjectTechnology = typeof projectTechnologies.$inferInsert

// =============================================
// 15. CONTACT SECTION
// =============================================
export const contactSection = pgTable('contact_section', {
  sectionKey: text('section_key')
    .primaryKey()
    .notNull()
    .references(() => pageSections.sectionKey, { onDelete: 'cascade', onUpdate: 'cascade' }),
  formTitle: text('form_title'),
  buttonText: text('button_text'),
  buttonUrl: text('button_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export type ContactSection = typeof contactSection.$inferSelect
export type NewContactSection = typeof contactSection.$inferInsert

// =============================================
// 16. SITE CONFIGURATION (singleton)
// =============================================
export const siteConfig = pgTable(
  'site_config',
  {
    id: integer('id').primaryKey().default(1),
    companyName: text('company_name').default('Your Company'),
    privacyPolicy: text('privacy_policy'),
    termsOfService: text('terms_of_service'),
    disclaimer: text('disclaimer'),
    copyrightText: text('copyright_text'),
    recaptchaSiteKey: text('recaptcha_site_key'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [check('site_config_singleton_chk', sql`${table.id} = 1`)],
)

export type SiteConfig = typeof siteConfig.$inferSelect
export type NewSiteConfig = typeof siteConfig.$inferInsert

// =============================================
// 17. ADMIN IDENTITY, PROFILES, AND SESSIONS
// =============================================
export const adminUsers = pgTable('admin_users', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex('admin_users_email_lower_uq').on(sql`lower(${table.email})`),
])

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
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const adminSessions = pgTable(
  'admin_sessions',
  {
    sessionId: text('session_id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => adminUsers.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('admin_sessions_user_id_idx').on(table.userId),
    index('admin_sessions_expires_at_idx').on(table.expiresAt),
  ],
)

// Prevent duplicate pending verifications for the same email and purpose.
export const adminEmailVerifications = pgTable(
  'admin_email_verifications',
  {
    id: text('id').primaryKey(),
    purpose: adminVerificationPurposeEnum('purpose').notNull(),
    email: text('email').notNull(),
    displayName: text('display_name').notNull(),
    passwordHash: text('password_hash').notNull(),
    codeSalt: text('code_salt').notNull(),
    codeHash: text('code_hash').notNull(),
    attempts: integer('attempts').notNull().default(0),
    consumedAt: timestamp('consumed_at', { withTimezone: true }),
    createdByUserId: integer('created_by_user_id').references(
      () => adminUsers.id,
      { onDelete: 'cascade' },
    ),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('admin_email_verifications_email_purpose_active_uq')
      .on(sql`lower(${table.email})`, table.purpose)
      .where(sql`${table.consumedAt} IS NULL`),
    index('admin_email_verifications_expires_at_idx').on(table.expiresAt),
    check(
      'admin_email_verifications_attempts_nonnegative_chk',
      sql`${table.attempts} >= 0`,
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
