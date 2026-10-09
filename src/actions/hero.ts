'use server'

import { requireAuth } from '@/lib/auth'
import { revalidateContent } from '@/server/revalidate'
import * as service from '@/server/services/hero'

export async function getHero() {
  await requireAuth()
  return service.getHero()
}

export async function updateHero(formData: FormData) {
  await requireAuth()
  const config = await service.updateHeroSettings({
    location: formData.get('location'),
    subtitleOne: formData.get('subtitleOne'),
    subtitleTwo: formData.get('subtitleTwo'),
    logoUrl: formData.get('logoUrl'),
  })
  revalidateContent('/admin/hero')
  return config
}

export async function updateHeroTitles(titles: string[]) {
  await requireAuth()
  await service.replaceTitles(titles)
  revalidateContent('/admin/hero')
}
