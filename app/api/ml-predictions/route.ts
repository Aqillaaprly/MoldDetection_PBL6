import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { searchParams } = new URL(req.url)
  const view = searchParams.get("view") // "summary" atau "detail"

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("ml_predictions")
    .select("*, rooms(name, user_id)")
    .order("created_at", { ascending: false })
    .limit(view === "detail" ? 500 : 1000)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Filter milik user
  const filtered = data?.filter(
    (item) => item.rooms?.user_id === user.id
  ) ?? []

  // Hitung accuracy overall
  const total = filtered.length
  const correct = filtered.filter(
    (item) => item.mri_label === item.ml_prediction
  ).length
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

  // Hitung per room
  const roomMap: Record<string, {
    name: string
    total: number
    high: number
    medium: number
    low: number
  }> = {}

  filtered.forEach((item) => {
    const name = item.rooms?.name ?? "Unknown"
    if (!roomMap[name]) {
      roomMap[name] = { name, total: 0, high: 0, medium: 0, low: 0 }
    }
    roomMap[name].total++
    if (item.ml_prediction === "HIGH") roomMap[name].high++
    else if (item.ml_prediction === "MEDIUM") roomMap[name].medium++
    else roomMap[name].low++
  })

  const roomSummary = Object.values(roomMap).map((r) => ({
    name: r.name,
    total: r.total,
    highPct: Math.round((r.high / r.total) * 100),
    mediumPct: Math.round((r.medium / r.total) * 100),
    lowPct: Math.round((r.low / r.total) * 100),
    dominantRisk: r.high > r.medium && r.high > r.low ? "HIGH"
      : r.medium > r.low ? "MEDIUM" : "LOW"
  })).sort((a, b) => b.highPct - a.highPct)

  if (view === "detail") {
    return NextResponse.json({
      predictions: filtered,
      summary: { total, correct, accuracy },
      roomSummary,
    })
  }

  // Default: summary only untuk dashboard card
  return NextResponse.json({
    summary: { total, correct, accuracy },
    roomSummary,
  })
}