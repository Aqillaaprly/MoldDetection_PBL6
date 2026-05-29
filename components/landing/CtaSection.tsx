import Link from "next/link"

export default function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="rounded-[2rem] bg-blue-700 px-8 py-20 text-center text-white shadow-xl shadow-blue-200">
        <h2 className="mx-auto mb-5 max-w-xl text-4xl font-bold leading-tight">
          Protect Your Space with MoldGuard
        </h2>

        <p className="mx-auto mb-8 max-w-xl text-sm leading-6 text-blue-100">
          Start monitoring your room conditions and prevent mold growth before it
          becomes a serious problem. Your health and your environment deserve the
          best intelligence.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex rounded-xl bg-white px-8 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Get Started Free
          </Link>

          <Link
            href="/login"
            className="inline-flex rounded-xl border border-white/30 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  )
}