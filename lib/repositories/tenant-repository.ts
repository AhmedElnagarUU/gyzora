import { Tenant } from '@/models/Tenant'

export async function findTenantById(id: string) {
  return Tenant.findById(id).lean()
}

export async function findTenantBySlug(slug: string) {
  return Tenant.findOne({ slug: slug.toLowerCase() }).lean()
}
