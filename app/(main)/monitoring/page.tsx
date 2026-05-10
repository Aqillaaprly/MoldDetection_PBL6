"use client"

import { useState, useEffect } from "react"
import { Droplet, Thermometer, Lightbulb } from "lucide-react"
import MonitoringHeader from "@/components/monitoring/MonitoringHeader"
import MetricCard from "@/components/monitoring/MetricCard"
import TrendChart from "@/components/monitoring/TrendChart"
import SensorHubsTable from "@/components/monitoring/SensorHubsTable"
import {
  getSensorHubs,
  getTrendData,
  refreshSensorData
} from "@/services/sensorService"

import { SensorHub, MetricData } from "@/types/sensor"

export default function MonitoringPage() {
  const [sensorHubs, setSensorHubs] = useState<SensorHub[]>([])
  const [trendData, setTrendData] = useState<MetricData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load realtime data
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetch("/api/sensors")

        const [hubs, trends] = await Promise.all([
          getSensorHubs(),
          getTrendData()
        ])

        setSensorHubs(hubs)
        setTrendData(trends)

      } catch (error) {
        console.error("Error loading monitoring data:", error)

      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    const interval = setInterval(loadData, 5000)

    return () => clearInterval(interval)

  }, [])

  // Manual refresh
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)

      await fetch("/api/sensors")

      const hubs = await refreshSensorData()

      setSensorHubs(hubs)

    } catch (error) {
      console.error("Error refreshing sensor data:", error)

    } finally {
      setIsRefreshing(false)
    }
  }

  // Current metrics
  const getCurrentMetrics = () => {
    if (trendData.length === 0) {
      return {
        humidity: 0,
        temperature: 0,
        light: 0
      }
    }

    const latest = trendData[0]

    return {
      humidity: latest.humidity || 0,
      temperature: latest.temperature || 0,
      light: latest.light || 0
    }
  }

  const metrics = getCurrentMetrics()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-indigo-500"></div>

          <p className="mt-4 text-gray-400">
            Loading monitoring data...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">

      {/* Header */}
      <MonitoringHeader
        sensorStatus="online"
        lastUpdate="Just now"
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <MetricCard
          title="Relative Humidity"
          value={metrics.humidity}
          unit="%"
          status={
            metrics.humidity > 70
              ? "HIGH HUMIDITY"
              : "OPTIMAL RANGE"
          }
          icon={<Droplet size={32} />}
          iconColor="text-cyan-500"
        />

        <MetricCard
          title="Ambient Temp"
          value={metrics.temperature}
          unit="°C"
          status={
            metrics.temperature > 28
              ? "HOT"
              : "STABLE"
          }
          icon={<Thermometer size={32} />}
          iconColor="text-orange-500"
        />

        <MetricCard
          title="Lux Intensity"
          value={metrics.light}
          unit=""
          status={
            metrics.light > 600
              ? "HIGH EXPOSURE"
              : "NORMAL"
          }
          icon={<Lightbulb size={32} />}
          iconColor="text-yellow-500"
        />

      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <TrendChart
          title="Humidity Trend"
          data={trendData}
          dataKey="humidity"
        />

        <TrendChart
          title="Temperature Trend"
          data={trendData}
          dataKey="temperature"
        />

        <TrendChart
          title="Light Trend"
          data={trendData}
          dataKey="light"
        />

      </div>

      {/* Sensor Hubs Table */}
      <SensorHubsTable
        data={sensorHubs}
        onRefresh={handleRefresh}
        isLoading={isRefreshing}
      />

    </div>
  )
}