import { DashboardShell } from '@/features/dashboard/components/DashboardShell'
import { requireRole } from '@/shared/lib/auth/session'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    await requireRole(await headers(), 'OWNER')
  } catch (err) {
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('UNAUTHORIZED')) {
      redirect('/auth/signin')
    }
    // FORBIDDEN — redirect non-owners to the dashboard
    redirect('/dashboard')
  }
  return <DashboardShell>{children}</DashboardShell>
}
