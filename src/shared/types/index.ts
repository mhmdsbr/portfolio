// Types shared by client and server. Declarations only: no runtime code, so
// everything here is erased at build time. Values live in ./constants.
import type {
  ADMIN_VERIFICATION_PURPOSES,
  CONTACT_METHOD_KINDS,
  CONTACT_METHOD_SECTION_KINDS,
  SECTION_KINDS,
  SERVICE_ICONS,
  SOCIAL_PLATFORMS,
} from '../constants'

export type SectionKind = (typeof SECTION_KINDS)[number]
export type ContactMethodSectionKind =
  (typeof CONTACT_METHOD_SECTION_KINDS)[number]
export type ContactMethodKind = (typeof CONTACT_METHOD_KINDS)[number]
export type ServiceIcon = (typeof SERVICE_ICONS)[number]
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]
export type AdminVerificationPurpose =
  (typeof ADMIN_VERIFICATION_PURPOSES)[number]

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
