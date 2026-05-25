import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"

// GET: ambil rooms milik user yang sedang login
export async function GET() {
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("user_id", user.id)
    .order("id")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST: buat room baru untuk user yang login
export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name } = await req.json()

  if (!name?.trim()) {
    return NextResponse.json({ error: "Nama room tidak boleh kosong" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("rooms")
    .insert({ name: name.trim(), user_id: user.id })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

// DELETE: hapus room milik user
export async function DELETE(req: Request) {
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await req.json()

  const { error } = await supabase
    .from("rooms")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id) // pastikan hanya bisa hapus milik sendiri

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}