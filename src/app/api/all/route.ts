import { NextResponse } from 'next/server'
import { getPublicAll } from '@/server/services/public-content'
import type { ApiResponse, AllDataResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<AllDataResponse>>> {
  try {
    const data = await getPublicAll()
    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error fetching all data:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
