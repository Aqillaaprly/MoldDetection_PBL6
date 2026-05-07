export default function Preferences({
  theme, setTheme,
  language, setLanguage,
  temperatureUnit, setTemperatureUnit
}: any) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">

      <h2 className="font-semibold text-lg">Preferences</h2>

      <div className="grid md:grid-cols-3 gap-4">

        <div className="space-y-1">
          <label className="text-sm text-gray-500">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-sm"
          >
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-500">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-sm"
          >
            <option>English</option>
            <option>Indonesia</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-500">Temperature</label>
          <select
            value={temperatureUnit}
            onChange={(e) => setTemperatureUnit(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-sm"
          >
            <option value="C">Celsius (°C)</option>
            <option value="F">Fahrenheit (°F)</option>
          </select>
        </div>

      </div>

    </div>
  )
}