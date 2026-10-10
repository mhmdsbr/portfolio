// Single source of truth for value sets and formats shared by the schema
// (CHECK constraints), server actions, and UI. Values only; the types derived
// from them live in ./types. Keep runtime imports out so client components can
// use it.
import type { SectionConfigMap } from './types'

export const SECTION_KINDS = [
  'hero',
  'about',
  'experience',
  'services',
  'projects',
  'testimonials',
  'contact',
] as const

// Sections that can display contact methods.
export const CONTACT_METHOD_SECTION_KINDS = ['about', 'contact'] as const

export const CONTACT_METHOD_KINDS = [
  'email',
  'phone',
  'address',
  'other',
] as const

export const SERVICE_ICONS = [
  'palette',
  'desktop',
  'pen-ruler',
  'paintbrush',
  'chart-area',
  'bullhorn',
] as const

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

export const ADMIN_VERIFICATION_PURPOSES = [
  'initial',
  'additional',
  'password_reset',
  'password_change',
] as const

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

// Defaults for page_sections.config, per section kind.
export const SECTION_CONFIG_DEFAULTS: SectionConfigMap = {
  hero: { location: null, subtitleOne: null, subtitleTwo: null, logoUrl: null },
  about: {},
  experience: {},
  services: {},
  projects: {},
  testimonials: {},
  contact: { formTitle: null, buttonText: null, buttonUrl: null },
}
