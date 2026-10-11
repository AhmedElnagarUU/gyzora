import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/shared/lib/db/mongoose'

/**
 * Monitoring health check. This endpoint intentionally keeps the conventional
 * `{ status, timestamp, checks }` monitoring shape rather than the feature
 * envelope (`API_CONTRACTS.md` §1); the route file stays a thin re-export so
 * API route files contain no logic (`DEC-003`).
 */
export async function getHealth() {
  const checks: Record<string, { status: 'ok' | 'error'; latency?: number }> = {}

  const dbStart = Date.now()
  try {
    await connectToDatabase()
    checks.database = { status: 'ok', latency: Date.now() - dbStart }
  } catch {
    checks.database = { status: 'error', latency: Date.now() - dbStart }
  }

  const allOk = Object.values(checks).every((check) => check.status === 'ok')

  return NextResponse.json(
    {
      status: allOk ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: allOk ? 200 : 503 }
  )
}
