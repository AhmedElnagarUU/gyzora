import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">New Project</h1>
          <p className="mt-2 text-sm text-gray-600">
            Add a new project to your site
          </p>
        </div>

        <div className="rounded-lg bg-white py-12 text-center shadow-sm">
          <p className="text-gray-500">
            Project creation form is coming soon.
          </p>
          <Link
            href="/dashboard/projects"
            className="mt-4 inline-block text-sm text-primary-600 hover:text-primary-900"
          >
            ← Back to Projects
          </Link>
        </div>
      </div>
    )
}
