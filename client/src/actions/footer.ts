'use server'

import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'

export async function getFooter() {
  await requireAuth()
  
  const [footer] = await db.select()
    .from(schema.footerSection)
    .limit(1)
  
  return footer || { 
    companyName: 'Your Company',
    privacyPolicy: null,
    termsOfService: null,
    copyrightText: null 
  }
}

export async function updateFooter(formData: FormData) {
  await requireAuth()
  
  const companyName = formData.get('companyName') as string
  const privacyPolicy = formData.get('privacyPolicy') as string
  const termsOfService = formData.get('termsOfService') as string
  const copyrightText = formData.get('copyrightText') as string

  const [footer] = await db.update(schema.footerSection)
    .set({
      companyName: companyName || 'Your Company',
      privacyPolicy: privacyPolicy || null,
      termsOfService: termsOfService || null,
      copyrightText: copyrightText || null,
    })
    .where(eq(schema.footerSection.id, 1))
    .returning()
  
  revalidatePath('/admin/footer')
  revalidatePath('/api/all')
  
  return footer
}