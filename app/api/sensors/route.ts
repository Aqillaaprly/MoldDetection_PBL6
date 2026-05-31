import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const esp32ApiKey = process.env.ESP32_API_KEY

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing")
}

if (!supabaseKey) {
  throw new Error("Supabase key is missing")
}

const supabase = createClient(supabaseUrl, supabaseKey)

const roomMap: Record<string, number> = {
  "Living Room": 1,
  "Bedroom 1": 2,
  "Bedroom 2": 3,
  Kitchen: 4,
}

type SensorPayload = {
  deviceId?: string
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

    console.log("API key received:", apiKey ? "ADA" : "TIDAK ADA")

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

    const roomName = body.roomName ?? "Bedroom 1"
    const temperature = Number(body.temperature)
    const humidity = Number(body.humidity)
    const ldrValue =
      body.ldrValue !== undefined
        ? Number(body.ldrValue)
        : Number(body.light)

    if (
      !roomName ||
      Number.isNaN(temperature) ||
      Number.isNaN(humidity) ||
      Number.isNaN(ldrValue)
    ) {
      console.log("Payload tidak valid")

      return Response.json(
        {
          success: false,
          message: "Invalid sensor payload",
          received: body,
        },
        { status: 400 }
      )
    }

    const roomId = roomMap[roomName] ?? 2

    console.log("Room Name:", roomName)
    console.log("Room ID:", roomId)

    const { data, error } = await supabase
      .from("sensor_data")
      .insert({
        room_id: roomId,
        temperature,
        humidity: Math.round(humidity),
        light: ldrValue,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)

      return Response.json(
        {
          success: false,
          message: "Failed to save sensor data",
          error: error.message,
        },
        { status: 500 }
      )
    }

    console.log("Data berhasil disimpan:", data)

    return Response.json(
      {
        success: true,
        message: "Sensor data saved",
        roomName,
        roomId,
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

export async function GET() {
  console.log("GET /api/sensors masuk")

  try {
    const { data, error } = await supabase
      .from("sensor_data")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) {
      console.error("Supabase fetch error:", error)

      return Response.json(
        {
          success: false,
          message: "Failed to fetch sensor data",
          error: error.message,
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