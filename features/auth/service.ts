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
