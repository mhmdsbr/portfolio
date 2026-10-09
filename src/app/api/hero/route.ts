import { NextResponse } from 'next/server'
import { getPublicHero } from '@/server/services/public-content'
import type { ApiResponse, HeroResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<HeroResponse>>> {
  try {
    const data = await getPublicHero()
    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error fetching hero:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch hero data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
