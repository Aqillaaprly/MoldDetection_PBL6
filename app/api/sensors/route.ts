import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const runtime = "nodejs"

const esp32ApiKey = process.env.ESP32_API_KEY

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
  actuatorStatus?: string
  controlMode?: string
  actuatorType?: string
}

function normalizeText(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback

  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed : fallback
}

function normalizeUpper(value: unknown, fallback: string) {
  return normalizeText(value, fallback).toUpperCase()
}

export async function POST(req: Request) {
  console.log("POST /api/sensors masuk")

  try {
    const apiKey = req.headers.get("x-api-key")

    if (esp32ApiKey && apiKey !== esp32ApiKey) {
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

    const deviceId = normalizeText(body.deviceId, "")
    const roomNameFromPayload = normalizeText(body.roomName, "Unassigned")

    const temperature = Number(body.temperature)
    const humidity = Number(body.humidity)

    const ldrValue =
      body.ldrValue !== undefined
        ? Number(body.ldrValue)
        : Number(body.light)

    const lightStatus = normalizeUpper(body.lightStatus, "UNKNOWN")
    const status = normalizeText(body.status, "UNKNOWN")
    const moldRisk = normalizeUpper(body.moldRisk, "UNKNOWN")
    const relayStatus = normalizeUpper(body.relayStatus, "OFF")
    const actuatorType = normalizeUpper(body.actuatorType, "GENERAL_RELAY")

    if (
      !deviceId ||
      Number.isNaN(temperature) ||
      Number.isNaN(humidity) ||
      Number.isNaN(ldrValue)
    ) {
      return Response.json(
        {
          success: false,
          message: "Invalid sensor payload",
          received: body,
          required: {
            deviceId: "string",
            temperature: "number",
            humidity: "number",
            ldrValue: "number",
          },
        },
        { status: 400 }
      )
    }

    // 1. Cari device berdasarkan deviceId
    const { data: existingDevice, error: deviceFetchError } =
      await supabaseAdmin
        .from("devices")
        .select(
          `
          id,
          device_id,
          device_name,
          room_id,
          control_mode,
          actuator_status,
          actuator_type
        `
        )
        .eq("device_id", deviceId)
        .maybeSingle()

    if (deviceFetchError) {
      console.error("Supabase device fetch error:", deviceFetchError)

      return Response.json(
        {
          success: false,
          message: "Failed to fetch device",
          error: deviceFetchError.message,
        },
        { status: 500 }
      )
    }

    let device = existingDevice

    // 2. Kalau device belum ada, buat otomatis
    if (!device) {
      const { data: newDevice, error: createDeviceError } =
        await supabaseAdmin
          .from("devices")
          .insert({
            device_id: deviceId,
            device_name: deviceId,
            room_id: null,
            device_type: "ESP32",
            actuator_type: actuatorType,
            control_mode: "AUTO",
            actuator_status: "OFF",
            is_active: true,
            last_seen: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select(
            `
            id,
            device_id,
            device_name,
            room_id,
            control_mode,
            actuator_status,
            actuator_type
          `
          )
          .single()

      if (createDeviceError) {
        console.error("Supabase create device error:", createDeviceError)

        return Response.json(
          {
            success: false,
            message: "Failed to create device",
            error: createDeviceError.message,
          },
          { status: 500 }
        )
      }

      device = newDevice
    }

    const roomId = device.room_id

    // 3. Update device hanya untuk status online/last_seen.
    // Jangan update control_mode dan actuator_status dari sensor payload,
    // karena itu adalah perintah dari web ke ESP.
    const { error: updateDeviceError } = await supabaseAdmin
      .from("devices")
      .update({
        actuator_type: actuatorType,
        is_active: true,
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("device_id", deviceId)

    if (updateDeviceError) {
      console.error("Supabase update device error:", updateDeviceError)
    }

    // 4. Insert sensor_data.
    // control_mode dan actuator_status diambil dari tabel devices,
    // supaya histori sensor mencatat status control terbaru dari web.
    const { data, error } = await supabaseAdmin
      .from("sensor_data")
      .insert({
        device_id: deviceId,
        room_id: roomId,
        temperature,
        humidity: Math.round(humidity),
        light: ldrValue,
        light_status: lightStatus,
        status,
        mold_risk: moldRisk,
        relay_status: relayStatus,
        actuator_status: device.actuator_status ?? "OFF",
        control_mode: device.control_mode ?? "AUTO",
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase insert sensor error:", error)

      return Response.json(
        {
          success: false,
          message: "Failed to save sensor data",
          error: error.message,
        },
        { status: 500 }
      )
    }

    return Response.json(
      {
        success: true,
        message: "Sensor data saved",
        deviceId,
        roomId,
        roomName: roomNameFromPayload,
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
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  console.log("GET /api/sensors masuk")

  try {
    const { data, error } = await supabaseAdmin
      .from("sensor_data")
      .select(
        `
        *,
        devices (
          device_id,
          device_name,
          actuator_type,
          control_mode,
          actuator_status
        ),
        rooms (
          id,
          name
        )
      `
      )
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

    // Tetap return array agar services/sensorService.ts tidak rusak
    return Response.json(data ?? [], { status: 200 })
  } catch (error) {
    console.error("GET /api/sensors error:", error)

    return Response.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}