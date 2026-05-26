import Link from "next/link"

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-sm">
          <h3 className="mb-3 text-base font-bold text-blue-700">
            MoldGuard
          </h3>

          <p className="text-sm leading-6 text-slate-500">
            A smart room monitoring system that helps you notice mold risk
            earlier and keep your indoor space healthier.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-slate-500">
          <Link
            href="#about"
            className="transition hover:text-blue-700"
          >
            About
          </Link>

          <Link
            href="#features"
            className="transition hover:text-blue-700"
          >
            Features
          </Link>

          <Link
            href="#how-it-works"
            className="transition hover:text-blue-700"
          >
            How It Works
          </Link>

          <Link
            href="#why"
            className="transition hover:text-blue-700"
          >
            Why MoldGuard
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-100 px-6 py-5 text-center text-xs text-slate-400">
        © 2026 MoldGuard. All rights reserved.
      </div>
    </footer>
  )
}