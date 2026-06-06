import {
  Home,
  CookingPot,
  Bath,
  Bed,
  Tv,
  BriefcaseBusiness
} from "lucide-react"

import { SensorHub } from "@/types/sensor"

export type RiskLevel =
  | "HIGH RISK"
  | "MEDIUM RISK"
  | "NORMAL"
  | "OFFLINE"

export function getRiskLevel(
  hub: SensorHub
): RiskLevel {
  if (!hub.is_online) {
    return "OFFLINE"
  }

  if (hub.moldRisk === "HIGH") {
    return "HIGH RISK"
  }

  if (hub.moldRisk === "MEDIUM") {
    return "MEDIUM RISK"
  }

  return "NORMAL"
}

export function getRiskConfig(risk: RiskLevel) {
  switch (risk) {
    case "HIGH RISK":
      return {
        badge: "bg-red-100 text-red-600 border border-red-200",
        border: "border-red-300",
        glow: "shadow-red-100"
      }

    case "MEDIUM RISK":
      return {
        badge: "bg-orange-100 text-orange-600 border border-orange-200",
        border: "border-orange-200",
        glow: "shadow-orange-50"
      }

    case "NORMAL":
      return {
        badge: "bg-green-100 text-green-600 border border-green-200",
        border: "border-gray-200",
        glow: ""
      }

    case "OFFLINE":
      return {
        badge: "bg-gray-100 text-gray-500 border border-gray-200",
        border: "border-gray-200",
        glow: ""
      }
  }
}

export function getRoomIcon(location: string) {
  const l = location.toLowerCase()

  if (l.includes("living")) {
    return {
      icon: Tv,
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
      color: "text-indigo-600"
    }
  }

  if (l.includes("bedroom") || l.includes("bed")) {
    return {
      icon: Bed,
      bg: "bg-purple-100 dark:bg-purple-900/30",
      color: "text-purple-600"
    }
  }

  if (l.includes("kitchen")) {
    return {
      icon: CookingPot,
      bg: "bg-orange-100 dark:bg-orange-900/30",
      color: "text-orange-600"
    }
  }

  if (l.includes("bath")) {
    return {
      icon: Bath,
      bg: "bg-cyan-100 dark:bg-cyan-900/30",
      color: "text-cyan-600"
    }
  }

  if (l.includes("office")) {
    return {
      icon: BriefcaseBusiness,
      bg: "bg-blue-100 dark:bg-blue-900/30",
      color: "text-blue-600"
    }
  }

  return {
    icon: Home,
    bg: "bg-gray-100 dark:bg-gray-800",
    color: "text-gray-600"
  }
}