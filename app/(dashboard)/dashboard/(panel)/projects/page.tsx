import { DashboardShell } from '@/features/dashboard/components/DashboardShell'
import { Button } from '@/shared/ui'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function ProjectsListPage() {
  return (
    <DashboardShell>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          New Project
        </Link>
      </div>

      <div className="rounded-lg bg-white py-12 text-center shadow-sm">
        <p className="text-gray-500">
          No projects yet. Create your first project to showcase your work.
        </p>
      </div>
    </DashboardShell>
  )
}
