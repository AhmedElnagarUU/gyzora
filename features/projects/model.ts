import mongoose, { Schema, type Document, type Types } from 'mongoose'

export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface IProject extends Document {
  _id: Types.ObjectId
  tenantId: Types.ObjectId
  siteId?: Types.ObjectId
  title: string
  description: string
  slug: string
  category: string
  order: number
  status: ProjectStatus
  seoMetadata?: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
  }
  images?: Array<{
    key: string
    url: string
    alt?: string
    mimeType?: string
  }>
  createdAt: Date
  updatedAt: Date
}

export const projectSchema = new Schema<IProject>(
  {
    tenantId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    siteId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Site',
      required: false,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
      required: true,
    },
    seoMetadata: {
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }],
      ogImage: { type: String },
    },
    images: [
      {
        key: { type: String, required: true },
        url: { type: String, required: true },
        alt: { type: String },
        mimeType: { type: String },
      },
    ],
  },
  {
    timestamps: true,
    collection: 'projects',
  }
)

// Compound indexes for tenant-scoped queries
projectSchema.index({ tenantId: 1, order: 1 })
projectSchema.index({ tenantId: 1, status: 1 })
projectSchema.index({ tenantId: 1, slug: 1 }, { unique: true })

export const Project =
  mongoose.models.Project ||
  mongoose.model<IProject>('Project', projectSchema)
