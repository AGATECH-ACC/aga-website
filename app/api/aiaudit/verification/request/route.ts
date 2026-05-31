import { NextResponse } from "next/server"

import { createAuditLeadAndSendVerification } from "@/lib/aiaudit-persistence"
import type { AuditLocale, AuditProfile } from "@/lib/aiaudit"

export const runtime = "nodejs"

type RequestBody = {
  locale?: string
  profile?: Partial<AuditProfile>
}

function normalizeLocale(locale?: string): AuditLocale {
  return locale === "zh" ? "zh" : "en"
}

function normalizeProfile(profile?: Partial<AuditProfile>): AuditProfile {
  return {
    company: String(profile?.company ?? "").trim(),
    email: String(profile?.email ?? "").trim(),
    industry: String(profile?.industry ?? "").trim(),
    headcount: String(profile?.headcount ?? "").trim(),
    role: String(profile?.role ?? "").trim(),
  }
}

export async function POST(request: Request) {
  let body: RequestBody

  try {
    body = (await request.json()) as RequestBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const locale = normalizeLocale(body.locale)
  const profile = normalizeProfile(body.profile)

  if (!profile.company || !profile.email || !profile.industry || !profile.headcount || !profile.role) {
    return NextResponse.json({ error: "Missing required profile fields" }, { status: 400 })
  }

  try {
    const result = await createAuditLeadAndSendVerification({ locale, profile })
    return NextResponse.json(result)
  } catch (error) {
    console.error("AI audit email verification request failed", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Verification request failed" }, { status: 500 })
  }
}
