export type MRIStatus = "LOW" | "MEDIUM" | "HIGH"

export interface SensorInput {
  humidity: number
  temperature: number
  light: number
}

/**
 * Mold Risk Index (MRI) 
 * 
 * Bobot:
 * - Humidity  : 60% (faktor utama pertumbuhan mold)
 * - Temperature: 30% (suhu optimal mold tropis)
 * - Light      : 10% (gelap mempercepat, tapi bukan faktor utama)
 * 
 * Score 0–100
 */
export function calculateMRI(sensor: SensorInput): number {
  let score = 0

  // ── Humidity (max 60 poin) ──────────────────────────
  if (sensor.humidity >= 90)       score += 60 
  else if (sensor.humidity >= 85)  score += 45  
  else if (sensor.humidity >= 80)  score += 30  
  else if (sensor.humidity >= 75)  score += 15  
  else                             score += 0   

  // ── Temperature (max 30 poin) ──────────────────────
  if (sensor.temperature >= 28 && sensor.temperature <= 32)      score += 30  
  else if (sensor.temperature >= 25 && sensor.temperature < 28)  score += 20  
  else if (sensor.temperature > 32 && sensor.temperature <= 35)  score += 20  
  else if (sensor.temperature >= 20 && sensor.temperature < 25)  score += 10  
  else if (sensor.temperature > 35)                              score += 5   
  else                                                           score += 0   

  // ── Light (max 10 poin) ────────────────────────────
  if (sensor.light < 50)        score += 10 
  else if (sensor.light < 200)  score += 5   
  else                          score += 0   

  return Math.min(score, 100)
}

export function getMRIStatus(score: number): MRIStatus {
  if (score < 35)  return "LOW"     
  if (score < 65)  return "MEDIUM"  
  return "HIGH"                     
}