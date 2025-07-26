// Create this file: src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is signed in and the current path is / redirect the user to /notes
  if (user && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/notes', req.url))
  }

  // If user is not signed in and the current path is not / redirect the user to /
  if (!user && req.nextUrl.pathname !== '/' && !req.nextUrl.pathname.startsWith('/login') && !req.nextUrl.pathname.startsWith('/signup')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/', '/notes', '/collections', '/ai'],
}
