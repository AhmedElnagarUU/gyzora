import { type NextRequest, NextResponse } from 'next/server'
import { getTenantContext } from '@/shared/lib/auth/session'

export async function GET(req: NextRequest) {
  const ctx = await getTenantContext(req.headers as Headers)
  if (!ctx) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
  return NextResponse.json({
    user: {
      id: ctx.userId,
      role: ctx.role,
      tenantId: ctx.tenantId,
    },
  })
}
