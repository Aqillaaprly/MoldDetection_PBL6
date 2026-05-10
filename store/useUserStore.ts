import { create } from "zustand"

interface UserStore {

  selectedUserType: string

  setSelectedUserType: (
    user: string
  ) => void

}

export const useUserStore =
  create<UserStore>((set) => ({

    selectedUserType: "Home Owner",

    setSelectedUserType: (
      user
    ) => set({

      selectedUserType: user

    })

}))