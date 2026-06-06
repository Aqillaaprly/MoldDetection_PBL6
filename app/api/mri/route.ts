import { createClient } from "@supabase/supabase-js"
import { calculateMRI, getMRIStatus } from "@/lib/calculateMRI"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const roomId = searchParams.get("roomId")

    if (!roomId) {
      return Response.json(
        {
          error: "roomId is required",
        },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("sensor_data")
      .select("*")
      .eq("room_id", Number(roomId))
      .order("created_at", {
        ascending: false,
      })
      .limit(20)

    if (error) {
      console.error("MRI QUERY ERROR:", error)

      return Response.json(
        {
          error: error.message,
        },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return Response.json(
        {
          error: "No sensor data found",
        },
        { status: 404 }
      )
    }

    const latest = data[0]

    const baseScore = calculateMRI({
      humidity: latest.humidity,
      temperature: latest.temperature,
      light: latest.light,
    })

    let score = baseScore

    const highHumidityCount = data.filter(
      (row) => row.humidity >= 80
    ).length

    const ratio =
      highHumidityCount / data.length

    if (ratio >= 0.75) {
      score += 20
    } else if (ratio >= 0.5) {
      score += 12
    } else if (ratio >= 0.25) {
      score += 6
    }

    score = Math.min(score, 100)

    return Response.json({
      mri: score,
      status: getMRIStatus(score),

      detail: {
        baseScore,
        highHumidityRatio: Math.round(
          ratio * 100
        ),

        latest: {
          humidity: latest.humidity,
          temperature: latest.temperature,
          light: latest.light,
        },
      },
    })
  } catch (error) {
    console.error(error)

    return Response.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    )
  }
}