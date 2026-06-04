import { NextResponse } from "next/server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

type SignupBody = {
  name?: string
  email?: string
}

const resendApiKey = process.env.RESEND_API_KEY ?? ""
const notifyEmail =
  process.env.SUPERINDIVIDUAL_NOTIFY_EMAIL ?? "your-email@example.com"
const fromEmail = "noreply@agaventures.ai"
const whatsappLink = "（WhatsApp链接 - placeholder for now）"
const toolkitLink = "（工具包链接 - placeholder for now）"

export async function POST(request: Request) {
  let body: SignupBody

  try {
    body = (await request.json()) as SignupBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const name = String(body.name ?? "").trim()
  const email = String(body.email ?? "").trim().toLowerCase()

  if (!name) {
    return NextResponse.json({ error: "Missing name" }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  if (!resendApiKey) {
    return NextResponse.json(
      { error: "Email service is not configured" },
      { status: 500 }
    )
  }

  const supabase = createSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 500 }
    )
  }

  const { error: insertError } = await supabase
    .from("superindividual_leads")
    .insert({ name, email, source: "website" })

  if (insertError) {
    console.error("Superindividual signup insert failed", insertError)
    return NextResponse.json({ error: "Signup save failed" }, { status: 500 })
  }

  try {
    await Promise.all([
      sendResendEmail({
        to: email,
        subject: "你的AI工具包来了 🚀",
        text: buildToolkitEmail({ name }),
      }),
      sendResendEmail({
        to: notifyEmail,
        subject: "New superindividual signup",
        text: `New superindividual signup\n\nName: ${name}\nEmail: ${email}\nSource: website`,
      }),
    ])
  } catch (error) {
    console.error("Superindividual signup email failed", error)
    return NextResponse.json({ error: "Signup email failed" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function buildToolkitEmail({ name }: { name: string }) {
  return `Hi ${name},

感谢你加入超级个体实验室！

你的工具包：
${toolkitLink}

记得加入我们的WhatsApp社群：
${whatsappLink}

想到，做到，一瞬间。

Chi Shiong
AGA Ventures`
}

async function sendResendEmail({
  to,
  subject,
  text,
}: {
  to: string
  subject: string
  text: string
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      subject,
      text,
    }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Resend error ${response.status}: ${message}`)
  }
}
