'use client'

import { useState, useEffect } from 'react'
import { getTemplate, THEMES, type ImageSlotKey } from '@/features/templates'
import { getMedia } from '@/features/media/api-client'
import { Button } from '@/shared/ui'
import Link from 'next/link'
import { Check } from 'lucide-react'

interface MediaItem {
  _id: string
  key: string
  url: string
  size: number
  mimeType: string
  createdAt: string
}

export function TemplateConfigContent({ templateId }: { templateId: string }) {
  const template = getTemplate(templateId)
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTheme, setSelectedTheme] = useState(template?.defaultTheme || 'light')
  const [slotImages, setSlotImages] = useState<
    Partial<Record<ImageSlotKey, string>>
  >({})

  useEffect(() => {
    if (!template) return

    setSlotImages({})
    setSelectedTheme(template.defaultTheme || 'light')

    const fetchMediaAndLoadTheme = async () => {
      setLoading(true)
      try {
        const data = await getMedia()
        setMedia(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load media')
      } finally {
        setLoading(false)
      }
    }

    fetchMediaAndLoadTheme()
  }, [template])

  if (!template) return null

  const handleSlotSelect = (slot: ImageSlotKey, mediaId: string) => {
    const mediaItem = media.find((m) => m._id === mediaId)
    if (mediaItem) {
      setSlotImages((prev) => ({ ...prev, [slot]: mediaItem.url }))
    }
  }

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheme(e.target.value)
  }

  const handleSave = () => {
    // Persisting slot assignments requires the site↔slot model (see KNOWN_ISSUES).
    alert('Template configuration saved! (persistence pending)')
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {template.name} — Configuration
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Assign images from your media library to each slot.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Theme Selection */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-medium text-gray-900">Theme</h2>
        <select
          value={selectedTheme}
          onChange={handleThemeChange}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {THEMES.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name} — {theme.description}
            </option>
          ))}
        </select>
      </div>

      {/* Image Slots */}
      <div className="mb-6 space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900">Image Slots</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading your media...</p>
        ) : media.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            <p>No images in your media library.</p>
            <p className="mt-1 text-sm">
              Upload images in the{' '}
              <Link
                href="/dashboard/media"
                className="text-primary-600 underline"
              >
                Media Library
              </Link>{' '}
              first.
            </p>
          </div>
        ) : null}

        {template.imageSlots.map((slot) => (
          <ImageSlotPicker
            key={slot.key}
            slot={slot}
            media={media}
            selectedUrl={slotImages[slot.key]}
            onSlotSelect={(mediaId) => handleSlotSelect(slot.key, mediaId)}
            loaded={media.length > 0}
          />
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <Link
          href="/dashboard/templates"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
        <Button type="button" onClick={handleSave} variant="primary">
          Save Configuration
        </Button>
      </div>
    </div>
  )
}

function ImageSlotPicker({
  slot,
  media,
  selectedUrl,
  onSlotSelect,
  loaded,
}: {
  slot: {
    key: ImageSlotKey
    label: string
    description: string
    required: boolean
  }
  media: MediaItem[]
  selectedUrl?: string
  onSlotSelect: (mediaId: string) => void
  loaded: boolean
}) {
  const [open, setOpen] = useState(false)
  const selectedId = media.find((m) => m.url === selectedUrl)?._id

  const handleSelect = (mediaId: string) => {
    onSlotSelect(mediaId)
    setOpen(false)
  }

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {slot.label}
        {slot.required && <span className="text-red-500">*</span>}
      </label>
      <p className="text-xs text-gray-500">{slot.description}</p>

      <div className="mt-2 flex items-center gap-3">
        {selectedUrl ? (
          <img
            src={selectedUrl}
            alt={slot.label}
            className="h-20 w-20 rounded object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded border border-gray-300 bg-gray-50">
            <span className="text-xs text-gray-400">No image</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen(!open)}
          disabled={!loaded || media.length === 0}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {selectedUrl ? 'Change' : 'Select Image'}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[60vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-medium">
              Select image for {slot.label}
            </h3>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
              {media.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleSelect(item._id)}
                  className={`relative cursor-pointer rounded-lg border-2 p-1 transition-all ${
                    selectedId === item._id
                      ? 'border-primary-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.key}
                    className="h-24 w-full rounded object-cover"
                  />
                  {selectedId === item._id && (
                    <div className="absolute top-1 right-1 rounded-full bg-primary-600 p-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500 truncate">
                    {item.key.split('/').pop()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
