import { create } from "zustand"

interface SensorState {
  humidity: number
  temperature: number
  light: number
  setSensorData: (data: any) => void
}

export const useSensorStore = create<SensorState>((set) => ({
  humidity: 0,
  temperature: 0,
  light: 0,

  setSensorData: (data) =>
    set({
      humidity: data.humidity,
      temperature: data.temperature,
      light: data.light,
    }),
}))