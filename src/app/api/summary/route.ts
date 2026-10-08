import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import type { ApiResponse, SummaryResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<SummaryResponse>>> {
  try {
    const [summaryData, jobsData, experiencesData, sectionData] = await Promise.all([
      db.select().from(schema.experienceSection),
      db.select().from(schema.experiences).orderBy(
        asc(schema.experiences.sortOrder),
        asc(schema.experiences.id),
      ),
      db.select().from(schema.skills).orderBy(
        asc(schema.skills.sortOrder),
        asc(schema.skills.id),
      ),
      db.select().from(schema.pageSections).where(eq(schema.pageSections.sectionKey, 'experience')),
    ])

    const summary = summaryData[0]

    const response: SummaryResponse = {
      title: sectionData[0]?.title ?? null,
      overlay_title: sectionData[0]?.overlayTitle ?? null,
      button: {
        text: summary?.buttonText ?? null,
        url: summary?.buttonUrl ?? null,
      },
      jobs: jobsData.map((job) => ({
        from: job.fromYear ?? null,
        to: job.toYear,
        title: job.jobTitle,
        company: job.company,
        description: job.description ?? null,
      })),
      experiences: experiencesData.map((exp) => ({
        skill: exp.skill,
        level: exp.level ?? null,
      })),
    }

    return NextResponse.json({
      data: response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error fetching summary:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch summary data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}