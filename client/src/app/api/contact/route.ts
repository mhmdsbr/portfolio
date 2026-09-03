import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { NextResponse } from 'next/server'
import type { ApiResponse, ContactResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<ContactResponse>>> {
  try {
    const [contactData] = await db.select().from(schema.contactSection)

    const response: ContactResponse = {
      title: contactData?.title ?? null,
      overlay_title: contactData?.overlayTitle ?? null,
      form_title: contactData?.formTitle ?? null,
      button: {
        text: contactData?.buttonText ?? null,
        url: contactData?.buttonUrl ?? null,
      },
      info_title: contactData?.infoTitle ?? null,
      address: contactData?.address ?? null,
      phone: contactData?.phone ?? null,
      email: contactData?.email ?? null,
    }

    return NextResponse.json({
      data: response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error fetching contact:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch contact data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}