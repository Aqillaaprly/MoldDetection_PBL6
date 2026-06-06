import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const esp32ApiKey = process.env.ESP32_API_KEY

if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing")
if (!supabaseKey) throw new Error("Supabase key is missing")

const supabase = createClient(supabaseUrl, supabaseKey)

type SensorPayload = {
  deviceId?: string
  userId?: string
  roomName?: string
  temperature?: number
  humidity?: number
  ldrValue?: number
  light?: number
  lightStatus?: string
  status?: string
  moldRisk?: string
  relayStatus?: string
}

export async function POST(req: Request) {
  console.log("POST /api/sensors masuk")

  try {
    const apiKey = req.headers.get("x-api-key")

    if (esp32ApiKey && apiKey !== esp32ApiKey) {
      console.log("Unauthorized device")
      return Response.json({ success: false, message: "Unauthorized device" }, { status: 401 })
    }

    const body = (await req.json()) as SensorPayload
    console.log("Payload diterima:", body)

    const roomName = body.roomName ?? "Kitchen"
    const userId = body.userId
    const temperature = Number(body.temperature)
    const humidity = Number(body.humidity)
    const ldrValue = body.ldrValue !== undefined ? Number(body.ldrValue) : Number(body.light)

    if (!roomName || Number.isNaN(temperature) || Number.isNaN(humidity) || Number.isNaN(ldrValue)) {
      return Response.json({ success: false, message: "Invalid sensor payload", received: body }, { status: 400 })
    }

    // Lookup room_id dari database berdasarkan nama & user_id
    let roomQuery = supabase
      .from("rooms")
      .select("id")
      .eq("name", roomName)

    if (userId) {
      roomQuery = roomQuery.eq("user_id", userId)
    }

    const { data: roomData, error: roomError } = await roomQuery.single()

    if (roomError || !roomData) {
      console.error("Room tidak ditemukan:", roomName, userId)
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
      console.error("Supabase insert error:", error)
      return Response.json({ success: false, message: error.message }, { status: 500 })
    }

    console.log("Data berhasil disimpan:", data)
    return Response.json({ success: true, message: "Sensor data saved", data }, { status: 200 })

  } catch (error) {
    console.error("POST /api/sensors error:", error)
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  console.log("GET /api/sensors masuk")

  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    // Hanya ambil data 1 jam terakhir supaya query cepat
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    let roomIds: number[] | null = null

    // Kalau ada userId, ambil room_ids milik user itu
    if (userId) {
      const { data: userRooms } = await supabase
        .from("rooms")
        .select("id")
        .eq("user_id", userId)

      if (userRooms && userRooms.length > 0) {
        roomIds = userRooms.map((r) => r.id)
      } else {
        // User tidak punya rooms → return kosong
        return Response.json([], { status: 200 })
      }
    }

    let query = supabase
      .from("sensor_data")
      .select("*")
      .gte("created_at", oneHourAgo)
      .order("created_at", { ascending: false })
      .limit(500)

    if (roomIds) {
      query = supabase
        .from("sensor_data")
        .select("*")
        .in("room_id", roomIds)
        .gte("created_at", oneHourAgo)
        .order("created_at", { ascending: false })
        .limit(500)
    }

    const { data, error } = await query

    if (error) {
      console.error("Supabase fetch error:", error)
      return Response.json({ success: false, message: error.message }, { status: 500 })
    }

    return Response.json(data, { status: 200 })

  } catch (error) {
    console.error("GET /api/sensors error:", error)
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}