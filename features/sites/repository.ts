import { connectToDatabase } from '@/shared/lib/db/mongoose'
import { Site } from '@/features/sites/model'

export async function createSiteRecord(data: {
  tenantId: string
  name: string
  slug: string
  template: string
  theme: string
  status: 'DRAFT' | 'PUBLISHED'
}) {
  await connectToDatabase()
  return Site.create(data)
}

export async function findSiteById(id: string) {
  await connectToDatabase()
  return Site.findById(id).lean()
}

export async function findSitesByTenantId(tenantId: string) {
  await connectToDatabase()
  return Site.find({ tenantId }).sort({ createdAt: -1 }).lean()
}

export async function findSiteByTenantAndSlug(tenantId: string, slug: string) {
  await connectToDatabase()
  return Site.findOne({ tenantId, slug: slug.toLowerCase() }).lean()
}

export async function findPublishedSiteBySlug(slug: string) {
  await connectToDatabase()
  return Site.findOne({
    slug: slug.toLowerCase(),
    status: 'PUBLISHED',
  }).lean()
}

export async function updateSiteByIdAndTenant(
  id: string,
  tenantId: string,
  data: Partial<{
    name: string
    slug: string
    template: string
    theme: string
    status: 'DRAFT' | 'PUBLISHED'
  }>
) {
  await connectToDatabase()
  return Site.findOneAndUpdate(
    { _id: id, tenantId },
    { $set: data },
    { new: true }
  ).lean()
}
