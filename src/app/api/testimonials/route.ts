import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import type { ApiResponse, TestimonialsResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<TestimonialsResponse>>> {
  try {
    const [sectionData, itemsData] = await Promise.all([
      db.select().from(schema.pageSections).where(eq(schema.pageSections.sectionKey, 'testimonials')),
      db.select().from(schema.testimonials).orderBy(
        asc(schema.testimonials.sortOrder),
        asc(schema.testimonials.id),
      ),
    ])

    const response: TestimonialsResponse = {
      title: sectionData[0]?.title ?? null,
      overlay_title: sectionData[0]?.overlayTitle ?? null,
      items: itemsData.map((item) => ({
        image: item.imageUrl ?? null,
        title: item.title,
        subtitle: item.subtitle ?? null,
        rating: item.rating ?? null,
        body: item.body ?? null,
      })),
    }

    return NextResponse.json({
      data: response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error fetching testimonials:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch testimonials data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}