
export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  return (
    <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your site configuration and preferences
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">
              Site Configuration
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Update your site name, slug, and template settings.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">
              Theme Preferences
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Switch between Light, Dark, and Brand themes.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">
              Publishing Options
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Manage draft/published status and CDN settings.
            </p>
          </div>
        </div>
      </div>
    )
}
