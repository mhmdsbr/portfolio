'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'

// =============================================
// GET
// =============================================

export async function getContact() {
  await requireAuth()

  const [contact] = await db.select()
    .from(schema.contactSection)
    .limit(1)

  return contact || {
    id: 0,
    title: null,
    overlayTitle: null,
    formTitle: null,
    buttonText: null,
    buttonUrl: null,
    infoTitle: null,
    address: null,
    phone: null,
    email: null,
  }
}

// =============================================
// UPDATE CONTACT SECTION
// =============================================

export async function updateContact(formData: FormData) {
  await requireAuth()

  const title = formData.get('title') as string
  const overlayTitle = formData.get('overlayTitle') as string
  const formTitle = formData.get('formTitle') as string
  const buttonText = formData.get('buttonText') as string
  const buttonUrl = formData.get('buttonUrl') as string
  const infoTitle = formData.get('infoTitle') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string

  const [contact] = await db.update(schema.contactSection)
    .set({
      title: title || null,
      overlayTitle: overlayTitle || null,
      formTitle: formTitle || null,
      buttonText: buttonText || null,
      buttonUrl: buttonUrl || null,
      infoTitle: infoTitle || null,
      address: address || null,
      phone: phone || null,
      email: email || null,
    })
    .where(eq(schema.contactSection.id, 1))
    .returning()

  revalidatePath('/admin/contact')
  revalidatePath('/api/all')

  return contact
}