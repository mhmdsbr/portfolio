import { SERVICE_ICONS, type ServiceIcon } from '@/lib/db/constants'
import { optionalText, parseIdList, requiredText } from '@/lib/validation'
import { serviceRepo } from '@/server/repos/collections'
import { requireSection } from './page-sections'
import { assertFound } from './shared'

export interface ServiceItemInput {
  title: unknown
  description: unknown
  icon: unknown
}

function parseServiceIcon(value: unknown): ServiceIcon | null {
  const icon = optionalText(value)
  if (icon === null) return null
  const validIcon = SERVICE_ICONS.find((candidate) => candidate === icon)
  if (!validIcon) throw new Error('Invalid service icon')
  return validIcon
}

function parseServiceItem(input: ServiceItemInput) {
  return {
    title: requiredText(input.title, 'Service title'),
    description: optionalText(input.description),
    icon: parseServiceIcon(input.icon),
  }
}

export async function getServices() {
  const [{ section }, items] = await Promise.all([
    requireSection('services'),
    serviceRepo.list(),
  ])
  return { section, items }
}

export async function createServiceItem(input: ServiceItemInput) {
  return serviceRepo.append(parseServiceItem(input))
}

export async function updateServiceItem(id: number, input: ServiceItemInput) {
  return assertFound(
    await serviceRepo.update(id, parseServiceItem(input)),
    'Service',
  )
}

export async function deleteServiceItem(id: number) {
  await serviceRepo.remove(id)
}

export async function reorderServiceItems(ids: unknown) {
  return serviceRepo.reorder(parseIdList(ids))
}
