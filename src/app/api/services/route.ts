import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import type { ApiResponse, ServicesResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<ServicesResponse>>> {
  try {
    const [sectionData, itemsData] = await Promise.all([
      db.select().from(schema.pageSections).where(eq(schema.pageSections.sectionKey, 'services')),
      db.select().from(schema.services).orderBy(
        asc(schema.services.sortOrder),
        asc(schema.services.id),
      ),
    ])

    const response: ServicesResponse = {
      title: sectionData[0]?.title ?? null,
      items: itemsData.map((item) => ({
        title: item.title,
        description: item.description ?? null,
        icon: item.icon ?? null,
      })),
    }

    return NextResponse.json({
      data: response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error fetching services:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch services data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}