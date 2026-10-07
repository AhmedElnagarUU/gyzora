import { handleAuth } from '@/features/auth/handlers'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  return handleAuth(req)
}
