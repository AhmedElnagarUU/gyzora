import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getTenantContext } from '@/shared/lib/auth/session'
import { getSitesByTenant } from '@/features/sites/service'
import { SitePublishButton } from '@/features/sites/components/SitePublishButton'

export const dynamic = 'force-dynamic'

export default async function SitesListPage() {
  const ctx = await getTenantContext(await headers())
  if (!ctx) {
    redirect('/auth/signin')
  }

  let sites: Awaited<ReturnType<typeof getSitesByTenant>> = []
  let error: string | null = null

  try {
    sites = await getSitesByTenant(ctx.tenantId)
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load sites'
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sites</h1>
        <Link
          href="/dashboard/sites/new"
          className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          New Site
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {sites.length === 0 ? (
        <div className="rounded-lg bg-white py-12 text-center shadow-sm">
          <p className="text-gray-500">No sites found. Create your first site.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Theme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sites.map((site) => (
                <tr key={String(site._id)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {site.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {site.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {site.template}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {site.theme}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={
                        site.status === 'PUBLISHED'
                          ? 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800'
                          : 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800'
                      }
                    >
                      {site.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      {site.status === 'PUBLISHED' && (
                        <Link
                          href={`/s/${site.slug}`}
                          target="_blank"
                          className="text-primary-600 hover:text-primary-500"
                        >
                          View
                        </Link>
                      )}
                      <SitePublishButton
                        id={String(site._id)}
                        status={site.status}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
