import { supabase } from '@/lib/supabase'
import { calculateMRI, getMRIStatus } from '@/lib/calculateMRI'

export async function GET() {
  const { data, error } = await supabase
    .from('sensor_data')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error || !data || data.length === 0) {
    return Response.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }

  const latest = data[0]

  // Base score dari shared utility (sama dengan dashboard)
  let score = calculateMRI({
    humidity: latest.humidity,
    temperature: latest.temperature,
    light: latest.light
  })

  // Durasi histori — hanya bisa dihitung di server karena butuh data Supabase
  const highHumidityCount = data.filter(
    (d) => d.humidity > 70
  ).length

  if (highHumidityCount > 15) score += 30
  else if (highHumidityCount > 10) score += 20
  else if (highHumidityCount > 5) score += 10

  // Cap score di 100
  score = Math.min(score, 100)

  return Response.json({
    mri: score,
    status: getMRIStatus(score)
  })
}