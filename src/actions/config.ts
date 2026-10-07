'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'

export async function getGeneralSettings() {
  await requireAuth()

  const [config] = await db.select().from(schema.appConfig).limit(1)

  return {
    recaptchaSiteKey: config?.recaptchaSiteKey ?? null,
  }
}

export async function updateGeneralSettings(formData: FormData) {
  await requireAuth()

  const [existingConfig] = await db.select().from(schema.appConfig).limit(1)
  const values = {
    recaptchaSiteKey:
      String(formData.get('recaptchaSiteKey') ?? '').trim() || null,
  }

  if (existingConfig) {
    await db
      .update(schema.appConfig)
      .set(values)
      .where(eq(schema.appConfig.id, existingConfig.id))
  } else {
    await db.insert(schema.appConfig).values(values)
  }

  revalidatePath('/admin/general-settings')
  revalidatePath('/api/config')
  revalidatePath('/api/all')
}
