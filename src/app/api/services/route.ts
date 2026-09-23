import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import type { ApiResponse, ServicesResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<ServicesResponse>>> {
  try {
    const [servicesData, itemsData] = await Promise.all([
      db.select().from(schema.servicesSection),
      db.select().from(schema.serviceItems).orderBy(asc(schema.serviceItems.sortOrder)),
    ])

    const services = servicesData[0]

    const response: ServicesResponse = {
      title: services?.title ?? null,
      overlay_title: services?.overlayTitle ?? null,
      items: itemsData.map((item) => ({
        title: item.title,
        content: item.content ?? null,
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