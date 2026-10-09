'use server'

import { requireAuth } from '@/lib/auth'
import { revalidateContent } from '@/server/revalidate'
import * as service from '@/server/services/about'

function readDetail(formData: FormData) {
  return { number: formData.get('number'), title: formData.get('title') }
}

export async function getAbout() {
  await requireAuth()
  return service.getAbout()
}

export async function updateAbout(formData: FormData) {
  await requireAuth()
  await service.saveProfile({
    name: formData.get('name'),
    jobTitle: formData.get('jobTitle'),
    biography: formData.get('description'),
  })
  revalidateContent('/admin/about', '/')
}

export async function createDetail(formData: FormData) {
  await requireAuth()
  const detail = await service.createDetail(readDetail(formData))
  revalidateContent('/admin/about')
  return detail
}

export async function updateDetail(id: number, formData: FormData) {
  await requireAuth()
  const detail = await service.updateDetail(id, readDetail(formData))
  revalidateContent('/admin/about')
  return detail
}

export async function deleteDetail(id: number) {
  await requireAuth()
  await service.deleteDetail(id)
  revalidateContent('/admin/about')
}

export async function reorderDetails(ids: number[]) {
  await requireAuth()
  await service.reorderDetails(ids)
  revalidateContent('/admin/about')
}
