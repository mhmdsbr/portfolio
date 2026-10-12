import type { SectionKind } from '@/shared/types'

export interface SectionSettingsData {
  kind: SectionKind
  navigationTitle: string
  title: string | null
  isEnabled: boolean
}

export interface SectionSettingsFormProps {
  section: SectionSettingsData
}
