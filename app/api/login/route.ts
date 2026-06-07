import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json(
      { error: "Email atau password salah" },
      { status: 401 }
    )
  }

  return NextResponse.json({
    success: true,
    user: data.user,
    session: data.session,
  })
}