import mongoose, { Schema, type Document, type Types } from 'mongoose'
import { connectToDatabase } from '@/shared/lib/db/mongoose'

// Ensure the shared MongoDB connection is established before model queries run.
void connectToDatabase().catch((err) =>
  console.error('MongoDB connection failed:', err)
)

/**
 * User roles in the system.
 * - CUSTOMER: Regular user who manages their own tenant's sites
 * - OWNER: Platform owner with access to all tenants
 */
export type UserRole = 'CUSTOMER' | 'OWNER'

export interface IUser extends Document {
  _id: Types.ObjectId
  email: string
  name: string
  role: UserRole
  tenantId?: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['CUSTOMER', 'OWNER'],
      default: 'CUSTOMER',
      required: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
)

// Compound index for tenant-scoped user queries
userSchema.index({ tenantId: 1, email: 1 })

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)
