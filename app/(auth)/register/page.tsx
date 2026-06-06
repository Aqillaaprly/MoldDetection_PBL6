"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("Password tidak cocok")
      return
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    setLoading(true)

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError("Cek email kamu untuk konfirmasi akun, lalu login.")
      setLoading(false)
      return
    }

    if (signInData.user) {
      await supabase.from("profiles").upsert({ id: signInData.user.id, name })
      router.push("/onboarding")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 p-4">
      <div className="w-full max-w-5xl backdrop-blur-xl bg-white/80 rounded-2xl shadow-[0_20px_60px_rgba(99,102,241,0.25)] overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-fadeIn">

        {/* LEFT — Form */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-500 mb-6 text-sm">Register to start monitoring</p>

          {error && (
            <div className="mb-4 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-indigo-400 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              required
              className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-indigo-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password (min. 6 karakter)"
              required
              className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-indigo-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              required
              className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-indigo-400 transition"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:scale-[1.02] hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-gray-400 text-center mt-4">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>

        {/* RIGHT — Branding */}
        <div className="hidden md:flex bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 items-center justify-center text-white relative">
          <div className="absolute w-40 h-40 bg-white/20 rounded-full blur-3xl top-10 left-10" />
          <div className="absolute w-24 h-24 bg-white/10 rounded-full blur-2xl bottom-10 right-10" />

          <div className="text-center z-10 px-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-2">Get Started!</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Setup rooms dan mulai monitor pertumbuhan jamur di rumahmu
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}