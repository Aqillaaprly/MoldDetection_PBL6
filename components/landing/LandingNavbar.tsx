import Link from "next/link"

export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-base font-bold text-blue-700"
        >
          MoldGuard
        </Link>

        <div className="hidden items-center gap-8 text-sm text-slate-500 md:flex">
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

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-slate-600 transition hover:text-blue-700 sm:block"
          >
            Login
          </Link>

          <Link
            href="/monitoring"
            className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-800"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  )
}