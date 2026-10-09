import { NextResponse } from 'next/server'
import { getPublicFooter } from '@/server/services/public-content'
import type { ApiResponse, FooterResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<FooterResponse>>> {
  try {
    const data = await getPublicFooter()
    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error fetching footer:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch footer data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
