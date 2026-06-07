import { Activity, Bell, Gauge, LayoutDashboard } from "lucide-react"

const features = [
  {
    title: "Live Room Monitoring",
    description: "Check humidity, temperature, and room conditions in real time.",
    icon: Activity,
  },
  {
    title: "Mold Risk Awareness",
    description: "See when your room condition may become risky for mold growth.",
    icon: Gauge,
  },
  {
    title: "Helpful Alerts",
    description: "Get notified when humidity or room conditions need attention.",
    icon: Bell,
  },
  {
    title: "Easy Dashboard",
    description: "View room status, sensor data, and monitoring history in one place.",
    icon: LayoutDashboard,
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="mb-10 text-center md:mb-14">
        <span className="mb-4 inline-block text-sm font-semibold text-indigo-600">
          FEATURES
        </span>
        <h2 className="mb-3 text-2xl font-semibold text-slate-950 md:text-3xl">
          Everything You Need to Monitor Your Space
        </h2>
        <p className="mx-auto max-w-xl text-sm leading-6 text-slate-500">
          MoldGuard is designed to make room monitoring simple, clear, and easy to understand.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.title}
              className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Icon size={20} />
              </div>
              <h3 className="mb-3 text-sm font-semibold text-slate-950">{feature.title}</h3>
              <p className="text-xs leading-5 text-slate-500">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}