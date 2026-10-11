import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/shared/lib/auth/session'
import {
  getPlatformAnalytics,
  getTenantDetailsForOwner,
  listTenantsOverview,
  listUsersOverview,
  setTenantStatus,
} from '@/features/admin/service'
import {
  listUsersQuerySchema,
  tenantStatusActionSchema,
} from '@/features/admin/schema'

function errorStatus(message: string): number {
  if (message === 'UNAUTHORIZED') return 401
  if (message === 'FORBIDDEN') return 403
  return 500
}

export async function getAnalytics(req: NextRequest) {
  try {
    await requireRole(req.headers, 'OWNER')
    const data = await getPlatformAnalytics()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { success: false, error: message },
      { status: errorStatus(message) }
    )
  }
}

export async function getTenants(req: NextRequest) {
  try {
    await requireRole(req.headers, 'OWNER')
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const tenant = await getTenantDetailsForOwner(id)
      if (!tenant) {
        return NextResponse.json(
          { success: false, error: 'Tenant not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: tenant })
    }

    const data = await listTenantsOverview()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { success: false, error: message },
      { status: errorStatus(message) }
    )
  }
}

export async function updateTenantStatus(req: NextRequest) {
  try {
    await requireRole(req.headers, 'OWNER')
    const body: unknown = await req.json().catch(() => ({}))
    const result = tenantStatusActionSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.message },
        { status: 400 }
      )
    }

    const tenant = await setTenantStatus(result.data.id, result.data.action)
    if (!tenant) {
      return NextResponse.json(
        { success: false, error: 'Tenant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: tenant })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { success: false, error: message },
      { status: errorStatus(message) }
    )
  }
}

export async function getUsers(req: NextRequest) {
  try {
    await requireRole(req.headers, 'OWNER')
    const { searchParams } = new URL(req.url)
    const parsed = listUsersQuerySchema.safeParse({
      role: searchParams.get('role') ?? undefined,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.message },
        { status: 400 }
      )
    }

    const data = await listUsersOverview(parsed.data.role)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { success: false, error: message },
      { status: errorStatus(message) }
    )
  }
}
