'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProjectEditor from '@/features/projects/components/ProjectEditor'
import { Button } from '@/shared/ui'
import { Plus, Edit, Trash2, Calendar, Tag } from 'lucide-react'

interface Project {
  _id: string
  title: string
  description: string
  slug: string
  category: string
  order: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  seoMetadata?: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
  }
  images?: Array<{ key: string; url: string; alt?: string }>
  createdAt: string
  updatedAt: string
}

export const dynamic = 'force-dynamic'

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [error, setError] = useState('')

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/projects')
      if (!res.ok) throw new Error('Failed to fetch projects')
      const data = await res.json()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleSubmit = async (data: {
    title: string
    description: string
    slug: string
    category: string
    order: number
    status: string
    seoMetadata?: { title?: string; description?: string; keywords?: string[] }
    images?: Array<{ key: string; url: string; alt?: string }>
  }) => {
    const url = editingId ? `/api/projects?id=${editingId}` : '/api/projects'
    const method = editingId ? 'PUT' : 'POST'
    const body: any = { ...data }
    if (editingId) body.id = editingId

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.error || 'Failed to save')
    await fetchProjects()
    setEditingId(null)
    setShowEditor(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    await fetch(`/api/projects?id=${id}&action=delete`, {
      method: 'DELETE',
      credentials: 'include',
    })
    setProjects(projects.filter((p) => p._id !== id))
  }

  const statusLabel = (s: string) => {
    if (s === 'PUBLISHED') return 'bg-green-100 text-green-800'
    if (s === 'ARCHIVED') return 'bg-gray-100 text-gray-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const editingProject = editingId
    ? projects.find((p) => p._id === editingId)
    : undefined

  return (
    <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your project showcases
            </p>
          </div>
          <Link href="/dashboard/projects/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {(showEditor || editingId) && (
          <div className="mb-6 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Project' : 'New Project'}
            </h2>
            <ProjectEditor
              initialData={
                editingProject
                  ? {
                      title: editingProject.title,
                      description: editingProject.description,
                      slug: editingProject.slug,
                      category: editingProject.category,
                      order: editingProject.order,
                      status: editingProject.status,
                      seoMetadata: editingProject.seoMetadata,
                      images: editingProject.images,
                    }
                  : undefined
              }
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowEditor(false)
                setEditingId(null)
              }}
            />
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 border border-gray-200 rounded-xl">
            <p className="text-gray-500 mb-4">No projects yet.</p>
            <Button
              variant="secondary"
              onClick={() => setShowEditor(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first project
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {project.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${statusLabel(project.status)}`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {project.category}
                      </span>
                      <span>Order: {project.order}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => setEditingId(project._id)}
                      className="p-1 rounded-lg hover:bg-gray-200"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="p-1 rounded-lg hover:bg-gray-200"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
}
