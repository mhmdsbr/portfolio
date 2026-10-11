// Types derived from the value sets in '@/shared/constants'. Declarations only.
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
