'use client'

import { useState, useEffect } from 'react'
import { Button, Input } from '@/shared/ui'
import { Plus, X } from 'lucide-react'

interface Tracker {
  _id: string
  provider: 'meta-pixel' | 'google-analytics' | 'custom'
  name: string
  pixelId?: string
  trackingId?: string
  scriptUrl?: string
  enabled: boolean
}

interface TrackingConfig {
  _id: string
  trackers: Tracker[]
}

export const dynamic = 'force-dynamic'

export default function TrackingSettingsPage() {
  const [config, setConfig] = useState<TrackingConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchConfig = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/tracking')
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setConfig(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  const addTracker = () => {
    if (!config) return
    const newTracker: Tracker = {
      _id: 'temp-' + Date.now(),
      provider: 'meta-pixel',
      name: '',
      enabled: true,
    }
    setConfig({
      ...config,
      trackers: [...config.trackers, newTracker],
    })
  }

  const updateTracker = (id: string, field: string, value: any) => {
    if (!config) return
    setConfig({
      ...config,
      trackers: config.trackers.map((t) =>
        t._id === id ? { ...t, [field]: value } : t
      ),
    })
  }

  const removeTracker = (id: string) => {
    if (!config) return
    setConfig({
      ...config,
      trackers: config.trackers.filter((t) => t._id !== id),
    })
  }

  const save = async () => {
    if (!config) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackers: config.trackers }),
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }
      await fetchConfig()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="p-6">Loading...</p>return (
    <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tracking & Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Configure tracking pixels and analytics scripts for your published site.
            </p>
          </div>
          <Button onClick={addTracker}>
            <Plus className="h-4 w-4 mr-2" />
            Add Tracker
          </Button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {(!config || config.trackers.length === 0) ? (
          <div className="text-center py-12 border border-gray-200 rounded-xl">
            <p className="text-gray-500">No trackers configured.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {config.trackers.map((tracker) => (
              <div
                key={tracker._id}
                className="border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <select
                    value={tracker.provider}
                    onChange={(e) =>
                      updateTracker(
                        tracker._id,
                        'provider',
                        e.target.value
                      )
                    }
                    className="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:border-primary-500 focus:outline-none"
                  >
                    <option value="meta-pixel">Meta Pixel</option>
                    <option value="google-analytics">Google Analytics</option>
                    <option value="custom">Custom Script</option>
                  </select>
                  <button
                    onClick={() => removeTracker(tracker._id)}
                    className="p-1 rounded-lg hover:bg-gray-200 text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <Input
                  placeholder="Display name"
                  value={tracker.name}
                  onChange={(e) =>
                    updateTracker(tracker._id, 'name', e.target.value)
                  }
                  className="mb-3"
                />

                {tracker.provider === 'meta-pixel' && (
                  <Input
                    placeholder="Pixel ID (e.g. GT-XXXXXXXXXX)"
                    value={tracker.pixelId || ''}
                    onChange={(e) =>
                      updateTracker(tracker._id, 'pixelId', e.target.value)
                    }
                  />
                )}

                {tracker.provider === 'google-analytics' && (
                  <Input
                    placeholder="Measurement ID (e.g. G-XXXXXXXXXX)"
                    value={tracker.trackingId || ''}
                    onChange={(e) =>
                      updateTracker(tracker._id, 'trackingId', e.target.value)
                    }
                  />
                )}

                {tracker.provider === 'custom' && (
                  <Input
                    placeholder="Script URL"
                    value={tracker.scriptUrl || ''}
                    onChange={(e) =>
                      updateTracker(tracker._id, 'scriptUrl', e.target.value)
                    }
                  />
                )}

                <label className="flex items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    checked={tracker.enabled}
                    onChange={(e) =>
                      updateTracker(tracker._id, 'enabled', e.target.checked)
                    }
                  />
                  <span className="text-sm text-gray-700">Enabled</span>
                </label>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-gray-200 pt-4 mt-6">
          <Button onClick={save} disabled={saving} variant="secondary">
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    )
}
