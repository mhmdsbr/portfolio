import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import type { ApiResponse, TestimonialsResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<TestimonialsResponse>>> {
  try {
    const [testimonialsData, itemsData] = await Promise.all([
      db.select().from(schema.testimonialsSection),
      db.select().from(schema.testimonialItems).orderBy(asc(schema.testimonialItems.sortOrder)),
    ])

    const testimonials = testimonialsData[0]

    const response: TestimonialsResponse = {
      title: testimonials?.title ?? null,
      overlay_title: testimonials?.overlayTitle ?? null,
      items: itemsData.map((item) => ({
        image: item.imageUrl ?? null,
        title: item.title,
        subtitle: item.subtitle ?? null,
        rating: item.rating ?? null,
        content: item.content ?? null,
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