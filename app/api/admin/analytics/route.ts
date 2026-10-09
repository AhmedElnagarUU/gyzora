import { type NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/shared/lib/auth/session'
import { Tenant } from '@/features/tenants/model'
import { Site } from '@/features/sites/model'

export async function GET(req: NextRequest) {
  try {
    await requireRole(req.headers as Headers, 'OWNER')

    const TenantModel = Tenant
    const SiteModel = Site
    const Project = (await import('@/features/projects/model')).Project

    const [tenants, sites, projects, users] = await Promise.all([
      TenantModel.find({}).lean(),
      SiteModel.find({ status: 'PUBLISHED' }).lean(),
      Project.find({ status: 'PUBLISHED' }).lean(),
      (await import('@/features/auth/auth-client')).getAuth().then((auth) =>
        // Better Auth stores users in the 'user' collection
        auth.adapter?.findMany?.('user').catch(() => [])
      ).catch(() => {
        // Fallback: count directly via mongoose
        return []
      }),
    ])

    const planCounts = tenants.reduce(
      (acc: Record<string, number>, t: any) => {
        acc[t.plan] = (acc[t.plan] || 0) + 1
        return acc
      },
      {}
    )

    const statusCounts = tenants.reduce(
      (acc: Record<string, number>, t: any) => {
        acc[t.status] = (acc[t.status] || 0) + 1
        return acc
      },
      {}
    )

    return NextResponse.json({
      totalTenants: tenants.length,
      totalSites: sites.length,
      totalProjects: projects.length,
      planDistribution: planCounts,
      statusDistribution: statusCounts,
      recentTenants: tenants
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .map((t: any) => ({
          _id: t._id.toString(),
          name: t.name,
          slug: t.slug,
          plan: t.plan,
          status: t.status,
          createdAt: t.createdAt,
        })),
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error'
    if (msg.includes('UNAUTHORIZED')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (msg.includes('FORBIDDEN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
