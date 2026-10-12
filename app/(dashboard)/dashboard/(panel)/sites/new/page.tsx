'use client'

import { createSite } from '@/features/sites/api-client'
import { createSiteSchema } from '@/features/sites/schema'
import { Button, Input } from '@/shared/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export const dynamic = 'force-dynamic'

export default function CreateSitePage() {
  const router = useRouter()
  const t = useTranslations('dashboard.sites')
  const tCommon = useTranslations('common')
  const tStatus = useTranslations('dashboard.status')
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
      setError(parse.error.issues[0]?.message || tCommon('errors.invalidInput'))
      setLoading(false)
      return
    }

    try {
      await createSite(parse.data)
      router.push('/dashboard/sites')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.create'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('create.title')}</h1>
        <p className="mt-2 text-sm text-gray-600">{t('create.subtitle')}</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            {t('fields.name')}
          </label>
          <Input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('placeholders.name')}
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            {t('fields.slug')}
          </label>
          <Input
            id="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={t('placeholders.slug')}
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="template" className="block text-sm font-medium text-gray-700">
            {t('fields.template')}
          </label>
          <select
            id="template"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="real-estate">{t('names.realEstate', { default: 'Real Estate' })}</option>
            <option value="construction">{t('names.construction', { default: 'Construction' })}</option>
            <option value="design">{t('names.design', { default: 'Design' })}</option>
          </select>
        </div>

        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
            {t('fields.theme')}
          </label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="light">{t('themes.names.light', { default: 'Light' })}</option>
            <option value="dark">{t('themes.names.dark', { default: 'Dark' })}</option>
            <option value="brand">{t('themes.names.brand', { default: 'Brand' })}</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            {t('fields.status')}
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED')}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="DRAFT">{tStatus('draft')}</option>
            <option value="PUBLISHED">{tStatus('published')}</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading} variant="primary">
            {loading ? tCommon('creating') : t('create.submit')}
          </Button>
          <Link
            href="/dashboard/sites"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {tCommon('cancel')}
          </Link>
        </div>
      </form>
    </div>
  )
}