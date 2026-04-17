import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  const isLoginPage = pathname.startsWith("/login")

  // Kalau belum login dan bukan di halaman login → redirect ke login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Kalau sudah login tapi masih di halaman login → redirect ke dashboard
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
}