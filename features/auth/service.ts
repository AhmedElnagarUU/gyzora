import mongoose from 'mongoose'
import { connectToDatabase } from '@/shared/lib/db/mongoose'

/**
 * Update a Better Auth user's custom fields (role, tenantId).
 *
 * Better Auth's MongoDB adapter stores users in the `user` collection
 * with an ObjectId `_id`, so we update the document directly.
 * Used by auth hooks and admin operations.
 */
export async function updateUser(
  userId: string,
  data: { role?: string; tenantId?: string }
) {
  await connectToDatabase()

  const db = mongoose.connection.db
  if (!db) {
    throw new Error('MongoDB connection is not established')
  }

  const updates: Record<string, string> = {}
  if (data.role !== undefined) updates.role = data.role
  if (data.tenantId !== undefined) updates.tenantId = data.tenantId

  if (Object.keys(updates).length === 0) {
    throw new Error('No fields to update')
  }

  const result = await db
    .collection('user')
    .updateOne({ _id: new mongoose.Types.ObjectId(userId) }, { $set: updates })

  if (result.matchedCount === 0) {
    throw new Error('User not found')
  }

  return { success: true, modified: result.modifiedCount === 1 }
}

export interface AuthUserSummary {
  id: string
  name?: string
  email: string
  role: string
  tenantId?: string
  createdAt?: string
}

/**
 * Owner console: list Better Auth users (cross-tenant, explicit owner
 * function). Uses the `user` collection owned by the auth adapter.
 */
export async function listAuthUsersForOwner(
  role?: string
): Promise<AuthUserSummary[]> {
  await connectToDatabase()

  const db = mongoose.connection.db
  if (!db) {
    throw new Error('MongoDB connection is not established')
  }

  const filter: Record<string, unknown> = {}
  if (role) filter.role = role

  const users = await db
    .collection('user')
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray()

  return users.map((u) => ({
    id: String(u._id),
    name: typeof u.name === 'string' ? u.name : undefined,
    email: typeof u.email === 'string' ? u.email : '',
    role: typeof u.role === 'string' ? u.role : 'CUSTOMER',
    tenantId: typeof u.tenantId === 'string' ? u.tenantId : undefined,
    createdAt:
      u.createdAt instanceof Date
        ? u.createdAt.toISOString()
        : typeof u.createdAt === 'string'
          ? u.createdAt
          : undefined,
  }))
}

/** Owner console: total Better Auth user count. */
export async function countAuthUsersForOwner(): Promise<number> {
  await connectToDatabase()

  const db = mongoose.connection.db
  if (!db) {
    throw new Error('MongoDB connection is not established')
  }

  return db.collection('user').countDocuments({})
}
