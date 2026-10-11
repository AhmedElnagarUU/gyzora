import { countAuthUsersForOwner, listAuthUsersForOwner } from '@/features/auth/service'
import { countPublishedProjectsForOwner } from '@/features/projects/service'
import { countPublishedSitesForOwner } from '@/features/sites/service'
import {
  getTenantByIdForOwner,
  listTenantsForOwner,
  setTenantStatusForOwner,
} from '@/features/tenants/service'

/**
 * Platform-owner console. The admin feature owns no model of its own; it
 * composes owner-named functions exposed by the domain features
 * (`CODE_RULES.md` §1/§5) and never reads their models directly.
 */

export interface RecentTenant {
  _id: string
  name: string
  slug: string
  plan: string
  status: string
  createdAt: Date
}

export interface PlatformAnalytics {
  totalTenants: number
  totalSites: number
  totalProjects: number
  totalUsers: number
  planDistribution: Record<string, number>
  statusDistribution: Record<string, number>
  recentTenants: RecentTenant[]
}

export async function getPlatformAnalytics(): Promise<PlatformAnalytics> {
  const [tenants, totalSites, totalProjects, totalUsers] = await Promise.all([
    listTenantsForOwner(),
    countPublishedSitesForOwner(),
    countPublishedProjectsForOwner(),
    countAuthUsersForOwner(),
  ])

  const planDistribution: Record<string, number> = {}
  const statusDistribution: Record<string, number> = {}

  for (const tenant of tenants) {
    planDistribution[tenant.plan] = (planDistribution[tenant.plan] || 0) + 1
    statusDistribution[tenant.status] =
      (statusDistribution[tenant.status] || 0) + 1
  }

  // `listTenantsForOwner` already sorts newest-first.
  const recentTenants: RecentTenant[] = tenants.slice(0, 5).map((tenant) => ({
    _id: tenant._id.toString(),
    name: tenant.name,
    slug: tenant.slug,
    plan: tenant.plan,
    status: tenant.status,
    createdAt: tenant.createdAt,
  }))

  return {
    totalTenants: tenants.length,
    totalSites,
    totalProjects,
    totalUsers,
    planDistribution,
    statusDistribution,
    recentTenants,
  }
}

export async function listTenantsOverview() {
  const [tenants, totalUsers] = await Promise.all([
    listTenantsForOwner(),
    countAuthUsersForOwner(),
  ])

  return { tenants, totalTenants: tenants.length, totalUsers }
}

export async function getTenantDetailsForOwner(id: string) {
  return getTenantByIdForOwner(id)
}

export async function setTenantStatus(
  id: string,
  action: 'activate' | 'suspend'
) {
  const status = action === 'activate' ? 'ACTIVE' : 'SUSPENDED'
  return setTenantStatusForOwner(id, status)
}

export async function listUsersOverview(role?: 'CUSTOMER' | 'OWNER') {
  const users = await listAuthUsersForOwner(role)
  return { users, total: users.length }
}
