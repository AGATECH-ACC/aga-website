import { NextResponse } from "next/server"

import { verifyAuditLeadEmail } from "@/lib/aiaudit-persistence"

export const runtime = "nodejs"

type RequestBody = {
  leadId?: string
  verificationId?: string
  code?: string
}

export async function POST(request: Request) {
  let body: RequestBody

  try {
    body = (await request.json()) as RequestBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const leadId = String(body.leadId ?? "").trim()
  const verificationId = String(body.verificationId ?? "").trim()
  const code = String(body.code ?? "").trim()

  if (!leadId || !verificationId || !code) {
    return NextResponse.json({ error: "Missing verification fields" }, { status: 400 })
  }

  try {
    await verifyAuditLeadEmail({ leadId, verificationId, code })
    return NextResponse.json({ verified: true })
  } catch (error) {
    console.error("AI audit email verification failed", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Verification failed" }, { status: 400 })
  }
}
