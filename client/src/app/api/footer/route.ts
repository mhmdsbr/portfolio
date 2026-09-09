import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { NextResponse } from 'next/server'
import type { ApiResponse, FooterResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse<ApiResponse<FooterResponse>>> {
  try {
    const [footerData] = await db.select().from(schema.footerSection)

    const response: FooterResponse = {
      companyName: footerData?.companyName ?? null,
      privacyPolicy: footerData?.privacyPolicy ?? null,
      termsOfService: footerData?.termsOfService ?? null,
      copyrightText: footerData?.copyrightText ?? null,
    }

    return NextResponse.json({
      data: response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error fetching footer:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch footer data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}