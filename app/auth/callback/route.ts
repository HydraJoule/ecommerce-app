import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Get user profile to determine redirect
      const { data: user } = await supabase.auth.getUser()
      if (user.user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.user.id).single()

        const redirectUrl = profile?.role === "owner" ? "/admin" : "/shop"
        return NextResponse.redirect(`${origin}${redirectUrl}`)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
