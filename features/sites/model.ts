import mongoose, { Schema, type Document, type Types } from 'mongoose'
import { connectToDatabase } from '@/shared/lib/db/mongoose'

// Ensure the shared MongoDB connection is established before model queries run.
void connectToDatabase().catch((err) =>
  console.error('MongoDB connection failed:', err)
)

export interface ISite extends Document {
  _id: Types.ObjectId
  tenantId: Types.ObjectId
  name: string
  slug: string
  template: string
  theme: string
  status: 'DRAFT' | 'PUBLISHED'
  createdAt: Date
  updatedAt: Date
}

export const siteSchema = new Schema<ISite>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    template: {
      type: String,
      required: true,
      default: 'real-estate',
    },
    theme: {
      type: String,
      required: true,
      default: 'light',
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED'],
      default: 'DRAFT',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'sites',
  }
)

// Compound index for tenant-scoped site lookups
siteSchema.index({ tenantId: 1, slug: 1 })

export const Site =
  mongoose.models.Site || mongoose.model<ISite>('Site', siteSchema)
