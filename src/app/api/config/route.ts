import { NextResponse } from 'next/server'
import { getPublicConfig } from '@/server/services/public-content'
import type { ApiResponse, ConfigResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<ConfigResponse>>> {
  try {
    const data = await getPublicConfig()
    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error fetching config:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch config data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
