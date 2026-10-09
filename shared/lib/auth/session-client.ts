'use client'

import { useEffect, useState } from 'react'

export interface SessionData {
  user: {
    id: string
    email: string
    name?: string
    role?: string
    tenantId?: string
  } | null
}

export function useSessionClient(): {
  data: SessionData | null
  isPending: boolean
} {
  const [data, setData] = useState<SessionData | null>(null)
  const [isPending, setIsPending] = useState(true)

  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include' })
      .then((res) => res.json())
      .then((json) => {
        if (json?.user) {
          setData({ user: json.user })
        } else {
          setData(null)
        }
        setIsPending(false)
      })
      .catch(() => {
        setData(null)
        setIsPending(false)
      })
  }, [])

  return { data, isPending }
}
