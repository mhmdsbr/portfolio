import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import type { ApiResponse, ProjectsResponse } from '@/types/api'
import { getProjects } from '@/lib/projects'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<ProjectsResponse>>> {
  try {
    const [sectionData, itemsData] = await Promise.all([
      db.select().from(schema.pageSections).where(eq(schema.pageSections.sectionKey, 'projects')),
      getProjects(),
    ])

    const response: ProjectsResponse = {
      title: sectionData[0]?.title ?? null,
      overlay_title: sectionData[0]?.overlayTitle ?? null,
      items: itemsData.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        description: item.description ?? null,
        image: item.image ?? null,
        link: item.link ?? null,
        github_url: item.githubUrl ?? null,
        tech: item.tech.length > 0 ? item.tech : null,
        roles: item.roles.length > 0 ? item.roles : null,
      })),
    }

    return NextResponse.json({
      data: response,
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