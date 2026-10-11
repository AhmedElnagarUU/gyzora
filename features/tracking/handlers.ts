import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/shared/lib/auth/session'
import {
  getTrackingConfigForTenant,
  saveTrackingConfigForTenant,
} from '@/features/tracking/service'
import { upsertTrackingConfigSchema } from '@/features/tracking/schema'

function errorStatus(message: string): number {
  if (message === 'UNAUTHORIZED') return 401
  if (message === 'FORBIDDEN') return 403
  return 500
}

/**
 * Tracking is tenant-scoped, so a session without a bound tenant cannot be
 * served (mirrors `features/projects/handlers.ts` and `features/sites/handlers.ts`).
 */
async function requireTenantContext(req: NextRequest) {
  const ctx = await requireSession(req.headers)
  if (!ctx.tenantId) {
    throw new Error('FORBIDDEN')
  }
  return ctx
}

export async function GET(req: NextRequest) {
  try {
    const ctx = await requireTenantContext(req)
    const config = await getTrackingConfigForTenant(ctx.tenantId)
    return NextResponse.json({ success: true, data: config || { trackers: [] } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { success: false, error: message },
      { status: errorStatus(message) }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const ctx = await requireTenantContext(req)
    const body: unknown = await req.json().catch(() => ({}))
    const result = upsertTrackingConfigSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const config = await saveTrackingConfigForTenant(ctx.tenantId, result.data)
    return NextResponse.json({ success: true, data: config })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { success: false, error: message },
      { status: errorStatus(message) }
    )
  }
}
