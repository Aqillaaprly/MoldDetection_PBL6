import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('sensor_data')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error || !data) {
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 })
  }

  const latest = data[0]

  let score = 0

  //  HUMIDITY
  if (latest.humidity > 80) score += 60
  else if (latest.humidity > 70) score += 40
  else if (latest.humidity > 60) score += 20

  //  TEMPERATURE
  if (latest.temperature >= 25 && latest.temperature <= 30) score += 20
  else if (latest.temperature >= 20) score += 10

  //  LIGHT
  if (latest.light < 100) score += 20
  else if (latest.light < 300) score += 10

  // DURATION
  let highHumidityCount = data.filter(d => d.humidity > 70).length

  if (highHumidityCount > 10) score += 30
  else if (highHumidityCount > 5) score += 20
  else if (highHumidityCount > 3) score += 10

  return Response.json({
    mri: score,
    status:
      score < 40 ? "LOW" :
      score < 70 ? "MEDIUM" :
      "HIGH"
  })
}