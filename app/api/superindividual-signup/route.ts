import { NextResponse } from "next/server"

import { superindividualWhatsAppLink } from "@/lib/superindividual/constants"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

type SignupBody = {
  name?: string
  email?: string
}

const resendApiKey = process.env.RESEND_API_KEY ?? ""
const adminEmail = process.env.ADMIN_EMAIL ?? ""
const fromEmail = "AGA Ventures <noreply@agaventures.ai>"
const toolkitBaseUrl = "https://www.agaventures.ai/superindividual/toolkit"

type LeadRecord = {
  id: string
  name: string
  email: string
  access_token: string
  tier: string
  source: string
  created_at: string
}

export async function POST(request: Request) {
  let body: SignupBody

  try {
    body = (await request.json()) as SignupBody
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    )
  }

  const name = String(body.name ?? "").trim()
  const email = String(body.email ?? "").trim().toLowerCase()

  if (!name) {
    return NextResponse.json(
      { success: false, message: "Missing name" },
      { status: 400 }
    )
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { success: false, message: "Invalid email" },
      { status: 400 }
    )
  }

  if (!resendApiKey || !adminEmail) {
    return NextResponse.json(
      { success: false, message: "Email service is not configured" },
      { status: 500 }
    )
  }

  const supabase = createSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json(
      { success: false, message: "Supabase is not configured" },
      { status: 500 }
    )
  }

  let lead: LeadRecord | null = null

  const { data: existingLead, error: existingError } = await supabase
    .from("superindividual_leads")
    .select("id,name,email,access_token,tier,source,created_at")
    .eq("email", email)
    .maybeSingle()

  if (existingError) {
    console.error("Superindividual signup lookup failed", existingError)
    return NextResponse.json(
      { success: false, message: "Signup lookup failed" },
      { status: 500 }
    )
  }

  if (existingLead) {
    lead = existingLead as LeadRecord
  } else {
    const { data: insertedLead, error: insertError } = await supabase
      .from("superindividual_leads")
      .insert({ name, email, source: "website" })
      .select("id,name,email,access_token,tier,source,created_at")
      .single()

    if (insertError) {
      console.error("Superindividual signup insert failed", insertError)
      return NextResponse.json(
        { success: false, message: "Signup save failed" },
        { status: 500 }
      )
    }

    lead = insertedLead as LeadRecord
  }

  try {
    await Promise.all([
      sendResendEmail({
        to: lead.email,
        subject: "你的AI工具包来了 🚀 | 超级个体实验室",
        html: buildToolkitEmailHtml({ lead }),
        text: buildToolkitEmailText({ lead }),
      }),
      sendResendEmail({
        to: adminEmail,
        subject: `新成员加入！${lead.name} (${lead.email})`,
        text: buildAdminNotificationEmail({ lead }),
      }),
    ])
  } catch (error) {
    console.error("Superindividual signup email failed", error)
    return NextResponse.json(
      { success: false, message: "Signup email failed" },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, message: "邮件已发送" })
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getToolkitUrl(accessToken: string) {
  return `${toolkitBaseUrl}?id=${encodeURIComponent(accessToken)}`
}

function buildToolkitEmailHtml({ lead }: { lead: LeadRecord }) {
  const toolkitUrl = getToolkitUrl(lead.access_token)
  const safeName = escapeHtml(lead.name)
  const safeToolkitUrl = escapeHtml(toolkitUrl)
  const safeWhatsAppLink = escapeHtml(superindividualWhatsAppLink)

  return `<!doctype html>
<html lang="zh">
  <body style="margin:0;background:#f5f7fb;font-family:Arial,'PingFang SC','Microsoft YaHei',sans-serif;color:#1E2A3A;">
    <div style="max-width:640px;margin:0 auto;padding:32px 18px;">
      <div style="background:#ffffff;border-radius:24px;padding:32px;border:1px solid #e6eaf0;">
        <p style="margin:0 0 18px;font-size:16px;line-height:1.7;">Hi ${safeName}，</p>
        <h1 style="margin:0 0 18px;font-size:26px;line-height:1.25;color:#1E2A3A;">欢迎加入超级个体实验室！🎉</h1>
        <p style="margin:0 0 22px;font-size:16px;line-height:1.8;">你的专属工具包已经准备好了。<br />点击下面的按钮，马上进入：</p>
        <p style="margin:28px 0;text-align:center;">
          <a href="${safeToolkitUrl}" style="display:inline-block;background:#E8521A;color:#ffffff;text-decoration:none;font-weight:800;padding:16px 26px;border-radius:999px;">进入我的工具包 →</a>
        </p>
        <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#5d6673;">⚠️ 这个链接是你专属的，请不要分享给别人。</p>
        <h2 style="font-size:18px;margin:0 0 12px;color:#1E2A3A;">里面有什么？</h2>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.9;">
          ✅ 5个底层原则卡片<br />
          ✅ Prompt模板包<br />
          ✅ AI工具入门指南<br />
          ✅ 超级个体每日清单
        </p>
        <h2 style="font-size:18px;margin:0 0 12px;color:#1E2A3A;">下一步：</h2>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.8;">加入我们的WhatsApp社群「超级个体实验室」<br />和一群想要突破的人一起成长。</p>
        <p style="margin:24px 0;text-align:center;">
          <a href="${safeWhatsAppLink}" style="display:inline-block;background:#25D366;color:#0F1923;text-decoration:none;font-weight:800;padding:15px 24px;border-radius:999px;">加入WhatsApp社群 →</a>
        </p>
        <p style="margin:28px 0 0;font-size:16px;line-height:1.8;">想到，做到，一瞬间。</p>
        <p style="margin:22px 0 0;font-size:15px;line-height:1.7;">Chi Shiong<br />AGA Ventures<br />agaventures.ai</p>
      </div>
    </div>
  </body>
</html>`
}

function buildToolkitEmailText({ lead }: { lead: LeadRecord }) {
  return `Hi ${lead.name}，

欢迎加入超级个体实验室！🎉

你的专属工具包已经准备好了。
点击下面的链接，马上进入：

${getToolkitUrl(lead.access_token)}

⚠️ 这个链接是你专属的，请不要分享给别人。

里面有什么？
✅ 5个底层原则卡片
✅ Prompt模板包
✅ AI工具入门指南
✅ 超级个体每日清单

下一步：
加入我们的WhatsApp社群「超级个体实验室」
和一群想要突破的人一起成长。

${superindividualWhatsAppLink}

想到，做到，一瞬间。

Chi Shiong
AGA Ventures
agaventures.ai`
}

function buildAdminNotificationEmail({ lead }: { lead: LeadRecord }) {
  return `新成员注册时间：${lead.created_at}
姓名：${lead.name}
邮箱：${lead.email}
来源：${lead.source}
Access Token：${lead.access_token}`
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

async function sendResendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html?: string
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
      html,
      text,
    }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Resend error ${response.status}: ${message}`)
  }
}
