import mongoose, { Schema, type Document, type Types } from 'mongoose'
import { connectToDatabase } from '@/shared/lib/db/mongoose'

void connectToDatabase().catch((err) =>
  console.error('MongoDB connection failed:', err)
)

export interface IMedia extends Document {
  _id: Types.ObjectId
  tenantId: Types.ObjectId
  key: string
  url: string
  size: number
  mimeType: string
  createdAt: Date
  updatedAt: Date
}

export const mediaSchema = new Schema<IMedia>(
  {
    tenantId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
      enum: [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/webp',
      ],
    },
  },
  {
    timestamps: true,
    collection: 'media',
  }
)

mediaSchema.index({ tenantId: 1, key: 1 }, { unique: true })

export const Media =
  mongoose.models.Media || mongoose.model<IMedia>('Media', mediaSchema)
