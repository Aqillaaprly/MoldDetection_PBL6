import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const runtime = "nodejs"

type SensorRow = {
  id: number
  temperature: number | null
  humidity: number | null
  light: number | null
  light_status: string | null
  mold_risk: string | null
  created_at: string | null
}

function calculateMRI(
  temperature: number,
  humidity: number,
  light: number
) {
  let score = 0

  if (humidity >= 80) {
    score += 55
  } else if (humidity >= 70) {
    score += 40
  } else if (humidity >= 60) {
    score += 25
  } else {
    score += 10
  }

  if (temperature >= 25 && temperature <= 30) {
    score += 25
  } else if (temperature > 30) {
    score += 20
  } else if (temperature >= 20) {
    score += 15
  } else {
    score += 5
  }

  // Di project kamu:
  // LDR tinggi = terang
  // LDR rendah = gelap
  if (light < 2000) {
    score += 20
  } else {
    score += 5
  }

  return Math.min(score, 100)
}

function getStatus(mri: number) {
  if (mri >= 75) {
    return "HIGH"
  }

  if (mri >= 45) {
    return "MEDIUM"
  }

  return "LOW"
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("sensor_data")
      .select(
        `
        id,
        temperature,
        humidity,
        light,
        light_status,
        mold_risk,
        created_at
      `
      )
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error("MRI Supabase error:", error)

      return Response.json(
        {
          success: true,
          message: "MRI fallback because Supabase query failed",
          mri: 0,
          status: "LOW",
          latest: null,
        },
        { status: 200 }
      )
    }

    if (!data) {
      return Response.json(
        {
          success: true,
          message: "No sensor data available",
          mri: 0,
          status: "LOW",
          latest: null,
        },
        { status: 200 }
      )
    }

    const latest = data as SensorRow

    const temperature = Number(latest.temperature ?? 0)
    const humidity = Number(latest.humidity ?? 0)
    const light = Number(latest.light ?? 0)

    const mri = calculateMRI(
      temperature,
      humidity,
      light
    )

    const status = getStatus(mri)

    return Response.json(
      {
        success: true,
        mri,
        status,
        latest: {
          id: latest.id,
          temperature,
          humidity,
          light,
          lightStatus: latest.light_status,
          moldRisk: latest.mold_risk,
          createdAt: latest.created_at,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("GET /api/mri error:", error)

    return Response.json(
      {
        success: true,
        message: "MRI fallback because internal error occurred",
        mri: 0,
        status: "LOW",
        latest: null,
      },
      { status: 200 }
    )
  }
}