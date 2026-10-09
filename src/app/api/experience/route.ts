import { NextResponse } from 'next/server'
import { getPublicExperience } from '@/server/services/public-content'
import type { ApiResponse, ExperienceResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<ExperienceResponse>>> {
  try {
    const data = await getPublicExperience()
    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error fetching experience:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch experience data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
