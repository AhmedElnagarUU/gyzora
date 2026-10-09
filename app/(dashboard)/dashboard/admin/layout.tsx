import { DashboardShell } from '@/features/dashboard/components/DashboardShell'
import { requireRole } from '@/shared/lib/auth/session'
import { headers } from 'next/headers'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ctx = await requireRole(await headers(), 'OWNER')
  return <DashboardShell>{children}</DashboardShell>
}
