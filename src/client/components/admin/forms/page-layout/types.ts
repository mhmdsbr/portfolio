import type { SectionKind } from '@/shared/types'

export interface PageLayoutSection {
  kind: SectionKind
  navigationTitle: string
  title: string | null
  sortOrder: number
  isEnabled: boolean
}

export interface PageLayoutFormProps {
  initialSections: PageLayoutSection[]
}
