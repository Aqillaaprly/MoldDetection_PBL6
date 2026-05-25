import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const esp32ApiKey = process.env.ESP32_API_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

type SensorPayload = {
  deviceId?: string
  userId?: string      // ← BARU: ESP32 kirim userId
  roomName?: string
  temperature?: number
  humidity?: number
  ldrValue?: number
  light?: number
}

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key")
    if (esp32ApiKey && apiKey !== esp32ApiKey) {
      return Response.json({ success: false, message: "Unauthorized device" }, { status: 401 })
    }

    const body = (await req.json()) as SensorPayload

    const roomName = body.roomName ?? "Kitchen"
    const userId = body.userId  // ← dari ESP32 payload
    const temperature = Number(body.temperature)
    const humidity = Number(body.humidity)
    const ldrValue = body.ldrValue !== undefined ? Number(body.ldrValue) : Number(body.light)

    if (!roomName || Number.isNaN(temperature) || Number.isNaN(humidity) || Number.isNaN(ldrValue)) {
      return Response.json({ success: false, message: "Invalid payload" }, { status: 400 })
    }

    // Lookup room_id dari database berdasarkan nama & user_id
    let roomQuery = supabase
      .from("rooms")
      .select("id")
      .eq("name", roomName)
      .single()

    if (userId) {
      roomQuery = supabase
        .from("rooms")
        .select("id")
        .eq("name", roomName)
        .eq("user_id", userId)
        .single()
    }

    const { data: roomData, error: roomError } = await roomQuery

    if (roomError || !roomData) {
      return Response.json(
        { success: false, message: `Room "${roomName}" tidak ditemukan` },
        { status: 404 }
      )
    }

    const { data, error } = await supabase
      .from("sensor_data")
      .insert({
        room_id: roomData.id,
        temperature,
        humidity: Math.round(humidity),
        light: ldrValue,
      })
      .select()
      .single()

    if (error) {
      return Response.json({ success: false, message: error.message }, { status: 500 })
    }

    return Response.json({ success: true, data }, { status: 200 })

  } catch (error) {
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    let query = supabase
      .from("sensor_data")
      .select("*, rooms(name, user_id)")
      .order("created_at", { ascending: false })
      .limit(100)

    // Filter berdasarkan user jika userId dikirim
    if (userId) {
      query = supabase
        .from("sensor_data")
        .select("*, rooms!inner(name, user_id)")
        .eq("rooms.user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100)
    }

    const { data, error } = await query

    if (error) {
      return Response.json({ success: false, message: error.message }, { status: 500 })
    }

    return Response.json(data, { status: 200 })

  } catch (error) {
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}