import { getSites } from '@/features/sites/api-client'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  let sites = []
  let error = null
  try {
    sites = await getSites()
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load sites'
  }

  const publishedSites = sites.filter((s: any) => s.status === 'PUBLISHED')
  const draftSites = sites.filter((s: any) => s.status === 'DRAFT')

  const stats = [
    { label: 'Total Sites', value: sites.length },
    { label: 'Published', value: publishedSites.length },
    { label: 'Drafts', value: draftSites.length },
  ]

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <Link
          href="/dashboard/sites/new"
          className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          Create Site
        </Link>
      </div>

    {error && (
      <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
    )}

    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>

    <div className="rounded-lg bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-medium text-gray-900">Your Sites</h2>
      </div>
      {sites.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No sites found. Create your first site to get started.
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {sites.map((site: any) => (
            <div
              key={String(site._id || site.id)}
              className="flex items-center justify-between px-6 py-4"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium text-gray-900">{site.name}</p>
                  <p className="text-sm text-gray-500">Slug: {site.slug}</p>
                </div>
              </div>
              <span
                className={
                  site.status === 'PUBLISHED'
                    ? 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800'
                    : 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800'
                }
              >
                {site.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  )
}
