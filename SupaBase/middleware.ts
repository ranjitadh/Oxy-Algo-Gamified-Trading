import { NextResponse } from 'next/server'

// Auth middleware temporarily disabled to avoid redirect loop.
// Client-side pages (like the dashboard) already check auth state.

export async function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}

