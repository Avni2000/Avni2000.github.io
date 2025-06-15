import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Check if the path is for admin routes (except login)
  const isAdminRoute = path.startsWith('/admin') && !path.startsWith('/admin/login')
  
  // Check if the user is authenticated
  const adminSession = request.cookies.get('admin_session')?.value
  
  // If it's an admin route and the user is not authenticated, redirect to login
  if (isAdminRoute && !adminSession) {
    const url = new URL('/admin/login', request.url)
    return NextResponse.redirect(url)
  }
  
  // If it's the login route and the user is already authenticated, redirect to dashboard
  if (path.startsWith('/admin/login') && adminSession) {
    const url = new URL('/admin/dashboard', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Only run middleware on admin routes
export const config = {
  matcher: '/admin/:path*',
}
