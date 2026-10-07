import { Site } from '@/features/sites/model'

export async function findSiteById(id: string) {
  return Site.findById(id).lean()
}

export async function findSitesByTenantId(tenantId: string) {
  return Site.find({ tenantId }).lean()
}

export async function findSiteByTenantAndSlug(tenantId: string, slug: string) {
  return Site.findOne({ tenantId, slug: slug.toLowerCase() }).lean()
}
