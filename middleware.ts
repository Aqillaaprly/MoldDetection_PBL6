import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Kalau refresh token expired/invalid → clear cookies → redirect ke login
  if (error?.code === "refresh_token_not_found" || error?.message?.includes("Refresh Token")) {
    const redirectResponse = NextResponse.redirect(new URL("/login", request.url))
    request.cookies.getAll().forEach((cookie) => {
      if (cookie.name.includes("supabase") || cookie.name.includes("sb-")) {
        redirectResponse.cookies.delete(cookie.name)
      }
    })
    return redirectResponse
  }

  // "/" pakai exact match, login/register pakai startsWith
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")

  // Belum login + bukan public → redirect ke landing page
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Sudah login tapi buka /login atau /register → redirect ke dashboard
  if (user && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Sudah login — cek rooms (kecuali di /onboarding atau landing page)
  if (user && pathname !== "/onboarding" && pathname !== "/") {
    const { data: rooms } = await supabase
      .from("rooms")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)

    if (!rooms || rooms.length === 0) {
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
}