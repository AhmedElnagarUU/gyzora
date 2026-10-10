import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/shared/lib/auth/session'
import { findSiteByTenantAndSlug } from '@/features/sites/repository'
import { createSite, updateSite } from '@/features/sites/service'
import { createSiteSchema } from '@/features/sites/schema'
import { getSitesByTenant } from '@/features/sites/service'

function errorStatus(message: string): number {
  if (message === 'UNAUTHORIZED') return 401
  if (message === 'FORBIDDEN') return 403
  if (message === 'SLUG_TAKEN') return 409
  return 500
}

export async function GET(req: NextRequest) {
  try {
    const ctx = await requireSession(req.headers)
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (slug) {
      const site = await findSiteByTenantAndSlug(ctx.tenantId, slug)
      if (!site) {
        return NextResponse.json(
          { success: false, error: 'Site not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: site })
    }

    const sites = await getSitesByTenant(ctx.tenantId)
    return NextResponse.json({ success: true, data: sites })
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
    const status = errorStatus(message)
    const friendly =
      message === 'SLUG_TAKEN' ? 'That slug is already in use' : message
    return NextResponse.json({ success: false, error: friendly }, { status })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const ctx = await requireSession(req.headers)
    const body: unknown = await req.json().catch(() => ({}))
    const { id, ...input } = (body ?? {}) as Record<string, unknown>

    if (typeof id !== 'string' || !id) {
      return NextResponse.json(
        { success: false, error: 'Site id is required' },
        { status: 400 }
      )
    }

    const site = await updateSite(id, ctx.tenantId, input)
    if (!site) {
      return NextResponse.json(
        { success: false, error: 'Site not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: site })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = errorStatus(message)
    const friendly =
      message === 'SLUG_TAKEN' ? 'That slug is already in use' : message
    return NextResponse.json({ success: false, error: friendly }, { status })
  }
}
