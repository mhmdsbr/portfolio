import type { ContactConfig, ContactMethodKind, ContactMethodSectionKind, SocialPlatform } from '@/shared/types'

export interface ContactFormProps {
  config: ContactConfig
}

export interface ContactMethod {
  id: number
  kind: ContactMethodKind
  title: string
  value: string
  sortOrder: number | null
  sections: ContactMethodSectionKind[]
}

export interface ContactMethodsFormProps {
  contactMethods: ContactMethod[]
}

export interface SocialLink {
  id: number
  platform: SocialPlatform
  url: string
  sortOrder: number
}

export interface SocialLinksFormProps {
  socialLinks: SocialLink[]
}
