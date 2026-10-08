import { DashboardShell } from '@/features/dashboard/components/DashboardShell'
import { Button } from '@/shared/ui'

export const dynamic = 'force-dynamic'

export default function MediaLibraryPage() {
  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your uploaded images and files
        </p>
      </div>

      <div className="rounded-lg bg-white py-12 text-center shadow-sm">
        <p className="text-gray-500">
          No media files uploaded yet. Use the upload button to get started.
        </p>
        <div className="mt-4">
          <Button>Upload Media</Button>
        </div>
      </div>
    </DashboardShell>
  )
}
