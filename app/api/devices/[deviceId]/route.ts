import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const runtime = "nodejs"

type Params = {
  params: Promise<{
    deviceId: string
  }>
}

type UpdateDevicePayload = {
  deviceName?: string
  roomId?: number | null
  actuatorType?: string
  isActive?: boolean
}

export async function GET(_req: Request, context: Params) {
  try {
    const { deviceId } = await context.params

    const { data, error } = await supabaseAdmin
      .from("devices")
      .select(
        `
        *,
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
          message: "Failed to fetch device",
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
        },
        { status: 404 }
      )
    }

    return Response.json(
      {
        success: true,
        data,
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

export async function PATCH(req: Request, context: Params) {
  try {
    const { deviceId } = await context.params
    const body = (await req.json()) as UpdateDevicePayload

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (body.deviceName !== undefined) {
      updateData.device_name = body.deviceName
    }

    if (body.roomId !== undefined) {
      updateData.room_id = body.roomId
    }

    if (body.actuatorType !== undefined) {
      updateData.actuator_type = body.actuatorType
    }

    if (body.isActive !== undefined) {
      updateData.is_active = body.isActive
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
        data,
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