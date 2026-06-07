import { create } from "zustand"

interface Activity {
  id: string
  title: string
  description: string
  type: "alert" | "success" | "manual" | "report"
  createdAt: string
}

interface ActivityState {
  activities: Activity[]
  addActivity: (activity: Omit<Activity, "id" | "createdAt">) => void
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],

  addActivity: (activity) =>
    set((state) => ({
      activities: [
        {
          id: generateId(),
          createdAt: new Date().toISOString(),
          ...activity,
        },
        ...state.activities,
      ],
    })),
}))