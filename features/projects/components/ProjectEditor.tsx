'use client'

import { useState } from 'react'
import { Button, Input } from '@/shared/ui'

interface SeoMetadata {
  title?: string
  description?: string
  keywords?: string[]
}

interface ProjectImage {
  key: string
  url: string
  alt?: string
}

interface Project {
  _id?: string
  title: string
  description: string
  slug: string
  category: string
  order: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  seoMetadata?: SeoMetadata
  images?: ProjectImage[]
}

interface ProjectEditorProps {
  initialData?: Project
  onSubmit: (data: Project) => Promise<void>
  onCancel?: () => void
}

export default function ProjectEditor({
  initialData,
  onSubmit,
  onCancel,
}: ProjectEditorProps) {
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [category, setCategory] = useState(initialData?.category ?? 'General')
  const [status, setStatus] = useState(initialData?.status ?? 'DRAFT')
  const [order, setOrder] = useState(initialData?.order ?? 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // SEO Metadata
  const [seoTitle, setSeoTitle] = useState(initialData?.seoMetadata?.title ?? '')
  const [seoDescription, setSeoDescription] = useState(
    initialData?.seoMetadata?.description ?? ''
  )
  const [seoKeywords, setSeoKeywords] = useState(
    initialData?.seoMetadata?.keywords?.join(', ') ?? ''
  )

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    if (!initialData && !slug) {
      setSlug(generateSlug(e.target.value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!title.trim()) {
      setError('Title is required')
      setLoading(false)
      return
    }
    if (!description.trim()) {
      setError('Description is required')
      setLoading(false)
      return
    }

    try {
      await onSubmit({
        title,
        description,
        slug: slug || generateSlug(title),
        category: category || 'General',
        order: parseInt(String(order)) || 0,
        status,
        seoMetadata: {
          title: seoTitle || undefined,
          description: seoDescription || undefined,
          keywords: seoKeywords
            ? seoKeywords.split(',').map((k) => k.trim())
            : [],
        },
        images: initialData?.images,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <Input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g. Modern Office Renovation"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Slug
          </label>
          <Input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="project-slug"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <Input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Commercial, Residential"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Order
          </label>
          <Input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project description..."
            rows={4}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* SEO Section */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900">
          SEO Metadata
        </h3>
        <div className="mt-3 grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meta Title
            </label>
            <Input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="SEO title (optional)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="SEO description (optional)"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Keywords
            </label>
            <Input
              type="text"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="comma, separated, keywords"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}
