import type { ServiceIcon } from '@/lib/db/constants'
import { serviceRepo } from '@/server/repos/collections'
import { requireSection } from './page-sections'
import { assertFound } from './shared'

export interface ServiceItemInput {
  title: string
  description: string | null
  icon: ServiceIcon | null
}


export async function getServices() {
  const [{ section }, items] = await Promise.all([
    requireSection('services'),
    serviceRepo.list(),
  ])
  return { section, items }
}

export async function createServiceItem(input: ServiceItemInput) {
  return serviceRepo.append(input)
}

export async function updateServiceItem(id: number, input: ServiceItemInput) {
  return assertFound(
    await serviceRepo.update(id, input),
    'Service',
  )
}

export async function deleteServiceItem(id: number) {
  await serviceRepo.remove(id)
}

export async function reorderServiceItems(ids: number[]) {
  return serviceRepo.reorder(ids)
}
