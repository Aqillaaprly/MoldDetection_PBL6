import { NextResponse } from "next/server"

export async function POST(req: Request) {

  const { email, password } = await req.json()

  if (email === "admin@mail.com" && password === "123456") {

    const response = NextResponse.json({ success: true })

    response.cookies.set("token", "loggedin", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24
    })

    return response
  }

  return NextResponse.json(
    { error: "Invalid login" },
    { status: 401 }
  )
}