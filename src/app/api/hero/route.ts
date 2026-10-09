import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getSection } from '@/server/repos/page-sections'
import type { ApiResponse, HeroResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<HeroResponse>>> {
  try {
    const section = await getSection('hero')
    const titlesData = section
      ? await db.select().from(schema.heroTitles)
          .where(eq(schema.heroTitles.sectionId, section.id))
          .orderBy(asc(schema.heroTitles.sortOrder), asc(schema.heroTitles.id))
      : []

    const response: HeroResponse = {
      titles: titlesData.map((t) => t.title),
      location: section?.config.location ?? null,
      subtitle_one: section?.config.subtitleOne ?? null,
      subtitle_two: section?.config.subtitleTwo ?? null,
      logo: section?.config.logoUrl ?? null,
    }

    return NextResponse.json({
      data: response,
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