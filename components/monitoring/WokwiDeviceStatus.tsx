'use client'

import { useEffect, useState } from 'react'
import { subscribeToWokwiUpdates, isWokwiDeviceOnline } from '@/services/wokwiService'
import { Wifi, WifiOff } from 'lucide-react'

interface WokwiData {
  id: string
  device_id: string
  temperature: number
  humidity: number
  light: number
  source: string
  created_at: string
}

export function WokwiDeviceStatus() {
  const [wokwiData, setWokwiData] = useState<WokwiData | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToWokwiUpdates(
      (data: WokwiData) => {
        setWokwiData(data)
        setIsOnline(isWokwiDeviceOnline(data.created_at))
        setLoading(false)
      },
      3000 // Poll every 3 seconds
    )

    return () => unsubscribe()
  }, [])

  if (loading && !wokwiData) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">Wokwi ESP32</h3>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            isOnline 
              ? 'bg-green-900/30 text-green-400' 
              : 'bg-red-900/30 text-red-400'
          }`}>
            {isOnline ? (
              <Wifi className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Data Display */}
      {wokwiData ? (
        <div className="space-y-4">
          {/* Temperature */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Temperature</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-white">
                {wokwiData.temperature.toFixed(1)}°C
              </span>
              <span className="text-xs text-gray-500">
                {wokwiData.temperature < 20 ? '❄️' : wokwiData.temperature > 30 ? '🔥' : '✓'}
              </span>
            </div>
          </div>

          {/* Humidity */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Humidity</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-white">
                {wokwiData.humidity.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500">
                {wokwiData.humidity > 75 ? '⚠️' : '✓'}
              </span>
            </div>
          </div>

          {/* Light Intensity */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Light Intensity</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-white">
                {wokwiData.light.toFixed(0)} lux
              </span>
            </div>
          </div>

          {/* Device Info */}
          <div className="pt-3 border-t border-gray-700 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Device ID:</span>
              <span className="font-mono">{wokwiData.device_id}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Last Update:</span>
              <span>
                {new Date(wokwiData.created_at).toLocaleTimeString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Source:</span>
              <span className="text-blue-400">{wokwiData.source}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">No data received yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Waiting for Wokwi ESP32 to connect...
          </p>
        </div>
      )}
    </div>
  )
}
