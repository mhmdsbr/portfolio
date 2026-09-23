import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import type { ApiResponse, SummaryResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<SummaryResponse>>> {
  try {
    const [summaryData, jobsData, experiencesData] = await Promise.all([
      db.select().from(schema.summarySection),
      db.select().from(schema.summaryJobs).orderBy(asc(schema.summaryJobs.sortOrder)),
      db.select().from(schema.summaryExperiences).orderBy(asc(schema.summaryExperiences.sortOrder)),
    ])

    const summary = summaryData[0]

    const response: SummaryResponse = {
      title: summary?.title ?? null,
      overlay_title: summary?.overlayTitle ?? null,
      button: {
        text: summary?.buttonText ?? null,
        url: summary?.buttonUrl ?? null,
      },
      jobs: jobsData.map((job) => ({
        from: job.fromYear ?? null,
        to: job.toYear ?? null,
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