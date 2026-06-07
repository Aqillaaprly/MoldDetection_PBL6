import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const runtime = "nodejs"

const esp32ApiKey = process.env.ESP32_API_KEY

type RegisterPayload = {
  deviceId?: string
  deviceName?: string
  deviceType?: string
  actuatorType?: string
  ipAddress?: string
  macAddress?: string
}

function normalizeText(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : fallback
}

export async function POST(req: Request) {
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

    const body = (await req.json()) as RegisterPayload

    const deviceId = normalizeText(body.deviceId, "")
    const deviceName = normalizeText(body.deviceName, deviceId)
    const deviceType = normalizeText(body.deviceType, "ESP32")
    const actuatorType = normalizeText(body.actuatorType, "GENERAL_RELAY")
    const ipAddress = normalizeText(body.ipAddress, "")
    const macAddress = normalizeText(body.macAddress, "")

    if (!deviceId) {
      return Response.json(
        {
          success: false,
          message: "deviceId is required",
        },
        { status: 400 }
      )
    }

    const { data: existingDevice, error: fetchError } = await supabaseAdmin
      .from("devices")
      .select("*")
      .eq("device_id", deviceId)
      .maybeSingle()

    if (fetchError) {
      return Response.json(
        {
          success: false,
          message: "Failed to fetch device",
          error: fetchError.message,
        },
        { status: 500 }
      )
    }

    if (!existingDevice) {
      const { data, error } = await supabaseAdmin
        .from("devices")
        .insert({
          device_id: deviceId,
          device_name: deviceName,
          room_id: null,
          device_type: deviceType,
          actuator_type: actuatorType,
          control_mode: "AUTO",
          actuator_status: "OFF",
          is_active: true,
          ip_address: ipAddress || null,
          mac_address: macAddress || null,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        return Response.json(
          {
            success: false,
            message: "Failed to register device",
            error: error.message,
          },
          { status: 500 }
        )
      }

      return Response.json(
        {
          success: true,
          message: "Device registered",
          device: data,
        },
        { status: 201 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("devices")
      .update({
        device_name: existingDevice.device_name ?? deviceName,
        device_type: deviceType,
        actuator_type: actuatorType,
        is_active: true,
        ip_address: ipAddress || existingDevice.ip_address,
        mac_address: macAddress || existingDevice.mac_address,
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("device_id", deviceId)
      .select()
      .single()

    if (error) {
      return Response.json(
        {
          success: false,
          message: "Failed to update device",
          error: error.message,
        },
        { status: 500 }
      )
    }

    return Response.json(
      {
        success: true,
        message: "Device updated",
        device: data,
      },
      { status: 200 }
    )
  } catch (error) {
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