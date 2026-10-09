import { type NextRequest, NextResponse } from 'next/server'
import { Tenant } from '@/features/tenants/model'
import { User } from '@/features/auth/model'
import { requireRole } from '@/shared/lib/auth/session'

export async function GET(req: NextRequest) {
  try {
    const ctx = await requireRole(req.headers as Headers, 'OWNER')
    const url = new URL(req.url)
    const action = url.searchParams.get('action')
    const id = url.searchParams.get('id')

    // Tenant management
    if (action === 'get-tenant' && id) {
      const tenant = await Tenant.findById(id).lean()
      return NextResponse.json(tenant)
    }

    if (action === 'activate' && id) {
      await Tenant.findByIdAndUpdate(id, { status: 'ACTIVE' })
      return NextResponse.json({ success: true })
    }

    if (action === 'suspend' && id) {
      await Tenant.findByIdAndUpdate(id, { status: 'SUSPENDED' })
      return NextResponse.json({ success: true })
    }

    // Default: list all tenants
    const tenants = await Tenant.find({})
      .sort({ createdAt: -1 })
      .lean()

    // Also fetch user count per tenant
    const users = await User.find({ role: 'CUSTOMER' }).lean()
    const userCount = users.length

    return NextResponse.json({
      tenants,
      totalTenants: tenants.length,
      totalUsers: userCount,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error'
    const status = msg.includes('UNAUTHORIZED') ? 401 : 500
    if (msg.includes('FORBIDDEN')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: msg }, { status })
  }
}
