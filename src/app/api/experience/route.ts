import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getSection } from '@/lib/db/sections'
import type { ApiResponse, ExperienceResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<ExperienceResponse>>> {
  try {
    const [section, experiencesData, skillsData] = await Promise.all([
      getSection('experience'),
      db.select().from(schema.experiences).orderBy(
        asc(schema.experiences.sortOrder),
        asc(schema.experiences.id),
      ),
      db.select().from(schema.skills).orderBy(
        asc(schema.skills.sortOrder),
        asc(schema.skills.id),
      ),
    ])

    const response: ExperienceResponse = {
      title: section?.title ?? null,
      button: {
        text: section?.config.buttonText ?? null,
        url: section?.config.buttonUrl ?? null,
      },
      experiences: experiencesData.map((experience) => ({
        from: experience.fromYear ?? null,
        to: experience.toYear,
        title: experience.jobTitle,
        company: experience.company,
        description: experience.description ?? null,
      })),
      skills: skillsData.map((item) => ({
        skill: item.skill,
        level: item.level ?? null,
      })),
    }

    return NextResponse.json({
      data: response,
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