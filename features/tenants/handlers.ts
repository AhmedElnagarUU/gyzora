import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireSession, requireRole } from '@/shared/lib/auth/session'
import { findTenantById } from '@/features/tenants/repository'
import { createTenantWithSite } from '@/features/tenants/service'
import { createTenantSchema } from '@/features/tenants/schema'

const routeContextSchema = z.object({
  id: z.string(),
})

export async function GET(req: NextRequest) {
  try {
    const ctx = await requireSession(req.headers)
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const result = routeContextSchema.safeParse({ id })
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: 'Invalid id' },
          { status: 400 }
        )
      }
      const tenant = await findTenantById(result.data.id)
      if (!tenant) {
        return NextResponse.json(
          { success: false, error: 'Tenant not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: tenant })
    }

    // Owner-only: list tenants
    await requireRole(req.headers, 'OWNER')
    // Owner can read all; CUSTOMER reads own tenant
    const tenant = await findTenantById(ctx.tenantId)
    return NextResponse.json({ success: true, data: tenant })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status =
      message === 'UNAUTHORIZED' ? 401 : message === 'FORBIDDEN' ? 403 : 500
    return NextResponse.json(
      { success: false, error: message },
      { status }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // Only authenticated users (or platform owners) may create tenants.
    await requireRole(req.headers, 'OWNER')
    const body: unknown = await req.json().catch(() => ({}))
    const result = createTenantSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.message },
        { status: 400 }
      )
    }

    const { tenant } = await createTenantWithSite(result.data)
    return NextResponse.json({ success: true, data: tenant }, { status: 201 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
