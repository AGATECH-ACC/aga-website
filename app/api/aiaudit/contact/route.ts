import { NextResponse } from "next/server"

import { saveAuditContactRequest } from "@/lib/aiaudit-persistence"

export const runtime = "nodejs"

type RequestBody = {
  reportId?: string
}

export async function POST(request: Request) {
  let body: RequestBody

  try {
    body = (await request.json()) as RequestBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const reportId = String(body.reportId ?? "").trim()
  if (!reportId) {
    return NextResponse.json({ error: "Missing report id" }, { status: 400 })
  }

  try {
    await saveAuditContactRequest(reportId)
    return NextResponse.json({ saved: true })
  } catch (error) {
    console.error("AI audit contact request save failed", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Contact request save failed" }, { status: 500 })
  }
}
