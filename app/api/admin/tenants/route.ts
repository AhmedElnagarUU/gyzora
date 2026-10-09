import { type NextRequest, NextResponse } from 'next/server'
import { Tenant } from '@/features/tenants/model'
import { connectToDatabase } from '@/shared/lib/db/mongoose'
import { requireRole } from '@/shared/lib/auth/session'
import mongoose from 'mongoose'

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

    // Count users via Better Auth's 'user' collection
    await connectToDatabase()
    const db = mongoose.connection.db
    if (!db) throw new Error('MongoDB connection not established')
    const userCount = await db.collection('user').countDocuments({})

    return NextResponse.json({
      tenants,
      totalTenants: tenants.length,
      totalUsers: userCount,
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
