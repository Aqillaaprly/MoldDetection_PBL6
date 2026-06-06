import { supabase } from '@/lib/supabase'
import { calculateMRI, getMRIStatus } from '@/lib/calculateMRI'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const roomId = searchParams.get("roomId")

  // Ambil 20 data terakhir (untuk analisis durasi)
  let query = supabase
    .from('sensor_data')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (roomId) {
    query = supabase
      .from('sensor_data')
      .select('*')
      .eq('room_id', Number(roomId))
      .order('created_at', { ascending: false })
      .limit(20)
  }

  const { data, error } = await query

  if (error || !data || data.length === 0) {
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 })
  }

  const latest = data[0]

  // Score dari kondisi sensor saat ini
  let score = calculateMRI({
    humidity: latest.humidity,
    temperature: latest.temperature,
    light: latest.light,
  })

 
  const highHumidityCount = data.filter((d) => d.humidity >= 80).length
  const ratio = highHumidityCount / data.length  // 0.0 – 1.0

  if (ratio >= 0.75)      score += 20  // > 75%  → +20
  else if (ratio >= 0.5)  score += 12  // > 50% → +12
  else if (ratio >= 0.25) score += 6   // > 25% → +6

  score = Math.min(score, 100)

  return Response.json({
    mri: score,
    status: getMRIStatus(score),
    detail: {
      baseScore: calculateMRI({
        humidity: latest.humidity,
        temperature: latest.temperature,
        light: latest.light,
      }),
      durationBonus: score - calculateMRI({
        humidity: latest.humidity,
        temperature: latest.temperature,
        light: latest.light,
      }),
      highHumidityRatio: Math.round(ratio * 100),
      latest: {
        humidity: latest.humidity,
        temperature: latest.temperature,
        light: latest.light,
      }
    }
  })
}