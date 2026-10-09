import { NextResponse } from 'next/server'
import { getPublicServices } from '@/server/services/public-content'
import type { ApiResponse, ServicesResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<ServicesResponse>>> {
  try {
    const data = await getPublicServices()
    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error fetching services:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch services data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
