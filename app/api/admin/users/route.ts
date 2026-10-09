import { type NextRequest, NextResponse } from 'next/server'
import { User } from '@/features/auth/model'
import { requireRole } from '@/shared/lib/auth/session'

export async function GET(req: NextRequest) {
  try {
    const ctx = await requireRole(req.headers as Headers, 'OWNER')

    const url = new URL(req.url)
    const role = url.searchParams.get('role')

    const filter: Record<string, unknown> = {}
    if (role) {
      filter.role = role
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      users: users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        tenantId: u.tenantId,
        createdAt: u.createdAt,
      })),
      total: users.length,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error'
    if (msg.includes('FORBIDDEN')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (msg.includes('UNAUTHORIZED')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
