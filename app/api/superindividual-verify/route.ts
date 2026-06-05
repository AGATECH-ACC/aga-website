import { NextResponse } from "next/server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

type LeadRecord = {
  name: string
  email: string
  tier: string
  access_count: number | null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const accessToken = String(searchParams.get("id") ?? "").trim()

  if (!isUuid(accessToken)) {
    return NextResponse.json({ valid: false })
  }

  const supabase = createSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json(
      { valid: false, message: "Supabase is not configured" },
      { status: 500 }
    )
  }

  const { data: lead, error } = await supabase
    .from("superindividual_leads")
    .select("name,email,tier,access_count")
    .eq("access_token", accessToken)
    .maybeSingle()

  if (error) {
    console.error("Superindividual verify lookup failed", error)
    return NextResponse.json(
      { valid: false, message: "Verification failed" },
      { status: 500 }
    )
  }

  if (!lead) {
    return NextResponse.json({ valid: false })
  }

  const typedLead = lead as LeadRecord
  const { error: updateError } = await supabase
    .from("superindividual_leads")
    .update({
      last_accessed: new Date().toISOString(),
      access_count: (typedLead.access_count ?? 0) + 1,
    })
    .eq("access_token", accessToken)

  if (updateError) {
    console.error("Superindividual verify access log failed", updateError)
  }

  return NextResponse.json({
    valid: true,
    user: {
      name: typedLead.name,
      email: typedLead.email,
      tier: typedLead.tier ?? "free",
    },
  })
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  )
}
