import { getAuth } from '@/shared/lib/auth/auth-client'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js 16 proxy (formerly middleware).
 * Runs on the Node.js runtime by default, so Better Auth + Mongoose work here.
 */
export async function proxy(request: NextRequest) {
  const { nextUrl } = request

  const auth = await getAuth()
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  const isAuthenticated = !!session?.user
  const role = (session?.user as { role?: string } | undefined)?.role || 'CUSTOMER'

  // Protected dashboard routes
  if (nextUrl.pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    return NextResponse.next()
  }

  // Protected owner routes — OWNER role only
  if (nextUrl.pathname.startsWith('/owner')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    if (role !== 'OWNER') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Redirect authenticated users away from auth pages
  if (nextUrl.pathname.startsWith('/auth') && isAuthenticated) {
    const redirectTo = role === 'OWNER' ? '/owner' : '/dashboard'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/owner/:path*', '/auth/:path*'],
}
