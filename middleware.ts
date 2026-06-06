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

  // Refresh session supaya tidak expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const publicRoutes = ["/login", "/register"]
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route))

  // Belum login → redirect ke /login
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Sudah login tapi buka /login atau /register → redirect ke dashboard
  if (user && isPublic) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Sudah login — cek apakah sudah punya rooms (kecuali kalau sedang di /onboarding)
  if (user && pathname !== "/onboarding") {
    const { data: rooms } = await supabase
      .from("rooms")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)

    // Belum punya room → paksa ke onboarding
    if (!rooms || rooms.length === 0) {
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}