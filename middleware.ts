import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {

  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  const publicRoutes = ["/login"]

  const isPublic = publicRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Jika belum login dan buka halaman protected
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Jika sudah login tapi buka login page
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}