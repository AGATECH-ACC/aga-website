import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const locale = url.searchParams.get("locale") === "zh" ? "zh" : "en"
  const slug = url.searchParams.get("slug")
  const secret = process.env.PREVIEW_SECRET

  if (!slug || !secret) {
    return NextResponse.redirect(new URL(`/${locale}/insights`, url.origin))
  }

  const response = NextResponse.redirect(new URL(`/${locale}/insights/${slug}?preview=true`, url.origin))
  response.cookies.set("aga_preview_secret", secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 30,
  })

  return response
}
