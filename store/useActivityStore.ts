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

export const useActivityStore = create<ActivityState>((set) => ({

  activities: [],

  addActivity: (activity) =>
    set((state) => ({
      activities: [
        {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          ...activity
        },
        ...state.activities
      ]
    }))

}))