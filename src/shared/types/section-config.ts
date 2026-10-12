// Shape of page_sections.config per section kind. Defaults live in
// '@/shared/constants' (SECTION_CONFIG_DEFAULTS).
import type { SectionKind } from './enums'

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
  about: EmptyConfig
  experience: EmptyConfig
  services: EmptyConfig
  projects: EmptyConfig
  testimonials: EmptyConfig
  contact: ContactConfig
}

export type AnySectionConfig = SectionConfigMap[SectionKind]
