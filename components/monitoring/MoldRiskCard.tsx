"use client"

import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"

type MriStatus = "LOW" | "MEDIUM" | "HIGH"

type MriResponse = {
  success?: boolean
  mri?: number
  status?: MriStatus
  message?: string
  error?: string
}

export default function MoldRiskCard() {
  const [risk, setRisk] = useState(0)
  const [status, setStatus] = useState<MriStatus>("LOW")
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchMRI = async () => {
      try {
        const res = await fetch("/api/mri", {
          cache: "no-store",
        })

        const text = await res.text()

        let data: MriResponse

        try {
          data = JSON.parse(text) as MriResponse
        } catch {
          console.error("MRI API returned non-JSON:", text)
          setErrorMessage("MRI API returned invalid response")
          return
        }

        if (!res.ok || data.success === false) {
          console.error("MRI API error:", data)
          setErrorMessage(data.message ?? "Failed to fetch MRI")
          return
        }

        const nextRisk =
          typeof data.mri === "number"
            ? data.mri
            : 0

        const nextStatus =
          data.status === "HIGH" ||
          data.status === "MEDIUM" ||
          data.status === "LOW"
            ? data.status
            : "LOW"

        setRisk(nextRisk)
        setStatus(nextStatus)
        setErrorMessage("")
      } catch (error) {
        console.error("Failed to fetch MRI:", error)
        setErrorMessage("Failed to fetch MRI")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMRI()

    const interval = setInterval(fetchMRI, 5000)

    return () => clearInterval(interval)
  }, [])

  let statusColor = "text-green-600"
  let barColor = "bg-green-600"

  if (status === "HIGH") {
    statusColor = "text-red-600"
    barColor = "bg-red-600"
  } else if (status === "MEDIUM") {
    statusColor = "text-yellow-500"
    barColor = "bg-yellow-500"
  }

  const safeRisk = Math.max(0, Math.min(risk, 100))

  return (
    <div className="
      bg-white dark:bg-gray-900
      p-6 rounded-2xl shadow-sm
      border border-gray-100
      dark:border-gray-800
    ">
      <div className="
        flex justify-between
        items-start mb-4
      ">
        <div>
          <h3 className="font-semibold text-lg">
            Mold Risk Level
          </h3>

          <p className="text-xs text-gray-400">
            MRI calculated based on environmental conditions
          </p>
        </div>

        <AlertTriangle
          className="text-red-500"
          size={20}
        />
      </div>

      {errorMessage && (
        <p className="mb-3 text-xs text-red-500">
          {errorMessage}
        </p>
      )}

      <div className="
        flex justify-between
        items-end mb-3
      ">
        <h2 className={`
          text-3xl font-bold
          ${statusColor}
        `}>
          {isLoading ? "..." : status}
        </h2>

        <span className="
          text-lg font-semibold
          text-gray-700
          dark:text-gray-200
        ">
          {isLoading ? "..." : `${safeRisk}%`}
        </span>
      </div>

      <div className="
        w-full h-3 bg-gray-200
        rounded-full overflow-hidden
      ">
        <div
          className={`
            h-full rounded-full
            transition-all
            ${barColor}
          `}
          style={{
            width: `${safeRisk}%`,
          }}
        />
      </div>
    </div>
  )
}