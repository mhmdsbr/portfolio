import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import type { ApiResponse, AboutResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<AboutResponse>>> {
  try {
    const [aboutData, profileData, contactInfoData, detailsData, sectionData] = await Promise.all([
      db.select().from(schema.aboutSection),
      db.select().from(schema.portfolioProfile),
      db.select().from(schema.contactMethods).orderBy(asc(schema.contactMethods.sortOrder)),
      db.select().from(schema.profileFacts).orderBy(asc(schema.profileFacts.sortOrder)),
      db.select().from(schema.pageSections).where(eq(schema.pageSections.sectionKey, 'about')),
    ])

    const about = aboutData[0]
    const profile = profileData[0]

    const response: AboutResponse = {
      title: sectionData[0]?.title ?? null,
      overlay_title: sectionData[0]?.overlayTitle ?? null,
      name: profile?.name ?? null,
      job_title: profile?.jobTitle ?? null,
      description: profile?.biography ?? null,
      button: {
        text: about?.buttonText ?? null,
        url: about?.buttonUrl ?? null,
      },
      contact_information: contactInfoData.map((info) => ({
        kind: info.kind,
        title: info.title,
        value: info.value,
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