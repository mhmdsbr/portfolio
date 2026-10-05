'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'

export async function getGeneralSettings() {
  await requireAuth()

  const [config] = await db.select().from(schema.config).limit(1)

  return {
    apiBaseUrl: config?.apiBaseUrl ?? null,
    smtpHost: config?.smtpHost ?? null,
    smtpPort: config?.smtpPort ?? null,
    smtpUsername: config?.smtpUsername ?? null,
    hasSmtpPassword: Boolean(config?.smtpPassword),
    recaptchaSiteKey: config?.recaptchaSiteKey ?? null,
  }
}

export async function updateGeneralSettings(formData: FormData) {
  await requireAuth()

  const [existingConfig] = await db.select().from(schema.config).limit(1)
  const smtpPassword = formData.get('smtpPassword')
  const values = {
    apiBaseUrl: String(formData.get('apiBaseUrl') ?? '').trim() || null,
    smtpHost: String(formData.get('smtpHost') ?? '').trim() || null,
    smtpPort: String(formData.get('smtpPort') ?? '').trim() || null,
    smtpUsername: String(formData.get('smtpUsername') ?? '').trim() || null,
    smtpPassword:
      typeof smtpPassword === 'string' && smtpPassword.length > 0
        ? smtpPassword
        : existingConfig?.smtpPassword ?? null,
    recaptchaSiteKey:
      String(formData.get('recaptchaSiteKey') ?? '').trim() || null,
  }

  if (existingConfig) {
    await db
      .update(schema.config)
      .set(values)
      .where(eq(schema.config.id, existingConfig.id))
  } else {
    await db.insert(schema.config).values(values)
  }

  revalidatePath('/admin/general-settings')
  revalidatePath('/api/config')
  revalidatePath('/api/all')
}
