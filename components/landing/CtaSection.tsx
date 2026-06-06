import Link from "next/link"

export default function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 px-6 py-14 text-center text-white shadow-xl shadow-indigo-200 md:px-8 md:py-20">
        <h2 className="mx-auto mb-5 max-w-xl text-3xl font-bold leading-tight md:text-4xl">
          Protect Your Space with MoldGuard
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-6 text-indigo-100">
          Start monitoring your room conditions and prevent mold growth before it
          becomes a serious problem. Your health and your environment deserve the
          best intelligence.
        </p>
        <Link
          href="/monitoring"
          className="inline-flex rounded-xl bg-white px-8 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
        >
          Start Monitoring
        </Link>
      </div>
    </section>
  )
}