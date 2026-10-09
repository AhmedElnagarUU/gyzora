'use client'

import { createSite } from '@/features/sites/api-client'
import { createSiteSchema } from '@/features/sites/schema'
import { Button, Input } from '@/shared/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const dynamic = 'force-dynamic'

export default function CreateSitePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [template, setTemplate] = useState('real-estate')
  const [theme, setTheme] = useState('light')
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const templates = ['real-estate', 'construction', 'design']
  const themes = ['light', 'dark', 'brand']

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const parse = createSiteSchema.safeParse({ name, slug, template, theme, status })
    if (!parse.success) {
      setError(parse.error.issues[0]?.message || 'Invalid input')
      setLoading(false)
      return
    }

    try {
      await createSite(parse.data)
      router.push('/dashboard/sites')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create site')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Site</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create a new site for your business
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Site Name
            </label>
            <Input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Business Site"
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <Input
              id="slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="my-business-site"
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="template" className="block text-sm font-medium text-gray-700">
              Template
            </label>
            <select
              id="template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {templates.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1).replace(/-/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
              Theme
            </label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {themes.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} variant="primary">
              {loading ? 'Creating...' : 'Create Site'}
            </Button>
            <Link
              href="/dashboard/sites"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    )
}
