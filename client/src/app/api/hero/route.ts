import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import type { ApiResponse, HeroResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<HeroResponse>>> {
  try {
    const [heroData, titlesData] = await Promise.all([
      db.select().from(schema.heroSection),
      db.select().from(schema.heroTitles).orderBy(asc(schema.heroTitles.sortOrder)),
    ])

    const hero = heroData[0]

    const response: HeroResponse = {
      titles: titlesData.map((t) => t.title),
      location: hero?.location ?? null,
      subtitle_one: hero?.subtitleOne ?? null,
      subtitle_two: hero?.subtitleTwo ?? null,
      logo: hero?.logoUrl ?? null,
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