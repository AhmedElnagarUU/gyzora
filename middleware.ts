import { auth } from '@/shared/lib/auth/auth-client'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { nextUrl } = request
  const session = await auth.api.getSession({
    headers: { cookie: request.headers.get('cookie') || '' },
  })

  const isAuthenticated = !!session?.user

  // Protected dashboard routes
  if (nextUrl.pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    return NextResponse.next()
  }

  // Protected owner routes
  if (nextUrl.pathname.startsWith('/owner')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    // TODO: Check role === 'OWNER' here for stricter owner-only access
    return NextResponse.next()
  }

  // Redirect authenticated users away from auth pages
  if (
    nextUrl.pathname.startsWith('/auth') &&
    isAuthenticated
  ) {
    const role = (session.user as { role?: string }).role || 'CUSTOMER'
    const redirectTo = role === 'OWNER' ? '/owner' : '/dashboard'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/owner/:path*', '/auth/:path*'],
}
