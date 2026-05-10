import { supabase } from "./supabase"

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  return {
    success: true,
    token: data.session?.access_token,
    user: data.user,
  }
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  return { success: !error }
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}