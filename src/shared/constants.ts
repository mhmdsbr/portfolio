// Single source of truth for value sets and formats shared by the schema
// (CHECK constraints), server actions, and UI. Keep this file free of imports
// so client components can use it.

export const SECTION_KINDS = [
  'hero',
  'about',
  'experience',
  'services',
  'projects',
  'testimonials',
  'contact',
] as const
export type SectionKind = (typeof SECTION_KINDS)[number]

// Sections that can display contact methods.
export const CONTACT_METHOD_SECTION_KINDS = ['about', 'contact'] as const
export type ContactMethodSectionKind =
  (typeof CONTACT_METHOD_SECTION_KINDS)[number]

export const CONTACT_METHOD_KINDS = [
  'email',
  'phone',
  'address',
  'other',
] as const
export type ContactMethodKind = (typeof CONTACT_METHOD_KINDS)[number]

export const SERVICE_ICONS = [
  'palette',
  'desktop',
  'pen-ruler',
  'paintbrush',
  'chart-area',
  'bullhorn',
] as const
export type ServiceIcon = (typeof SERVICE_ICONS)[number]

export const SOCIAL_PLATFORMS = [
  'behance',
  'dribbble',
  'facebook',
  'github',
  'instagram',
  'linkedin',
  'mail',
  'medium',
  'telegram',
  'twitter',
  'whatsapp',
  'youtube',
] as const
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]

export const ADMIN_VERIFICATION_PURPOSES = [
  'initial',
  'additional',
  'password_reset',
  'password_change',
] as const
export type AdminVerificationPurpose =
  (typeof ADMIN_VERIFICATION_PURPOSES)[number]

// Patterns are valid for both PostgreSQL (`~`) and JavaScript (`RegExp`).
export const SLUG_PATTERN = '^[a-z0-9]+(-[a-z0-9]+)*$'
// Absolute http(s) URL.
export const WEB_URL_PATTERN = '^https?://\\S+$'
// Image or file reference: absolute http(s) URL or site-relative path.
export const ASSET_URL_PATTERN = '^(https?://|/)\\S+$'
// Anything a link can point at: web URL, site path, anchor, mailto or tel.
export const LINK_URL_PATTERN = '^(https?://|/|#|mailto:|tel:)\\S+$'

export const YEAR_MIN = 1900
export const YEAR_MAX = 2100
