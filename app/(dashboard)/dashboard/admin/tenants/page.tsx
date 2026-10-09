'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/shared/ui'
import { Building, PauseCircle, PlayCircle } from 'lucide-react'

interface Tenant {
  _id: string
  name: string
  slug: string
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED'
  createdAt: string
  updatedAt: string
}

interface TenantsResponse {
  tenants: Tenant[]
  totalTenants: number
  totalUsers: number
}

export const dynamic = 'force-dynamic'

export default function TenantsListPage() {
  const [data, setData] = useState<TenantsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchTenants = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/tenants')
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
    fetchTenants()
  }, [])

  const toggleStatus = async (id: string, current: string) => {
    setActionLoading(id)
    const newStatus = current === 'ACTIVE' ? 'suspend' : 'activate'
    try {
      const res = await fetch(
        `/api/admin/tenants?action=${newStatus}&id=${id}`,
        { method: 'GET', credentials: 'include' }
      )
      const result = await res.json()
      if (res.ok && result.success) {
        await fetchTenants()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <p className="p-6">Loading...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>
  if (!data) return <p className="p-6">No data</p>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
          <p className="text-sm text-gray-500 mt-1">
            {data.totalTenants} tenants • {data.totalUsers} users total
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Slug</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Plan</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.tenants.map((tenant) => (
              <tr key={tenant._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{tenant.name}</td>
                <td className="py-3 px-4 text-gray-600">{tenant.slug}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${tenant.plan === 'PRO' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'}`}>
                    {tenant.plan}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${tenant.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {tenant.status === 'ACTIVE' ? 'ACTIVE' : 'SUSPENDED'}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500">{new Date(tenant.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => toggleStatus(tenant._id, tenant.status)}
                    disabled={actionLoading === tenant._id}
                    className="p-1 rounded-lg hover:bg-gray-200"
                    title={tenant.status === 'ACTIVE' ? 'Suspend tenant' : 'Activate tenant'}
                  >
                    {tenant.status === 'ACTIVE' ? (
                      <PauseCircle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <PlayCircle className="h-4 w-4 text-green-600" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
