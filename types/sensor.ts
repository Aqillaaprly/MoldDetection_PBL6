export interface SensorReading {
  id: string
  sensorId: string
  hubId: string
  humidity: number
  temperature: number
  lightIntensity: number
  timestamp: Date
}

export interface SensorHub {
  id: string
  name: string
  location: string
  sensorType: string
  currentValue: string
  status: "ACTIVE" | "ALERT" | "INACTIVE"
  battery: number
  lastSync: string
}

export interface MetricData {
  time: string
  humidity?: number
  temperature?: number
  light?: number
}
