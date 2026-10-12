import type { ContactConfig, ContactMethodKind, ContactMethodSectionKind } from '@/shared/types'

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
