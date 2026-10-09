import { NextResponse } from 'next/server'
import { getPublicAbout } from '@/server/services/public-content'
import type { ApiResponse, AboutResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<AboutResponse>>> {
  try {
    const data = await getPublicAbout()
    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error fetching about:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch about data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
