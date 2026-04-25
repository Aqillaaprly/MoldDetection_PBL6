import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data: lastData } = await supabase
    .from('sensor_data')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)

  const last = lastData?.[0]

  const smooth = (value: number, min: number, max: number, step: number) => {
    const change = (Math.random() - 0.5) * step
    let newValue = value + change

    if (newValue < min) newValue = min
    if (newValue > max) newValue = max

    return Number(newValue.toFixed(1))
  }

  // initial data
  const newData = last
    ? {
        temperature: smooth(last.temperature, 20, 30, 1),
        humidity: Math.round(smooth(last.humidity, 50, 90, 3)),
        light: Math.round(smooth(last.light, 100, 700, 50))
      }
    : {
        temperature: 25,
        humidity: 60,
        light: 300
      }

  // insert DB
  await supabase.from('sensor_data').insert([newData])

  const { data } = await supabase
    .from('sensor_data')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  return Response.json(data)
}