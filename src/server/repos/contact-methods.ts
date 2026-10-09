import { asc, desc, eq, inArray } from 'drizzle-orm'
import * as schema from '@/lib/db/schema'
import {
  CONTACT_METHOD_SECTION_KINDS,
  type ContactMethodSectionKind,
} from '@/lib/db/constants'
import { defaultExecutor, type DbExecutor } from './executor'

export type ContactMethodWithSections = schema.ContactMethod & {
  sections: ContactMethodSectionKind[]
}

const isMethodSection = (kind: string): kind is ContactMethodSectionKind =>
  (CONTACT_METHOD_SECTION_KINDS as readonly string[]).includes(kind)

/** All contact methods in display order, each with the sections showing it. */
export async function getContactMethodsWithSections(
  executor: DbExecutor = defaultExecutor,
): Promise<ContactMethodWithSections[]> {
  const rows = await executor
    .select({
      method: schema.contactMethods,
      sectionKind: schema.pageSections.kind,
    })
    .from(schema.contactMethods)
    .leftJoin(
      schema.contactMethodSections,
      eq(schema.contactMethodSections.contactMethodId, schema.contactMethods.id),
    )
    .leftJoin(
      schema.pageSections,
      eq(schema.pageSections.id, schema.contactMethodSections.sectionId),
    )
    .orderBy(asc(schema.contactMethods.sortOrder), asc(schema.contactMethods.id))

  const methods = new Map<number, ContactMethodWithSections>()
  for (const { method, sectionKind } of rows) {
    const entry = methods.get(method.id) ?? { ...method, sections: [] }
    if (sectionKind && isMethodSection(sectionKind)) {
      entry.sections.push(sectionKind)
    }
    methods.set(method.id, entry)
  }
  return [...methods.values()].map((method) => ({
    ...method,
    sections: CONTACT_METHOD_SECTION_KINDS.filter((kind) =>
      method.sections.includes(kind),
    ),
  }))
}

/** Contact methods shown by one section, in display order. */
export async function getContactMethodsForSection(
  kind: ContactMethodSectionKind,
  executor: DbExecutor = defaultExecutor,
) {
  const methods = await getContactMethodsWithSections(executor)
  return methods.filter((method) => method.sections.includes(kind))
}

/** Replaces the set of sections that display a contact method. */
export async function setContactMethodSections(
  executor: DbExecutor,
  contactMethodId: number,
  kinds: ContactMethodSectionKind[],
) {
  await executor
    .delete(schema.contactMethodSections)
    .where(eq(schema.contactMethodSections.contactMethodId, contactMethodId))
  if (kinds.length === 0) return

  const sections = await executor
    .select({ id: schema.pageSections.id })
    .from(schema.pageSections)
    .where(inArray(schema.pageSections.kind, kinds))
  if (sections.length !== kinds.length) {
    throw new Error('Unable to resolve contact method sections')
  }
  await executor.insert(schema.contactMethodSections).values(
    sections.map(({ id }) => ({ contactMethodId, sectionId: id })),
  )
}

export type ContactMethodFields = Pick<
  schema.NewContactMethod,
  'kind' | 'title' | 'value'
>

export async function insertContactMethodAtEnd(
  executor: DbExecutor,
  fields: ContactMethodFields,
) {
  const [last] = await executor
    .select({ sortOrder: schema.contactMethods.sortOrder })
    .from(schema.contactMethods)
    .orderBy(desc(schema.contactMethods.sortOrder), desc(schema.contactMethods.id))
    .limit(1)
  const [created] = await executor
    .insert(schema.contactMethods)
    .values({ ...fields, sortOrder: last ? last.sortOrder + 1 : 0 })
    .returning()
  return created
}

export async function updateContactMethodRow(
  executor: DbExecutor,
  id: number,
  fields: ContactMethodFields,
) {
  const [updated] = await executor
    .update(schema.contactMethods)
    .set(fields)
    .where(eq(schema.contactMethods.id, id))
    .returning()
  return updated
}

/** Returns true when a row was removed. */
export async function deleteContactMethodRow(id: number) {
  const deleted = await defaultExecutor
    .delete(schema.contactMethods)
    .where(eq(schema.contactMethods.id, id))
    .returning({ id: schema.contactMethods.id })
  return deleted.length > 0
}

export async function listContactMethodIds(executor: DbExecutor) {
  const rows = await executor
    .select({ id: schema.contactMethods.id })
    .from(schema.contactMethods)
  return rows.map(({ id }) => id)
}

export async function setContactMethodOrder(executor: DbExecutor, ids: number[]) {
  for (const [sortOrder, id] of ids.entries()) {
    await executor
      .update(schema.contactMethods)
      .set({ sortOrder })
      .where(eq(schema.contactMethods.id, id))
  }
}
