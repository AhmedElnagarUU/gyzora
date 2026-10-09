import mongoose, { Schema, type Document, type Types } from 'mongoose'

export type TrackingProvider = 'meta-pixel' | 'google-analytics' | 'custom'

export interface ITracker {
  _id: Types.ObjectId
  provider: TrackingProvider
  name: string
  pixelId?: string
  trackingId?: string
  scriptUrl?: string
  enabled: boolean
}

export interface ITrackingConfig extends Document {
  tenantId: Types.ObjectId
  siteId?: Types.ObjectId
  trackers: ITracker[]
  createdAt: Date
  updatedAt: Date
}

const TrackerSchema = new Schema<ITracker>(
  {
    provider: {
      type: String,
      enum: ['meta-pixel', 'google-analytics', 'custom'],
      required: true,
    },
    name: { type: String, required: true, trim: true },
    pixelId: { type: String },
    trackingId: { type: String },
    scriptUrl: { type: String },
    enabled: { type: Boolean, default: true },
  },
  { _id: true }
)

const trackingConfigSchema = new Schema<ITrackingConfig>(
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
    trackers: [TrackerSchema],
  },
  {
    timestamps: true,
    collection: 'tracking_configs',
  }
)

export const TrackingConfig =
  mongoose.models.TrackingConfig ||
  mongoose.model<ITrackingConfig>('TrackingConfig', trackingConfigSchema)
