import SensorCard from "@/components/dashboard/SensorCard"
import DeviceToggle from "@/components/dashboard/DeviceToggle"
import ActivityTimeline from "@/components/dashboard/ActivityTimeline"
import AnalyticsChart from "@/components/dashboard/AnalyticsChart"

export default function Dashboard() {

  return (
    <div className="space-y-6">

      <SensorCard />

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">

          <AnalyticsChart />

          <DeviceToggle />

        </div>

        <ActivityTimeline />

      </div>

    </div>
  )
}