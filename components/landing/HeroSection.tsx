import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2">
      <div>
        <span className="mb-7 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-[10px] font-semibold tracking-wide text-blue-700">
          ● REAL-TIME ROOM MONITORING
        </span>

        <h1 className="mb-5 text-5xl font-bold tracking-tight text-slate-950 md:text-6xl">
          MoldGuard
        </h1>

        <p className="mb-6 max-w-md text-2xl font-semibold leading-tight text-blue-700">
          Keep Your Room Safer from Mold Risk
        </p>

        <p className="mb-8 max-w-md text-sm leading-6 text-slate-600">
          MoldGuard helps you monitor humidity, temperature, and room conditions
          in real time, so you can notice potential mold risks earlier and keep
          your indoor space healthier.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/monitoring"
            className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-800"
          >
            Start Monitoring
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50"
          >
            View Dashboard
          </Link>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-3 shadow-2xl shadow-slate-300">
        <img
            src="/images/landing/hero-dashboard.png"
            alt="MoldGuard dashboard preview"
            className="h-[360px] w-full rounded-2xl object-cover"
        />
        </div>
    </section>
  )
}