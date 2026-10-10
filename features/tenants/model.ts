import mongoose, { Schema, type Document, type Types } from 'mongoose'

export interface ITenant extends Document {
  _id: Types.ObjectId
  name: string
  slug: string
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED'
  createdAt: Date
  updatedAt: Date
}

export const tenantSchema = new Schema<ITenant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ['FREE', 'PRO', 'ENTERPRISE'],
      default: 'FREE',
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'DELETED'],
      default: 'ACTIVE',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'tenants',
  }
)

export const Tenant =
  mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', tenantSchema)
