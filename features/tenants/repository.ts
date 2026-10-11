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

/** Owner console: list every tenant (cross-tenant, explicit owner function). */
export async function findAllTenantsForOwner() {
  await connectToDatabase()
  return Tenant.find({}).sort({ createdAt: -1 }).lean()
}

/** Owner console: update a tenant's lifecycle status. */
export async function updateTenantStatusById(
  id: string,
  status: 'ACTIVE' | 'SUSPENDED'
) {
  await connectToDatabase()
  return Tenant.findByIdAndUpdate(id, { status }, { new: true }).lean()
}
