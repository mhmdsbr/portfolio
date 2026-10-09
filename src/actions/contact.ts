'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { CONTACT_METHOD_KINDS } from '@/lib/db/constants'
import { getSection, updateSectionConfig } from '@/lib/db/sections'
import {
  getContactMethodsWithSections,
  parseContactMethodSections,
  setContactMethodSections,
} from '@/lib/contact-methods'
import { requiredText } from '@/lib/validation'

// =============================================
// GET
// =============================================

export async function getContact() {
  await requireAuth()

  const [section, contactMethods] = await Promise.all([
    getSection('contact'),
    getContactMethodsWithSections(),
  ])

  return {
    id: 0,
    formTitle: section?.config.formTitle ?? null,
    buttonText: section?.config.buttonText ?? null,
    buttonUrl: section?.config.buttonUrl ?? null,
    title: section?.title ?? null,
    contactMethods,
  }
}

// =============================================
// UPDATE CONTACT SECTION
// =============================================

export async function updateContact(formData: FormData) {
  await requireAuth()

  const { config } = await updateSectionConfig('contact', {
    formTitle: formData.get('formTitle'),
    buttonText: formData.get('buttonText'),
    buttonUrl: formData.get('buttonUrl'),
  })

  revalidatePath('/admin/contact')
  revalidatePath('/api/all')
  revalidatePath('/api/contact')

  return config
}

function getContactMethodKind(formData: FormData): schema.ContactMethodKind {
  const kind = formData.get('kind')
  const validKind = CONTACT_METHOD_KINDS.find((candidate) => candidate === kind)
  if (!validKind) {
    throw new Error('Invalid contact method kind')
  }
  return validKind
}

function parseContactMethodForm(formData: FormData) {
  return {
    kind: getContactMethodKind(formData),
    title: requiredText(formData.get('title'), 'Contact method title'),
    value: requiredText(formData.get('value'), 'Contact method value'),
    sections: parseContactMethodSections(formData.getAll('sections')),
  }
}

export async function createContactMethod(formData: FormData) {
  await requireAuth()
  const { sections, ...values } = parseContactMethodForm(formData)

  const method = await db.transaction(async (transaction) => {
    const [last] = await transaction.select({ sortOrder: schema.contactMethods.sortOrder })
      .from(schema.contactMethods)
      .orderBy(desc(schema.contactMethods.sortOrder), desc(schema.contactMethods.id))
      .limit(1)

    const [created] = await transaction.insert(schema.contactMethods)
      .values({ ...values, sortOrder: last ? last.sortOrder + 1 : 0 })
      .returning()
    await setContactMethodSections(transaction, created.id, sections)
    return created
  })

  revalidateContactMethods()
  return { ...method, sections }
}

export async function updateContactMethod(id: number, formData: FormData) {
  await requireAuth()
  const { sections, ...values } = parseContactMethodForm(formData)

  const method = await db.transaction(async (transaction) => {
    const [updated] = await transaction.update(schema.contactMethods)
      .set(values)
      .where(eq(schema.contactMethods.id, id))
      .returning()
    if (!updated) throw new Error('Contact method not found')
    await setContactMethodSections(transaction, id, sections)
    return updated
  })

  revalidateContactMethods()
  return { ...method, sections }
}

export async function deleteContactMethod(id: number) {
  await requireAuth()
  const deleted = await db.delete(schema.contactMethods)
    .where(eq(schema.contactMethods.id, id))
    .returning({ id: schema.contactMethods.id })
  if (deleted.length === 0) throw new Error('Contact method not found')
  revalidateContactMethods()
}

export async function reorderContactMethods(ids: number[]) {
  await requireAuth()
  await Promise.all(
    ids.map((id, index) =>
      db.update(schema.contactMethods)
        .set({ sortOrder: index })
        .where(eq(schema.contactMethods.id, id)),
    ),
  )
  revalidateContactMethods()
}

function revalidateContactMethods() {
  revalidatePath('/admin/contact')
  revalidatePath('/api/all')
  revalidatePath('/api/contact')
  revalidatePath('/api/about')
  revalidatePath('/')
}