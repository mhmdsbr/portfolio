import { NextResponse } from 'next/server'
import { getPublicProjects } from '@/server/services/public-content'
import type { ApiResponse, ProjectsResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<ProjectsResponse>>> {
  try {
    const data = await getPublicProjects()
    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error fetching projects:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch projects data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
