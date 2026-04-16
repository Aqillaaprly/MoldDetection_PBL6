"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await login(email, password)

    if (res.success) {
      document.cookie = `token=${res.token}; path=/`
      router.push("/")
    } else {
      alert(res.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">

      <div className="w-[900px] md:w-[1000px] h-[420px] backdrop-blur-xl bg-white/80 rounded-2xl shadow-[0_20px_60px_rgba(99,102,241,0.25)] overflow-hidden grid grid-cols-2 animate-fadeIn">

        {/* LEFT */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2">Hello!</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Sign in to your account
          </p>

          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-indigo-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-indigo-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:scale-[1.02] hover:shadow-lg transition"
            >
              Sign In
            </button>

          </form>
        </div>

        {/* RIGHT */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 flex items-center justify-center text-white relative">

          <div className="absolute w-40 h-40 bg-white/20 rounded-full blur-3xl top-10 left-10"></div>

          <div className="text-center z-10">
            <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
            <p className="text-white/80 text-sm">
              Monitor and control your environment easily
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}