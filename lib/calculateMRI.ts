export type MRIStatus = "LOW" | "MEDIUM" | "HIGH"

export interface SensorInput {
  humidity: number
  temperature: number
  light: number
}

export function calculateMRI(sensor: SensorInput): number {
  let score = 0

  // Humidity
  if (sensor.humidity > 80) score += 60
  else if (sensor.humidity > 70) score += 40
  else if (sensor.humidity > 60) score += 20

  // Temperature
  if (sensor.temperature >= 25 && sensor.temperature <= 30) score += 20
  else if (sensor.temperature >= 20) score += 10

  // Light
  if (sensor.light < 100) score += 20
  else if (sensor.light < 300) score += 10

  return score
}

export function getMRIStatus(score: number): MRIStatus {
  if (score < 40) return "LOW"
  if (score < 70) return "MEDIUM"
  return "HIGH"
}