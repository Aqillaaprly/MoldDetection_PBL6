import { supabase } from '@/lib/supabase'

export async function GET() {
  // ambil data terbaru
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

  // MRI LOGIC
  if (latest.humidity > 80) score += 60
  else if (latest.humidity > 70) score += 40
  else if (latest.humidity > 60) score += 20

  if (latest.temperature >= 25 && latest.temperature <= 30) score += 20
  else if (latest.temperature >= 20) score += 10

  if (latest.light < 100) score += 20
  else if (latest.light < 300) score += 10

  const highHumidityCount = data.filter(d => d.humidity > 70).length

  if (highHumidityCount > 10) score += 30
  else if (highHumidityCount > 5) score += 20
  else if (highHumidityCount > 3) score += 10

  let exhaust = false
  let dehumidifier = false

  if (score >= 70) {
    exhaust = true
    dehumidifier = true
  } else if (score >= 40) {
    dehumidifier = true
  }

  return Response.json({
    mri: score,
    status:
      score < 40 ? "LOW" :
      score < 70 ? "MEDIUM" :
      "HIGH",
    devices: {
      exhaust,
      dehumidifier
    }
  })
}