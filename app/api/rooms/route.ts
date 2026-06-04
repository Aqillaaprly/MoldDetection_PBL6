import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const runtime = "nodejs"

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("rooms")
      .select("*")
      .order("id", { ascending: true })

    if (error) {
      return Response.json(
        {
          success: false,
          message: "Failed to fetch rooms",
          error: error.message,
        },
        { status: 500 }
      )
    }

    return Response.json(
      {
        success: true,
        data: data ?? [],
      },
      { status: 200 }
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}