import { connectToDatabase } from '@/shared/lib/db/mongoose'
import { Tenant } from '@/features/tenants/model'

export async function findTenantById(id: string) {
  await connectToDatabase()
  return Tenant.findById(id).lean()
}

export async function findTenantBySlug(slug: string) {
  await connectToDatabase()
  return Tenant.findOne({ slug: slug.toLowerCase() }).lean()
}
