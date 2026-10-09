import type { SectionKind } from '@/lib/db/constants'
import { optionalText, optionalUrl } from '@/lib/validation'

// Section-specific settings stored in page_sections.config (jsonb).
export interface ButtonConfig {
  buttonText: string | null
  buttonUrl: string | null
}

export interface HeroConfig {
  location: string | null
  subtitleOne: string | null
  subtitleTwo: string | null
  logoUrl: string | null
}

export interface ContactConfig extends ButtonConfig {
  formTitle: string | null
}

export type EmptyConfig = Record<string, never>

export interface SectionConfigMap {
  hero: HeroConfig
  about: ButtonConfig
  experience: ButtonConfig
  services: EmptyConfig
  projects: EmptyConfig
  testimonials: EmptyConfig
  contact: ContactConfig
}

export type AnySectionConfig = SectionConfigMap[SectionKind]

export const SECTION_CONFIG_DEFAULTS: SectionConfigMap = {
  hero: { location: null, subtitleOne: null, subtitleTwo: null, logoUrl: null },
  about: { buttonText: null, buttonUrl: null },
  experience: { buttonText: null, buttonUrl: null },
  services: {},
  projects: {},
  testimonials: {},
  contact: { formTitle: null, buttonText: null, buttonUrl: null },
}

const sanitizers: {
  [K in SectionKind]: (input: Record<string, unknown>) => SectionConfigMap[K]
} = {
  hero: (input) => ({
    location: optionalText(input.location),
    subtitleOne: optionalText(input.subtitleOne),
    subtitleTwo: optionalText(input.subtitleTwo),
    logoUrl: optionalUrl(input.logoUrl, 'Logo URL', 'asset'),
  }),
  about: (input) => sanitizeButton(input),
  experience: (input) => sanitizeButton(input),
  services: () => ({}),
  projects: () => ({}),
  testimonials: () => ({}),
  contact: (input) => ({
    formTitle: optionalText(input.formTitle),
    ...sanitizeButton(input),
  }),
}

function sanitizeButton(input: Record<string, unknown>): ButtonConfig {
  return {
    buttonText: optionalText(input.buttonText),
    buttonUrl: optionalUrl(input.buttonUrl, 'Button URL'),
  }
}

/** Validates user input and returns a config containing only known keys. */
export function sanitizeSectionConfig<K extends SectionKind>(
  kind: K,
  input: Record<string, unknown>,
): SectionConfigMap[K] {
  return sanitizers[kind](input)
}

/** Fills defaults for stored configs so readers never see missing keys. */
export function readSectionConfig<K extends SectionKind>(
  kind: K,
  stored: unknown,
): SectionConfigMap[K] {
  const base = SECTION_CONFIG_DEFAULTS[kind]
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) {
    return { ...base }
  }
  const values = stored as Record<string, unknown>
  const result: Record<string, unknown> = { ...base }
  for (const key of Object.keys(base)) {
    const value = values[key]
    result[key] = typeof value === 'string' && value ? value : null
  }
  return result as SectionConfigMap[K]
}
