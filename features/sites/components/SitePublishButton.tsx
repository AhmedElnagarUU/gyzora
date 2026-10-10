'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSite } from '@/features/sites/api-client'

export function SitePublishButton({
  id,
  status,
}: {
  id: string
  status: string
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isPublished = status === 'PUBLISHED'

  async function toggle() {
    setBusy(true)
    setError(null)
    try {
      await updateSite(id, { status: isPublished ? 'DRAFT' : 'PUBLISHED' })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update site')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {error && <span className="text-xs text-red-600">{error}</span>}
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={
          isPublished
            ? 'rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50'
            : 'rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700 disabled:opacity-50'
        }
      >
        {busy ? 'Saving...' : isPublished ? 'Unpublish' : 'Publish'}
      </button>
    </div>
  )
}
