'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/shared/ui'
import {
  getMedia,
  getUploadUrl,
  confirmUpload,
  deleteMedia,
} from '@/features/media/api-client'

export const dynamic = 'force-dynamic'

interface MediaItem {
  _id: string
  key: string
  url: string
  size: number
  mimeType: string
  createdAt: string
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchMedia() {
    try {
      const data = await getMedia()
      setMedia(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedFile) return

    setUploading(true)
    setUploadError('')

    try {
      const uploadData = await getUploadUrl(
        selectedFile.name,
        selectedFile.type,
        selectedFile.size
      )

      // Upload directly to S3 using the pre-signed URL
      const uploadRes = await fetch(uploadData.uploadUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      })

      if (!uploadRes.ok) {
        throw new Error('Upload to S3 failed')
      }

      // Save metadata to MongoDB after successful S3 upload
      await confirmUpload({
        key: uploadData.key,
        url: uploadData.url,
        size: selectedFile.size,
        mimeType: selectedFile.type,
      })

      // Reset and refetch
      setSelectedFile(null)
      setUploadError('')
      await fetchMedia()
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this image? This cannot be undone.')) return

    try {
      await deleteMedia(id)
      setMedia((prev) => prev.filter((m) => m._id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage images uploaded to your tenant&apos;s S3 storage
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="mb-6 rounded-lg bg-white p-4 shadow-sm"
      >
        <h2 className="mb-3 text-lg font-medium text-gray-900">Upload Image</h2>

        {uploadError && (
          <div className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">
            {uploadError}
          </div>
        )}

        <div className="flex items-end gap-3">
          <input
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            onChange={(e) =>
              setSelectedFile(e.target.files?.[0] || null)
            }
            className="text-sm text-gray-500 file:rounded-lg file:border-0 file:bg-primary-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary-700"
            required
          />
          <Button type="submit" disabled={uploading || !selectedFile}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Max size: 10MB. Allowed: PNG, JPEG, GIF, WebP
        </p>
      </form>

      {loading ? (
        <div className="rounded-lg bg-white py-12 text-center shadow-sm">
          <p className="text-gray-500">Loading media...</p>
        </div>
      ) : media.length === 0 ? (
        <div className="rounded-lg bg-white py-12 text-center shadow-sm">
          <p className="text-gray-500">No media uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {media.map((item) => (
            <div
              key={item._id}
              className="group rounded-lg bg-white p-2 shadow-sm"
            >
              <img
                src={item.url}
                alt={item.key}
                className="h-40 w-full rounded object-cover"
                loading="lazy"
              />
              <div className="p-2">
                <p className="text-xs text-gray-500">
                  {(item.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                className="mt-1 w-full rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    )
}
