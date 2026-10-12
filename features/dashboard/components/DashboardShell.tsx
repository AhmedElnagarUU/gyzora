'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import SignOutButton from '@/features/auth/components/SignOutButton'
import { useSessionClient } from '@/shared/lib/auth/session-client'
import LanguageSwitcher from '@/shared/i18n/LanguageSwitcher'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  ownerOnly?: boolean
}

function NavLink({
  item,
  isActive,
  show,
}: {
  item: NavItem
  isActive: boolean
  show: boolean
}) {
  if (!show) return null
  return (
    <Link
      href={item.href}
      className={
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ' +
        (isActive
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')
      }
    >
      <span className="text-lg">{item.icon}</span>
      {item.label}
    </Link>
  )
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSessionClient()
  const t = useTranslations('dashboard.nav')

  const navItems: NavItem[] = [
    { href: '/dashboard', label: t('overview'), icon: '🏠' },
    { href: '/dashboard/sites', label: t('sites'), icon: '🌐' },
    { href: '/dashboard/projects', label: t('projects'), icon: '📁' },
    { href: '/dashboard/templates', label: t('templates'), icon: '🎨' },
    { href: '/dashboard/media', label: t('media'), icon: '🖼️' },
    { href: '/dashboard/settings', label: t('settings'), icon: '⚙️' },
    {
      href: '/dashboard/admin/analytics',
      label: t('analytics'),
      icon: '📊',
      ownerOnly: true,
    },
    {
      href: '/dashboard/admin/tenants',
      label: t('tenants'),
      icon: '🏢',
      ownerOnly: true,
    },
    {
      href: '/dashboard/admin/users',
      label: t('users'),
      icon: '👥',
      ownerOnly: true,
    },
  ]

  // Check if the current path is under a parent nav item (for nested routes)
  const isActive = (href: string): boolean => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  // Owner-only items are hidden for non-OWNER users
  const userRole = session?.user?.role || 'CUSTOMER'

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:block">
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <span className="text-xl font-bold text-gray-900">Gzora</span>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              show={!item.ownerOnly || userRole === 'OWNER'}
            />
          ))}
        </nav>
        <div className="border-t border-gray-200 p-4">
          <div className="space-y-1 px-3">
            <LanguageSwitcher />
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
          <span className="text-xl font-bold text-gray-900">Gzora</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
