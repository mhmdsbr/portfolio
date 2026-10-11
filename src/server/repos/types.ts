// Types private to the server data layer (repos and the services above them).
// DB row types come from '@/lib/db/schema'; admin input types from
// '@/server/schemas/*'; types needed by the UI live in '@/shared/types'.
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core'
import type * as schema from '@/lib/db/schema'
import type {
  ContactMethodSectionKind,
  SectionConfigMap,
  SectionKind,
} from '@/shared/types'

export type { DbExecutor, Transaction } from './executor'

export type SectionWithConfig<K extends SectionKind> = Omit<
  schema.PageSection,
  'kind' | 'config'
> & {
  kind: K
  config: SectionConfigMap[K]
}

export type SectionMeta = Pick<
  schema.PageSection,
  'id' | 'kind' | 'navigationTitle' | 'title' | 'isEnabled'
>

export type SectionPresentation = Pick<
  schema.PageSection,
  'navigationTitle' | 'title'
>

export type ProjectWithDetails = schema.Project & {
  category: string
  categorySlug: string
  tech: string[]
  roles: string[]
}

export type ProjectFields = Omit<
  schema.NewProject,
  "id" | "slug" | "categoryId" | "sortOrder" | "createdAt" | "updatedAt"
>

export type ContactMethodWithSections = schema.ContactMethod & {
  sections: ContactMethodSectionKind[]
}

export type ContactMethodFields = Pick<
  schema.NewContactMethod,
  'kind' | 'title' | 'value'
>

export type OrderedTable = PgTable & { id: PgColumn; sortOrder: PgColumn }
type ManagedColumn = 'id' | 'sortOrder' | 'createdAt' | 'updatedAt'

export type OrderedInput<T extends OrderedTable> = Omit<
  T['$inferInsert'],
  ManagedColumn
>
