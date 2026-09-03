import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import type { ApiResponse, AboutResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<AboutResponse>>> {
  try {
    const [aboutData, contactInfoData, detailsData] = await Promise.all([
      db.select().from(schema.aboutSection),
      db.select().from(schema.aboutContactInfo).orderBy(asc(schema.aboutContactInfo.sortOrder)),
      db.select().from(schema.aboutDetails).orderBy(asc(schema.aboutDetails.sortOrder)),
    ])

    const about = aboutData[0]

    const response: AboutResponse = {
      title: about?.title ?? null,
      overlay_title: about?.overlayTitle ?? null,
      name: about?.name ?? null,
      job_title: about?.jobTitle ?? null,
      description: about?.description ?? null,
      button: {
        text: about?.buttonText ?? null,
        url: about?.buttonUrl ?? null,
      },
      contact_information: contactInfoData.map((info) => ({
        title: info.title,
        content: info.content,
      })),
      details: detailsData.map((detail) => ({
        number: detail.number,
        title: detail.title,
      })),
    }

    return NextResponse.json({
      data: response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error fetching about:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch about data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}