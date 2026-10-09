'use server'

import { requireAuth } from '@/lib/auth'
import { revalidateContent } from '@/server/revalidate'
import * as service from '@/server/services/site-settings'

export async function getGeneralSettings() {
  await requireAuth()
  return service.getGeneralSettings()
}

export async function updateGeneralSettings(formData: FormData) {
  await requireAuth()
  await service.saveGeneralSettings({
    recaptchaSiteKey: formData.get('recaptchaSiteKey'),
  })
  revalidateContent('/admin/general-settings', '/api/config')
}
