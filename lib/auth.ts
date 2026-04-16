export async function login(email: string, password: string) {
  // dummy logic (sementara)
  if (email === "admin@gmail.com" && password === "123") {
    return {
      success: true,
      token: "dummy-token",
    }
  }

  return {
    success: false,
    message: "Invalid credentials",
  }
}