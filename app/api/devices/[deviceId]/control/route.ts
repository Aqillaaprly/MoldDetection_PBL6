import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const runtime = "nodejs"

type Params = {
  params: Promise<{
    deviceId: string
  }>
}

type ControlPayload = {
  controlMode?: string
  actuatorStatus?: string
}

type RoomRelation =
  | {
      id: number | string | null
      name: string | null
    }
  | {
      id: number | string | null
      name: string | null
    }[]
  | null

function normalizeUpper(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback

  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed.toUpperCase() : fallback
}

function getRoomName(rooms: RoomRelation) {
  if (!rooms) return "Unassigned"

  if (Array.isArray(rooms)) {
    return rooms[0]?.name ?? "Unassigned"
  }

  return rooms.name ?? "Unassigned"
}

async function updateDeviceControl(
  req: Request,
  context: Params
) {
  try {
    const { deviceId } = await context.params
    const body = (await req.json()) as ControlPayload

    const controlMode = body.controlMode
      ? normalizeUpper(body.controlMode, "AUTO")
      : undefined

    const actuatorStatus = body.actuatorStatus
      ? normalizeUpper(body.actuatorStatus, "OFF")
      : undefined

    if (controlMode && !["AUTO", "MANUAL"].includes(controlMode)) {
      return Response.json(
        {
          success: false,
          message: "controlMode must be AUTO or MANUAL",
        },
        { status: 400 }
      )
    }

    if (actuatorStatus && !["ON", "OFF"].includes(actuatorStatus)) {
      return Response.json(
        {
          success: false,
          message: "actuatorStatus must be ON or OFF",
        },
        { status: 400 }
      )
    }

    const updateData: Record<string, string> = {
      updated_at: new Date().toISOString(),
    }

    if (controlMode) {
      updateData.control_mode = controlMode
    }

    if (actuatorStatus) {
      updateData.actuator_status = actuatorStatus
    }

    const { data, error } = await supabaseAdmin
      .from("devices")
      .update(updateData)
      .eq("device_id", deviceId)
      .select()
      .single()

    if (error) {
      return Response.json(
        {
          success: false,
          message: "Failed to update device control",
          error: error.message,
        },
        { status: 500 }
      )
    }

    return Response.json(
      {
        success: true,
        message: "Device control updated",
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

export async function GET(
  _req: Request,
  context: Params
) {
  try {
    const { deviceId } = await context.params

    const { data, error } = await supabaseAdmin
      .from("devices")
      .select(
        `
        id,
        device_id,
        device_name,
        room_id,
        device_type,
        actuator_type,
        control_mode,
        actuator_status,
        is_active,
        last_seen,
        rooms (
          id,
          name
        )
      `
      )
      .eq("device_id", deviceId)
      .maybeSingle()

    if (error) {
      return Response.json(
        {
          success: false,
          message: "Failed to fetch device control",
          error: error.message,
        },
        { status: 500 }
      )
    }

    if (!data) {
      return Response.json(
        {
          success: false,
          message: "Device not found",
          deviceId,
        },
        { status: 404 }
      )
    }

    return Response.json(
      {
        success: true,
        deviceId: data.device_id,
        deviceName: data.device_name,
        roomId: data.room_id,
        roomName: getRoomName(data.rooms as RoomRelation),
        deviceType: data.device_type,
        actuatorType: data.actuator_type,
        controlMode: data.control_mode,
        actuatorStatus: data.actuator_status,
        isActive: data.is_active,
        lastSeen: data.last_seen,
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

// Kita support dua-duanya.
// Frontend nanti pakai POST, tapi PATCH tetap tersedia.
export async function POST(
  req: Request,
  context: Params
) {
  return updateDeviceControl(req, context)
}

export async function PATCH(
  req: Request,
  context: Params
) {
  return updateDeviceControl(req, context)
}