import { type NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/shared/lib/db/mongoose'
import { requireRole } from '@/shared/lib/auth/session'
import mongoose from 'mongoose'

export async function GET(req: NextRequest) {
  try {
    const ctx = await requireRole(req.headers as Headers, 'OWNER')
    const url = new URL(req.url)
    const role = url.searchParams.get('role')

    const filter: Record<string, unknown> = {}
    if (role) {
      filter.role = role
    }

    await connectToDatabase()
    const db = mongoose.connection.db
    if (!db) throw new Error('MongoDB connection not established')

    const query = db.collection('user').find(filter).sort({ createdAt: -1 })
    const users = await query.toArray()

    return NextResponse.json({
      users: users.map((u) => ({
        id: String(u._id),
        name: u.name,
        email: u.email,
        role: u.role || 'CUSTOMER',
        tenantId: u.tenantId,
        createdAt: u.createdAt || u._id?.getTimestamp(),
      })),
      total: users.length,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error'
    if (msg.includes('UNAUTHORIZED')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (msg.includes('FORBIDDEN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
