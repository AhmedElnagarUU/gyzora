import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/shared/lib/auth/session'
import { getUserById } from '@/features/users/service'

export async function GET(req: NextRequest) {
  try {
    const ctx = await requireSession(req.headers)
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || ctx.userId

    const user = await getUserById(userId)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ success: false, error: message }, { status })
  }
}
