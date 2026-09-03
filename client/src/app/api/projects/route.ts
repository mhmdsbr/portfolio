import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import type { ApiResponse, ProjectsResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<ProjectsResponse>>> {
  try {
    const [projectsData, itemsData] = await Promise.all([
      db.select().from(schema.projectsSection),
      db.select().from(schema.projectItems).orderBy(asc(schema.projectItems.sortOrder)),
    ])

    const projects = projectsData[0]

    const response: ProjectsResponse = {
      title: projects?.title ?? null,
      overlay_title: projects?.overlayTitle ?? null,
      items: itemsData.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        description: item.description ?? null,
        image: item.image ?? null,
        link: item.link ?? null,
        github: item.github ?? null,
        tech: item.tech ?? null,
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