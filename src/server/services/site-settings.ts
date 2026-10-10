import { siteConfigRepo } from '@/server/repos/singletons'

const DEFAULT_COMPANY_NAME = 'Your Company'

export async function getFooter() {
  const config = await siteConfigRepo.get()
  return (
    config ?? {
      companyName: DEFAULT_COMPANY_NAME,
      privacyPolicy: null,
      termsOfService: null,
      copyrightText: null,
    }
  )
}

export async function saveFooter(input: {
  companyName: string | null
  privacyPolicy: string | null
  termsOfService: string | null
  copyrightText: string | null
}) {
  return siteConfigRepo.save({
    companyName: input.companyName ?? DEFAULT_COMPANY_NAME,
    privacyPolicy: input.privacyPolicy,
    termsOfService: input.termsOfService,
    copyrightText: input.copyrightText,
  })
}

export async function getGeneralSettings() {
  const config = await siteConfigRepo.get()
  return { recaptchaSiteKey: config?.recaptchaSiteKey ?? null }
}

export async function saveGeneralSettings(input: { recaptchaSiteKey: string | null }) {
  await siteConfigRepo.save({ recaptchaSiteKey: input.recaptchaSiteKey })
}
