import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
  index,
  uniqueIndex,
  primaryKey,
  check,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import {
  ADMIN_VERIFICATION_PURPOSES,
  ASSET_URL_PATTERN,
  CONTACT_METHOD_KINDS,
  LINK_URL_PATTERN,
  SECTION_KINDS,
  SERVICE_ICONS,
  SLUG_PATTERN,
  SOCIAL_PLATFORMS,
  WEB_URL_PATTERN,
  YEAR_MAX,
  YEAR_MIN,
  type AdminVerificationPurpose,
  type ContactMethodKind,
  type SectionKind,
  type ServiceIcon,
  type SocialPlatform,
} from './constants'
import type { AnySectionConfig } from './section-config'

export type {
  AdminVerificationPurpose,
  ContactMethodKind,
  SectionKind,
  ServiceIcon,
  SocialPlatform,
}

// =============================================
// SHARED COLUMN HELPERS
// =============================================
const createdAt = () =>
  timestamp('created_at', { withTimezone: true }).notNull().defaultNow()

const timestamps = () => ({
  createdAt: createdAt(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

// The value sets and patterns below are code constants, never user input.
const oneOf = (column: AnyPgColumn, values: readonly string[]) =>
  sql`${column} IN (${sql.raw(values.map((value) => `'${value}'`).join(', '))})`

const matches = (column: AnyPgColumn, pattern: string) =>
  sql`${column} ~ ${sql.raw(`'${pattern}'`)}`

// =============================================
// 01. PAGE SECTIONS (one row per section kind, with its settings)
// =============================================
export const pageSections = pgTable(
  'page_sections',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    kind: text('kind').$type<SectionKind>().notNull(),
    navigationTitle: text('navigation_title').notNull(),
    title: text('title'),
    sortOrder: integer('sort_order').notNull().default(0),
    isEnabled: boolean('is_enabled').notNull().default(true),
    // Section-specific settings; shape is defined per kind in section-config.ts.
    config: jsonb('config')
      .$type<AnySectionConfig>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    ...timestamps(),
  },
  (table) => [
    uniqueIndex('page_sections_kind_uq').on(table.kind),
    check('page_sections_kind_chk', oneOf(table.kind, SECTION_KINDS)),
    check(
      'page_sections_config_object_chk',
      sql`jsonb_typeof(${table.config}) = 'object'`,
    ),
  ],
)

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
    ...timestamps(),
  },
  (table) => [check('profile_singleton_chk', sql`${table.id} = 1`)],
)

export type Profile = typeof profile.$inferSelect
export type NewProfile = typeof profile.$inferInsert

// =============================================
// 03. SOCIAL LINKS
// =============================================
export const socialLinks = pgTable(
  'social_links',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    platform: text('platform').$type<SocialPlatform>().notNull(),
    url: text('url').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    ...timestamps(),
  },
  (table) => [
    uniqueIndex('social_links_platform_uq').on(table.platform),
    check('social_links_platform_chk', oneOf(table.platform, SOCIAL_PLATFORMS)),
    check('social_links_url_chk', matches(table.url, LINK_URL_PATTERN)),
  ],
)

export type SocialLink = typeof socialLinks.$inferSelect
export type NewSocialLink = typeof socialLinks.$inferInsert

// =============================================
// 04. HERO TITLES (rotating headlines of the hero section)
// =============================================
export const heroTitles = pgTable(
  'hero_titles',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    sectionId: integer('section_id')
      .notNull()
      .references(() => pageSections.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    ...timestamps(),
  },
  (table) => [index('hero_titles_section_id_idx').on(table.sectionId)],
)

export type HeroTitle = typeof heroTitles.$inferSelect
export type NewHeroTitle = typeof heroTitles.$inferInsert

// =============================================
// 05. CONTACT METHODS (+ the sections that display them)
// =============================================
export const contactMethods = pgTable(
  'contact_methods',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    kind: text('kind').$type<ContactMethodKind>().notNull().default('other'),
    title: text('title').notNull(),
    value: text('value').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    ...timestamps(),
  },
  (table) => [
    check('contact_methods_kind_chk', oneOf(table.kind, CONTACT_METHOD_KINDS)),
  ],
)

export type ContactMethod = typeof contactMethods.$inferSelect
export type NewContactMethod = typeof contactMethods.$inferInsert

export const contactMethodSections = pgTable(
  'contact_method_sections',
  {
    contactMethodId: integer('contact_method_id')
      .notNull()
      .references(() => contactMethods.id, { onDelete: 'cascade' }),
    sectionId: integer('section_id')
      .notNull()
      .references(() => pageSections.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({
      name: 'contact_method_sections_pk',
      columns: [table.contactMethodId, table.sectionId],
    }),
    index('contact_method_sections_section_id_idx').on(table.sectionId),
  ],
)

export type ContactMethodSection = typeof contactMethodSections.$inferSelect

// =============================================
// 06. PROFILE FACTS
// =============================================
export const profileFacts = pgTable('profile_facts', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  number: integer('number').notNull(),
  title: text('title').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  ...timestamps(),
})

export type ProfileFact = typeof profileFacts.$inferSelect
export type NewProfileFact = typeof profileFacts.$inferInsert

// =============================================
// 07. SERVICES
// =============================================
export const services = pgTable(
  'services',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    icon: text('icon').$type<ServiceIcon>(),
    sortOrder: integer('sort_order').notNull().default(0),
    ...timestamps(),
  },
  (table) => [check('services_icon_chk', oneOf(table.icon, SERVICE_ICONS))],
)

export type Service = typeof services.$inferSelect
export type NewService = typeof services.$inferInsert

// =============================================
// 08. EXPERIENCES
// =============================================
export const experiences = pgTable(
  'experiences',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    fromYear: integer('from_year').notNull(),
    toYear: integer('to_year'),
    jobTitle: text('job_title').notNull(),
    company: text('company').notNull(),
    description: text('description'),
    sortOrder: integer('sort_order').notNull().default(0),
    ...timestamps(),
  },
  (table) => [
    check(
      'experiences_year_range_chk',
      sql`${table.fromYear} BETWEEN ${sql.raw(String(YEAR_MIN))} AND ${sql.raw(String(YEAR_MAX))} AND (${table.toYear} IS NULL OR ${table.toYear} BETWEEN ${table.fromYear} AND ${sql.raw(String(YEAR_MAX))})`,
    ),
  ],
)

export type Experience = typeof experiences.$inferSelect
export type NewExperience = typeof experiences.$inferInsert

// =============================================
// 09. SKILLS
// =============================================
export const skills = pgTable(
  'skills',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    skill: text('skill').notNull(),
    level: integer('level'),
    sortOrder: integer('sort_order').notNull().default(0),
    ...timestamps(),
  },
  (table) => [
    check(
      'skills_level_range_chk',
      sql`${table.level} IS NULL OR ${table.level} BETWEEN 0 AND 100`,
    ),
  ],
)

export type Skill = typeof skills.$inferSelect
export type NewSkill = typeof skills.$inferInsert

// =============================================
// 10. TESTIMONIALS
// =============================================
export const testimonials = pgTable(
  'testimonials',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    imageUrl: text('image_url'),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    rating: integer('rating'),
    body: text('body'),
    sortOrder: integer('sort_order').notNull().default(0),
    ...timestamps(),
  },
  (table) => [
    check('testimonials_rating_range', sql`${table.rating} BETWEEN 1 AND 5`),
    check('testimonials_image_url_chk', matches(table.imageUrl, ASSET_URL_PATTERN)),
  ],
)

export type Testimonial = typeof testimonials.$inferSelect
export type NewTestimonial = typeof testimonials.$inferInsert

// =============================================
// 11. PROJECTS (+ categories, roles, technologies)
// =============================================
export const projectCategories = pgTable(
  'project_categories',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    ...timestamps(),
  },
  (table) => [
    uniqueIndex('project_categories_slug_uq').on(table.slug),
    uniqueIndex('project_categories_name_lower_uq').on(sql`lower(${table.name})`),
    check('project_categories_slug_chk', matches(table.slug, SLUG_PATTERN)),
  ],
)

export type ProjectCategory = typeof projectCategories.$inferSelect
export type NewProjectCategory = typeof projectCategories.$inferInsert

export const projects = pgTable(
  'projects',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    // Stable public URL segment; generated on create and not changed by title edits.
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    categoryId: integer('category_id')
      .notNull()
      .references(() => projectCategories.id, { onDelete: 'restrict' }),
    description: text('description'),
    image: text('image'),
    link: text('link'),
    githubUrl: text('github_url'),
    sortOrder: integer('sort_order').notNull().default(0),
    ...timestamps(),
  },
  (table) => [
    uniqueIndex('projects_slug_uq').on(table.slug),
    index('projects_category_id_idx').on(table.categoryId),
    check('projects_slug_chk', matches(table.slug, SLUG_PATTERN)),
    check('projects_image_chk', matches(table.image, ASSET_URL_PATTERN)),
    check('projects_link_chk', matches(table.link, WEB_URL_PATTERN)),
    check('projects_github_url_chk', matches(table.githubUrl, WEB_URL_PATTERN)),
  ],
)

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert

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
  ],
)

export type ProjectRole = typeof projectRoles.$inferSelect
export type NewProjectRole = typeof projectRoles.$inferInsert

export const technologies = pgTable(
  'technologies',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    name: text('name').notNull(),
    createdAt: createdAt(),
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
// 12. SITE CONFIGURATION (singleton)
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
    ...timestamps(),
  },
  (table) => [check('site_config_singleton_chk', sql`${table.id} = 1`)],
)

export type SiteConfig = typeof siteConfig.$inferSelect
export type NewSiteConfig = typeof siteConfig.$inferInsert

// =============================================
// 13. ADMIN IDENTITY, PROFILES, AND SESSIONS
// =============================================
export const adminUsers = pgTable(
  'admin_users',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    ...timestamps(),
  },
  (table) => [
    uniqueIndex('admin_users_email_lower_uq').on(sql`lower(${table.email})`),
  ],
)

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
  ...timestamps(),
})

export const adminSessions = pgTable(
  'admin_sessions',
  {
    sessionId: text('session_id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => adminUsers.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: createdAt(),
  },
  (table) => [
    index('admin_sessions_user_id_idx').on(table.userId),
    index('admin_sessions_expires_at_idx').on(table.expiresAt),
  ],
)

// At most one pending (unconsumed) verification per email and purpose.
export const adminEmailVerifications = pgTable(
  'admin_email_verifications',
  {
    id: text('id').primaryKey(),
    purpose: text('purpose').$type<AdminVerificationPurpose>().notNull(),
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
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex('admin_email_verifications_email_purpose_active_uq')
      .on(sql`lower(${table.email})`, table.purpose)
      .where(sql`${table.consumedAt} IS NULL`),
    index('admin_email_verifications_expires_at_idx').on(table.expiresAt),
    check(
      'admin_email_verifications_purpose_chk',
      oneOf(table.purpose, ADMIN_VERIFICATION_PURPOSES),
    ),
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
