import SignOutButton from '@/components/auth/SignOutButton'

export default function OwnerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-gray-900">Gzora — Owner</h1>
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900">Owner Dashboard</h2>
        <p className="mt-2 text-gray-600">Manage all tenants and users across the platform.</p>
      </main>
    </div>
  )
}