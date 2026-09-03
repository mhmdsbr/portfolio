import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import type { ApiResponse, SidebarResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<SidebarResponse>>> {
  try {
    // Fetch data in parallel
    const [sidebarData, socialData, generalData] = await Promise.all([
      db.select().from(schema.sidebar),
      db.select().from(schema.socialMedia).orderBy(asc(schema.socialMedia.sortOrder)),
      db.select().from(schema.generalSettings),
    ])

    const sidebar = sidebarData[0]
    const general = generalData[0]

    // Transform social media into key-value map
    const socialMediaMap = socialData.reduce<Record<string, string>>((acc, item) => {
      acc[item.platform] = item.url
      return acc
    }, {})

    const response: SidebarResponse = {
      profile_image: sidebar?.profileImageUrl ?? null,
      profile_image_alt: sidebar?.profileImageAlt ?? null,
      profile_title: sidebar?.profileTitle ?? null,
      social_media: socialMediaMap,
      portfolio_title: general?.portfolioTitle ?? null,
      portfolio_overlay_title: general?.portfolioOverlayTitle ?? null,
    }

    return NextResponse.json({
      data: response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error fetching sidebar:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch sidebar data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}