import { NextResponse } from 'next/server'
import { getPublicContact } from '@/server/services/public-content'
import type { ApiResponse, ContactResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<ContactResponse>>> {
  try {
    const data = await getPublicContact()
    return NextResponse.json({
      data,
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
