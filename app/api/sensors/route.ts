import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const esp32ApiKey = process.env.ESP32_API_KEY

if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing")
if (!supabaseKey) throw new Error("Supabase key is missing")

const supabase = createClient(supabaseUrl, supabaseKey)

type SensorPayload = {
  deviceId?: string
  userId?: string
  roomId?: number
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

      return Response.json(
        {
          success: false,
          message: "Unauthorized device",
        },
        { status: 401 }
      )
    }

    const body = (await req.json()) as SensorPayload

    console.log("Payload diterima:", body)

    const roomIdFromBody =
      body.roomId !== undefined ? Number(body.roomId) : null

    const roomName = body.roomName ?? "Kitchen"
    const userId = body.userId

    const temperature = Number(body.temperature)
    const humidity = Number(body.humidity)

    const ldrValue =
      body.ldrValue !== undefined
        ? Number(body.ldrValue)
        : Number(body.light)

    if (
      Number.isNaN(temperature) ||
      Number.isNaN(humidity) ||
      Number.isNaN(ldrValue)
    ) {
      return Response.json(
        {
          success: false,
          message: "Invalid sensor payload",
          received: body,
        },
        { status: 400 }
      )
    }

    let finalRoomId: number | null = null

    // Prioritas 1: pakai roomId dari Wokwi
    if (roomIdFromBody && !Number.isNaN(roomIdFromBody)) {
      finalRoomId = roomIdFromBody
    }

    // Prioritas 2: kalau tidak ada roomId, cari dari roomName
    if (!finalRoomId) {
      let roomQuery = supabase
        .from("rooms")
        .select("id")
        .eq("name", roomName)
        .order("id", { ascending: true })
        .limit(1)

      if (userId) {
        roomQuery = roomQuery.eq("user_id", userId)
      }

      const { data: roomData, error: roomError } =
        await roomQuery.maybeSingle()

      if (roomError || !roomData) {
        console.error("Room tidak ditemukan:", roomName, userId)

        return Response.json(
          {
            success: false,
            message: `Room "${roomName}" tidak ditemukan`,
          },
          { status: 404 }
        )
      }

      finalRoomId = roomData.id
    }

    const { data, error } = await supabase
      .from("sensor_data")
      .insert({
        room_id: finalRoomId,
        device_id: body.deviceId ?? null,
        temperature,
        humidity: Math.round(humidity),
        light: ldrValue,
        light_status: body.lightStatus ?? null,
        status: body.status ?? null,
        mold_risk: body.moldRisk ?? null,
        relay_status: body.relayStatus ?? null,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)

      return Response.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      )
    }

    console.log("Data berhasil disimpan:", data)

    return Response.json(
      {
        success: true,
        message: "Sensor data saved",
        data,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("POST /api/sensors error:", error)

    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  console.log("GET /api/sensors masuk")

  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    const oneHourAgo = new Date(
      Date.now() - 60 * 60 * 1000
    ).toISOString()

    let roomIds: number[] | null = null

    if (userId) {
      const { data: userRooms } = await supabase
        .from("rooms")
        .select("id")
        .eq("user_id", userId)

      if (userRooms && userRooms.length > 0) {
        roomIds = userRooms.map((room) => room.id)
      } else {
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

      return Response.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      )
    }

    return Response.json(data, { status: 200 })
  } catch (error) {
    console.error("GET /api/sensors error:", error)

    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    )
  }
}