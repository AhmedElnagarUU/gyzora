import { type NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/shared/lib/db/mongoose'

export async function GET(req: NextRequest) {
  const checks: Record<string, { status: 'ok' | 'error'; latency?: number }> = {}

  // Database check
  const dbStart = Date.now()
  try {
    await connectToDatabase()
    checks.database = { status: 'ok', latency: Date.now() - dbStart }
  } catch (err) {
    checks.database = { status: 'error', latency: Date.now() - dbStart }
  }

  const allOk = Object.values(checks).every((c) => c.status === 'ok')

  return NextResponse.json(
    {
      status: allOk ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: allOk ? 200 : 503 }
  )
}
