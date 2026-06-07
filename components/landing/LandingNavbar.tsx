import Link from "next/link"

export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/images/logo.png"
            alt="MoldGuard logo"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="text-base font-bold text-indigo-600">MoldGuard</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-slate-500 md:flex">
          <Link href="#about" className="transition hover:text-indigo-600">About</Link>
          <Link href="#features" className="transition hover:text-indigo-600">Features</Link>
          <Link href="#how-it-works" className="transition hover:text-indigo-600">How It Works</Link>
          <Link href="#why" className="transition hover:text-indigo-600">Why MoldGuard</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-800"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  )
}