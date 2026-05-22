/**
 * Wokwi Device Service
 * Handles communication with Wokwi ESP32 simulator
 */

export interface WokwiSensorData {
  deviceId: string
  temperature: number
  humidity: number
  light: number
  timestamp?: string
}

export interface WokwiDeviceStatus {
  deviceId: string
  isOnline: boolean
  lastUpdate: string
  batteryLevel?: number
  signalStrength?: number
}

interface WokwiApiSensorRow {
  device_id?: string
  temperature: number
  humidity: number
  light: number
  created_at: string
}

/**
 * Send sensor data to Next.js API
 * This function is called from the Wokwi ESP32 code
 */
export async function sendSensorDataToAPI(data: WokwiSensorData) {
  try {
    const response = await fetch('/api/sensors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`API response: ${response.status}`)
    }

    const result = await response.json()
    console.log('Sensor data saved:', result)
    return result
  } catch (error) {
    console.error('Failed to send sensor data:', error)
    throw error
  }
}

/**
 * Fetch latest sensor data from API
 */
export async function fetchLatestSensorData() {
  try {
    const response = await fetch('/api/sensors', {
      method: 'GET',
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`API response: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch sensor data:', error)
    return null
  }
}

/**
 * Check if Wokwi device is online
 * A device is considered online if it sent data within the last 30 seconds
 */
export function isWokwiDeviceOnline(lastUpdate: string): boolean {
  const lastUpdateTime = new Date(lastUpdate).getTime()
  const currentTime = new Date().getTime()
  const thirtySeconds = 30 * 1000

  return currentTime - lastUpdateTime < thirtySeconds
}

/**
 * Get device status including online/offline state
 */
export async function getWokwiDeviceStatus(deviceId: string): Promise<WokwiDeviceStatus> {
  const data = await fetchLatestSensorData()

  if (!data || data.length === 0) {
    return {
      deviceId,
      isOnline: false,
      lastUpdate: new Date().toISOString(),
    }
  }

  const deviceData = data[0]
  const isOnline = isWokwiDeviceOnline(deviceData.created_at)

  return {
    deviceId: deviceData.device_id || deviceId,
    isOnline,
    lastUpdate: deviceData.created_at,
    signalStrength: isOnline ? 100 : 0,
  }
}

/**
 * Subscribe to real-time updates from Wokwi
 * Uses polling since WebSocket might not be available in browser environment
 */
export function subscribeToWokwiUpdates(
  callback: (data: WokwiApiSensorRow) => void,
  interval: number = 5000
) {
  const intervalId = setInterval(async () => {
    const data = await fetchLatestSensorData()

    if (Array.isArray(data) && data.length > 0) {
      callback(data[0] as WokwiApiSensorRow)
    }
  }, interval)

  // Return unsubscribe function
  return () => clearInterval(intervalId)
}
