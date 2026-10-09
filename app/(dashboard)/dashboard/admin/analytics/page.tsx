'use client'

import { useEffect, useState } from 'react'
import { BarChart3, Building, FileText, Layout } from 'lucide-react'

interface AnalyticsData {
  totalTenants: number
  totalSites: number
  totalProjects: number
  totalUsers: number
  planDistribution: Record<string, number>
  statusDistribution: Record<string, number>
  recentTenants: Array<{
    _id: string
    name: string
    slug: string
    plan: string
    status: string
    createdAt: string
  }>
}

export const dynamic = 'force-dynamic'

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/analytics')
      if (!res.ok) {
        if (res.status === 401) throw new Error('Authentication required')
        if (res.status === 403) throw new Error('Owner access required')
        throw new Error('Failed to fetch')
      }
      const result = await res.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading) return <p className="p-6">Loading...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>
  if (!data) return <p className="p-6">No data</p>

  const statCards = [
    { icon: Building, label: 'Tenants', value: data.totalTenants, color: 'bg-blue-100 text-blue-600' },
    { icon: Layout, label: 'Published Sites', value: data.totalSites, color: 'bg-green-100 text-green-600' },
    { icon: FileText, label: 'Published Projects', value: data.totalProjects, color: 'bg-purple-100 text-purple-600' },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Platform Analytics
      </h1>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="border border-gray-200 rounded-xl p-4 flex items-center gap-4"
          >
            <div className={`p-2 rounded-lg ${card.color}`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {card.value}
              </p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 mb-8">
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3">
            Tenants by Plan
          </h3>
          <div className="space-y-2">
            {Object.entries(data.planDistribution).map(([plan, count]) => (
              <div
                key={plan}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-600">{plan}</span>
                <span className="font-medium text-gray-900">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3">
            Tenants by Status
          </h3>
          <div className="space-y-2">
            {Object.entries(data.statusDistribution).map(([status, count]) => (
              <div
                key={status}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-600">{status}</span>
                <span className="font-medium text-gray-900">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-3">
          Recently Created Tenants
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-gray-700">Name</th>
                <th className="text-left py-2 text-gray-700">Slug</th>
                <th className="text-left py-2 text-gray-700">Plan</th>
                <th className="text-left py-2 text-gray-700">Status</th>
                <th className="text-left py-2 text-gray-700">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.recentTenants.map((tenant) => (
                <tr
                  key={tenant._id}
                  className="border-b border-gray-100"
                >
                  <td className="py-2 text-gray-900">{tenant.name}</td>
                  <td className="py-2 text-gray-600">{tenant.slug}</td>
                  <td className="py-2">{tenant.plan}</td>
                  <td className="py-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        tenant.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </td>
                  <td className="py-2 text-gray-500">
                    {new Date(tenant.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
