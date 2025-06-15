import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const session = request.cookies.get("admin_session")
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin")

  if (isAdminPath && !request.nextUrl.pathname.startsWith("/admin/login")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
