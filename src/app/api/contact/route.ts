import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import type { ApiResponse, ContactResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<ContactResponse>>> {
  try {
    const [contactData, sectionData, methodsData] = await Promise.all([
      db.select().from(schema.contactSection),
      db.select().from(schema.pageSections).where(eq(schema.pageSections.sectionKey, 'contact')),
      db.select().from(schema.contactMethods).orderBy(asc(schema.contactMethods.sortOrder)),
    ])

    const response: ContactResponse = {
      title: sectionData[0]?.title ?? null,
      overlay_title: sectionData[0]?.overlayTitle ?? null,
      form_title: contactData[0]?.formTitle ?? null,
      button: {
        text: contactData[0]?.buttonText ?? null,
        url: contactData[0]?.buttonUrl ?? null,
      },
      methods: methodsData.map(({ id, kind, title, value }) => ({
        id,
        kind,
        title,
        value,
      })),
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