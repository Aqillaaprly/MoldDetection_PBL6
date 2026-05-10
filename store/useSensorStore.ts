import { create } from "zustand"

interface SensorData {
  humidity: number
  temperature: number
  light: number
}

interface SensorState {
  humidity: number
  temperature: number
  light: number

  previousHumidity: number
  previousTemperature: number
  previousLight: number

  setSensorData: (data: SensorData) => void
}

export const useSensorStore = create<SensorState>((set, get) => ({
  humidity: 0,
  temperature: 0,
  light: 0,

  previousHumidity: 0,
  previousTemperature: 0,
  previousLight: 0,

  setSensorData: (data) =>
    set({
      previousHumidity: get().humidity,
      previousTemperature: get().temperature,
      previousLight: get().light,

      humidity: data.humidity,
      temperature: data.temperature,
      light: data.light,
    }),
}))