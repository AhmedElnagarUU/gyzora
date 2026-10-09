import { type NextRequest, NextResponse } from 'next/server'
import {
  findTrackingByTenant,
  upsertTrackingConfig,
} from '@/features/tracking/repository'
import { getTenantContext } from '@/shared/lib/auth/session'

export async function GET(req: NextRequest) {
  try {
    const ctx = await getTenantContext(req.headers as Headers)
    if (!ctx) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const config = await findTrackingByTenant(ctx.tenantId)
    return NextResponse.json(config || { trackers: [] })
  } catch (error) {
    console.error('GET /api/tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const ctx = await getTenantContext(req.headers as Headers)
    if (!ctx) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const config = await upsertTrackingConfig(ctx.tenantId, body)
    return NextResponse.json(config)
  } catch (error) {
    console.error('POST /api/tracking error:', error)
    const msg = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: msg }, { status: 500 }
  }
}
