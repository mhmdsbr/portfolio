'use server'

import { requireAuth } from '@/lib/auth'
import { revalidateContent } from '@/server/revalidate'
import * as service from '@/server/services/site-settings'

export async function getFooter() {
  await requireAuth()
  return service.getFooter()
}

export async function updateFooter(formData: FormData) {
  await requireAuth()
  const footer = await service.saveFooter({
    companyName: formData.get('companyName'),
    privacyPolicy: formData.get('privacyPolicy'),
    termsOfService: formData.get('termsOfService'),
    copyrightText: formData.get('copyrightText'),
  })
  revalidateContent('/admin/footer')
  return footer
}
