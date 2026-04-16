function FlowCard({ title }: { title: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg shadow text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
      {title}
    </div>
  )
}

export default function SystemFlow() {
  return (
    <div className="overflow-x-auto">

      <div className="flex items-center gap-4 w-max">

        <FlowCard title="Sensor Collect Data" />
        <span className="text-gray-400">→</span>

        <FlowCard title="Send to Server" />
        <span className="text-gray-400">→</span>

        <FlowCard title="Data Analysis" />
        <span className="text-gray-400">→</span>

        <FlowCard title="Dashboard Monitoring" />
        <span className="text-gray-400">→</span>

        <FlowCard title="Device Automation" />

      </div>

    </div>
  )
}