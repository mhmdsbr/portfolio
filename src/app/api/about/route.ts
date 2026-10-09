import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getSection } from '@/lib/db/sections'
import { getContactMethodsForSection } from '@/lib/contact-methods'
import type { ApiResponse, AboutResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<AboutResponse>>> {
  try {
    const [section, profileData, contactInfoData, detailsData] = await Promise.all([
      getSection('about'),
      db.select().from(schema.profile),
      getContactMethodsForSection('about'),
      db.select().from(schema.profileFacts).orderBy(
        asc(schema.profileFacts.sortOrder),
        asc(schema.profileFacts.id),
      ),
    ])

    const profile = profileData[0]

    const response: AboutResponse = {
      title: section?.title ?? null,
      name: profile?.name ?? null,
      job_title: profile?.jobTitle ?? null,
      description: profile?.biography ?? null,
      button: {
        text: section?.config.buttonText ?? null,
        url: section?.config.buttonUrl ?? null,
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