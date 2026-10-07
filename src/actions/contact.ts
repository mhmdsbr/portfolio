'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { asc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { ensurePortfolioSections } from '@/lib/db/portfolio-sections'

const contactMethodKinds = schema.contactMethodKindEnum.enumValues

// =============================================
// GET
// =============================================

export async function getContact() {
  await requireAuth()

  const [[contact], [section], contactMethods] = await Promise.all([
    db.select().from(schema.contactSection).limit(1),
    db.select().from(schema.pageSections).where(eq(schema.pageSections.sectionKey, 'contact')).limit(1),
    db.select().from(schema.contactMethods).orderBy(asc(schema.contactMethods.sortOrder)),
  ])

  return {
    ...(contact || {
      id: 0,
      formTitle: null,
      buttonText: null,
      buttonUrl: null,
    }),
    title: section?.title ?? null,
    overlayTitle: section?.overlayTitle ?? null,
    contactMethods,
  }
}

// =============================================
// UPDATE CONTACT SECTION
// =============================================

export async function updateContact(formData: FormData) {
  await requireAuth()
  await ensurePortfolioSections()

  const formTitle = formData.get('formTitle') as string
  const buttonText = formData.get('buttonText') as string
  const buttonUrl = formData.get('buttonUrl') as string

  const values = {
    formTitle: formTitle || null,
    buttonText: buttonText || null,
    buttonUrl: buttonUrl || null,
  }
  const [existingContact] = await db.select()
    .from(schema.contactSection)
    .where(eq(schema.contactSection.sectionKey, 'contact'))
    .limit(1)
  const [contact] = existingContact
    ? await db.update(schema.contactSection).set(values).where(eq(schema.contactSection.id, existingContact.id)).returning()
    : await db.insert(schema.contactSection)
        .values({ ...values, sectionKey: 'contact' })
        .returning()

  revalidatePath('/admin/contact')
  revalidatePath('/api/all')
  revalidatePath('/api/contact')

  return contact
}

function getContactMethodKind(formData: FormData): schema.ContactMethodKind {
  const kind = formData.get('kind')
  const validKind = contactMethodKinds.find((candidate) => candidate === kind)
  if (!validKind) {
    throw new Error('Invalid contact method kind')
  }
  return validKind
}

export async function createContactMethod(formData: FormData) {
  await requireAuth()
  const kind = getContactMethodKind(formData)
  const title = String(formData.get('title') ?? '').trim()
  const value = String(formData.get('value') ?? '').trim()
  if (!title || !value) throw new Error('Contact method title and value are required')

  const existing = await db.select()
    .from(schema.contactMethods)
    .orderBy(schema.contactMethods.sortOrder)
  const sortOrder = existing.length > 0
    ? (existing[existing.length - 1].sortOrder ?? -1) + 1
    : 0

  const [method] = await db.insert(schema.contactMethods)
    .values({ kind, title, value, sortOrder })
    .returning()

  revalidateContactMethods()
  return method
}

export async function updateContactMethod(id: number, formData: FormData) {
  await requireAuth()
  const kind = getContactMethodKind(formData)
  const title = String(formData.get('title') ?? '').trim()
  const value = String(formData.get('value') ?? '').trim()
  if (!title || !value) throw new Error('Contact method title and value are required')

  const [method] = await db.update(schema.contactMethods)
    .set({ kind, title, value })
    .where(eq(schema.contactMethods.id, id))
    .returning()
  if (!method) throw new Error('Contact method not found')

  revalidateContactMethods()
  return method
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