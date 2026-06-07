import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:min-h-[650px] md:grid-cols-2 md:py-20 md:gap-14">
      <div>
        <span className="mb-7 inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-[10px] font-semibold tracking-wide text-indigo-600">
          ● REAL-TIME ROOM MONITORING
        </span>

        <h1 className="mb-5 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl lg:text-6xl">
          MoldGuard
        </h1>

        <p className="mb-6 max-w-md text-xl font-semibold leading-tight text-indigo-600 md:text-2xl">
          Keep Your Room Safer from Mold Risk
        </p>

        <p className="mb-8 max-w-md text-sm leading-6 text-slate-600">
          MoldGuard helps you monitor humidity, temperature, and room conditions
          in real time, so you can notice potential mold risks earlier and keep
          your indoor space healthier.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/register"
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:opacity-90"
          >
            Start Monitoring
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-indigo-600 transition hover:border-indigo-200 hover:bg-indigo-50"
          >
            View Dashboard
          </Link>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-3 shadow-2xl shadow-slate-300">
        <img
          src="/images/landing/hero-dashboard.png"
          alt="MoldGuard dashboard preview"
          className="h-[260px] w-full rounded-2xl object-cover md:h-[360px]"
        />
      </div>
    </section>
  )
}