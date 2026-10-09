import { NextResponse } from 'next/server'
import { getSection } from '@/lib/db/sections'
import { getContactMethodsForSection } from '@/lib/contact-methods'
import type { ApiResponse, ContactResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<ContactResponse>>> {
  try {
    const [section, methodsData] = await Promise.all([
      getSection('contact'),
      getContactMethodsForSection('contact'),
    ])

    const response: ContactResponse = {
      title: section?.title ?? null,
      form_title: section?.config.formTitle ?? null,
      button: {
        text: section?.config.buttonText ?? null,
        url: section?.config.buttonUrl ?? null,
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