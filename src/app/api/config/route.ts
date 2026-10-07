import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { NextResponse } from 'next/server'
import type { ApiResponse, ConfigResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<ConfigResponse>>> {
  try {
    const [configData] = await db.select().from(schema.appConfig)

    const response: ConfigResponse = {
      recaptcha_site_key: configData?.recaptchaSiteKey ?? null,
    }

    return NextResponse.json({
      data: response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error fetching config:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch config data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
