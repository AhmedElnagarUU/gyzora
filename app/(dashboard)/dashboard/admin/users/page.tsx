'use client'

import { useEffect, useState } from 'react'
import { DashboardShell } from '@/features/dashboard/components/DashboardShell'
import { Button } from '@/shared/ui'
import { Users, Shield, Edit, Trash2 } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  tenantId?: string
  createdAt: string
}

interface UsersResponse {
  users: User[]
  total: number
}

export default function UsersListPage() {
  const [data, setData] = useState<UsersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
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
    fetchUsers()
  }, [])

  if (loading) return <DashboardShell><p className="p-6">Loading...</p></DashboardShell>
  if (error) return <DashboardShell><p className="p-6 text-red-600">{error}</p></DashboardShell>
  if (!data) return <DashboardShell><p className="p-6">No data</p></DashboardShell>

  return (
    <DashboardShell>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500 mt-1">
              {data.total} users on Gzora
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>{data.total} total</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Email
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Role
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Tenant
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'OWNER'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      <Shield className="h-3 w-3" />
                      {user.role}
                    </td>
                  </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {user.tenantId
                      ? user.tenantId.slice(-6)
                      : '—'}
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  )
}
