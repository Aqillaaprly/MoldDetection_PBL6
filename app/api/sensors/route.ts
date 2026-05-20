import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('sensor_data')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { deviceId, temperature, humidity, light, timestamp } = body

    if (
      temperature === undefined ||
      humidity === undefined ||
      light === undefined
    ) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('sensor_data')
      .insert({
        device_id: deviceId ?? 'wokwi_esp32_01',
        temperature,
        humidity,
        light,
        source: 'wokwi',
        created_at: timestamp
          ? new Date(Number(timestamp) * 1000).toISOString()
          : new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(
      { success: true, message: 'Data received and saved', data },
      { status: 201 }
    )
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }
}