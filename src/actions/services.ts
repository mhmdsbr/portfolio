'use server'

import { requireAuth } from '@/lib/auth'
import { revalidateContent } from '@/server/revalidate'
import * as service from '@/server/services/service-items'

function readForm(formData: FormData) {
  return {
    title: formData.get('title'),
    description: formData.get('description'),
    icon: formData.get('icon'),
  }
}

export async function getServices() {
  await requireAuth()
  return service.getServices()
}

export async function createServiceItem(formData: FormData) {
  await requireAuth()
  const item = await service.createServiceItem(readForm(formData))
  revalidateContent('/admin/services')
  return item
}

export async function updateServiceItem(id: number, formData: FormData) {
  await requireAuth()
  const item = await service.updateServiceItem(id, readForm(formData))
  revalidateContent('/admin/services')
  return item
}

export async function deleteServiceItem(id: number) {
  await requireAuth()
  await service.deleteServiceItem(id)
  revalidateContent('/admin/services')
}

export async function reorderServiceItems(ids: number[]) {
  await requireAuth()
  await service.reorderServiceItems(ids)
  revalidateContent('/admin/services')
}
