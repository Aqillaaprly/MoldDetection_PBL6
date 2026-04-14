export default function ActivityTimeline() {

  const logs = [
    "High humidity detected",
    "Exhaust fan activated",
    "Manual override HVAC",
    "Daily report compiled"
  ]

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">

      <h3 className="font-semibold mb-4">System Activity</h3>

      <ul className="space-y-3">

        {logs.map((log, i) => (
          <li key={i} className="text-sm text-gray-500">
            • {log}
          </li>
        ))}

      </ul>

    </div>
  )
}