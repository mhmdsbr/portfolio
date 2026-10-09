'use server'

import { requireAuth } from '@/lib/auth'
import { revalidateContent } from '@/server/revalidate'
import * as service from '@/server/services/contact'

function readMethod(formData: FormData) {
  return {
    kind: formData.get('kind'),
    title: formData.get('title'),
    value: formData.get('value'),
    sections: formData.getAll('sections'),
  }
}

function revalidateContactMethods() {
  revalidateContent(
    '/admin/contact',
    '/admin/about',
    '/api/contact',
    '/api/about',
    '/',
  )
}

export async function getContact() {
  await requireAuth()
  return service.getContact()
}

export async function updateContact(formData: FormData) {
  await requireAuth()
  const config = await service.updateContactSettings({
    formTitle: formData.get('formTitle'),
    buttonText: formData.get('buttonText'),
    buttonUrl: formData.get('buttonUrl'),
  })
  revalidateContent('/admin/contact', '/api/contact')
  return config
}

export async function createContactMethod(formData: FormData) {
  await requireAuth()
  const method = await service.createContactMethod(readMethod(formData))
  revalidateContactMethods()
  return method
}

export async function updateContactMethod(id: number, formData: FormData) {
  await requireAuth()
  const method = await service.updateContactMethod(id, readMethod(formData))
  revalidateContactMethods()
  return method
}

export async function deleteContactMethod(id: number) {
  await requireAuth()
  await service.deleteContactMethod(id)
  revalidateContactMethods()
}

export async function reorderContactMethods(ids: number[]) {
  await requireAuth()
  await service.reorderContactMethods(ids)
  revalidateContactMethods()
}
