import { supabase } from '@/lib/supabase'

const rooms = [
  { id: 1, name: "Living Room" },
  { id: 2, name: "Bedroom 1" },
  { id: 3, name: "Bedroom 2" },
  { id: 4, name: "Kitchen" }
]

export async function GET() {

  const smooth = (
    value: number,
    min: number,
    max: number,
    step: number
  ) => {

    const change = (Math.random() - 0.5) * step

    let newValue = value + change

    if (newValue < min) newValue = min
    if (newValue > max) newValue = max

    return Number(newValue.toFixed(1))
  }

  const sensorRows = []

  for (const room of rooms) {

    // ambil data terakhir per room
    const { data: lastData } = await supabase
      .from('sensor_data')
      .select('*')
      .eq('room_id', room.id)
      .order('created_at', { ascending: false })
      .limit(1)

    const last = lastData?.[0]

    const newData = last
      ? {
          room_id: room.id,

          temperature: smooth(
            last.temperature,
            20,
            35,
            1
          ),

          humidity: Math.round(
            smooth(last.humidity, 50, 90, 3)
          ),

          light: Math.round(
            smooth(last.light, 100, 700, 50)
          )
        }

      : {
          room_id: room.id,

          temperature: 25,
          humidity: 60,
          light: 300
        }

    sensorRows.push(newData)
  }

  // insert semua room sekaligus
  await supabase
    .from('sensor_data')
    .insert(sensorRows)

  const { data } = await supabase
    .from('sensor_data')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  return Response.json(data)
}