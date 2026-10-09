import { NextResponse } from 'next/server'
import { getPublicTestimonials } from '@/server/services/public-content'
import type { ApiResponse, TestimonialsResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<TestimonialsResponse>>> {
  try {
    const data = await getPublicTestimonials()
    return NextResponse.json({
      data,
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
