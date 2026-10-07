import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/shared/lib/auth/session'
import {
  findSitesByTenantId,
  findSiteByTenantAndSlug,
} from '@/features/sites/repository'
import { createSite } from '@/features/sites/service'
import { createSiteSchema } from '@/features/sites/schema'

export async function GET(req: NextRequest) {
  try {
    const ctx = await requireSession(req.headers)
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (slug) {
      // Tenant-scoped lookup
      const site = await findSiteByTenantAndSlug(ctx.tenantId, slug)
      if (!site) {
        return NextResponse.json(
          { success: false, error: 'Site not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: site })
    }

    // List all sites for this tenant
    const sites = await findSitesByTenantId(ctx.tenantId)
    return NextResponse.json({ success: true, data: sites })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ success: false, error: message }, { status })
  }
}

export async function POST(req: NextRequest) {
  try {
    const ctx = await requireSession(req.headers)
    const body: unknown = await req.json().catch(() => ({}))
    const result = createSiteSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.message },
        { status: 400 }
      )
    }

    const site = await createSite({ ...result.data, tenantId: ctx.tenantId })
    return NextResponse.json({ success: true, data: site }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ success: false, error: message }, { status })
  }
}
