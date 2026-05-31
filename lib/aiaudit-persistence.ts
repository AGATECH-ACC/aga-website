import { createHash, randomInt } from "crypto"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import type { AuditLocale, AuditProfile, AuditReport, WorkflowSelection } from "@/lib/aiaudit"

const verificationTtlMinutes = 15
const maxVerificationAttempts = 6

export type AuditLeadRecord = {
  id: string
  email: string
  email_verified_at: string | null
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function hashCode(code: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "aga-ai-audit"
  return createHash("sha256").update(`${code}:${secret}`).digest("hex")
}

function createVerificationCode() {
  return String(randomInt(100000, 1000000))
}

async function sendVerificationEmail({ email, code, locale }: { email: string; code: string; locale: AuditLocale }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL || "AGA Ventures <onboarding@resend.dev>"

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      return { id: "dev-resend-disabled", devCode: code }
    }
    throw new Error("RESEND_API_KEY is not configured")
  }

  const subject = locale === "zh" ? "你的 AGA AI 审计验证码" : "Your AGA AI Audit verification code"
  const html =
    locale === "zh"
      ? `<p>你的验证码是：</p><h1>${code}</h1><p>验证码将在 ${verificationTtlMinutes} 分钟后失效。</p>`
      : `<p>Your verification code is:</p><h1>${code}</h1><p>This code expires in ${verificationTtlMinutes} minutes.</p>`

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject,
      html,
      tags: [{ name: "flow", value: "ai_audit" }],
    }),
  })

  const payload = (await response.json().catch(() => ({}))) as { id?: string; message?: string }

  if (!response.ok) {
    throw new Error(payload.message || "Resend email failed")
  }

  return { id: payload.id ?? "" }
}

export async function createAuditLeadAndSendVerification({
  locale,
  profile,
}: {
  locale: AuditLocale
  profile: AuditProfile
}) {
  const supabase = createSupabaseAdminClient()
  if (!supabase) throw new Error("Supabase service role is not configured")

  const email = normalizeEmail(profile.email)
  if (!isValidEmail(email)) throw new Error("Invalid email")

  const { data: lead, error: leadError } = await supabase
    .schema("cms")
    .from("ai_audit_leads")
    .insert({
      locale,
      email,
      company: profile.company,
      industry: profile.industry,
      headcount: profile.headcount,
      role: profile.role,
      last_verification_sent_at: new Date().toISOString(),
    })
    .select("id,email,email_verified_at")
    .single()

  if (leadError || !lead) throw leadError ?? new Error("Failed to create audit lead")

  const code = createVerificationCode()
  const expiresAt = new Date(Date.now() + verificationTtlMinutes * 60 * 1000).toISOString()
  const delivery = await sendVerificationEmail({ email, code, locale })

  const { data: verification, error: verificationError } = await supabase
    .schema("cms")
    .from("ai_audit_email_verifications")
    .insert({
      lead_id: lead.id,
      email,
      code_hash: hashCode(code),
      expires_at: expiresAt,
      resend_email_id: delivery.id,
    })
    .select("id")
    .single()

  if (verificationError || !verification) throw verificationError ?? new Error("Failed to create verification")

  return {
    leadId: lead.id as string,
    verificationId: verification.id as string,
    devCode: delivery.devCode,
  }
}

export async function verifyAuditLeadEmail({
  leadId,
  verificationId,
  code,
}: {
  leadId: string
  verificationId: string
  code: string
}) {
  const supabase = createSupabaseAdminClient()
  if (!supabase) throw new Error("Supabase service role is not configured")

  const { data: verification, error } = await supabase
    .schema("cms")
    .from("ai_audit_email_verifications")
    .select("id,lead_id,code_hash,expires_at,verified_at,attempts")
    .eq("id", verificationId)
    .eq("lead_id", leadId)
    .single()

  if (error || !verification) throw error ?? new Error("Verification not found")
  if (verification.verified_at) return true
  if (new Date(String(verification.expires_at)).getTime() < Date.now()) throw new Error("Verification code expired")
  if (Number(verification.attempts) >= maxVerificationAttempts) throw new Error("Too many verification attempts")

  const valid = verification.code_hash === hashCode(code.trim())

  if (!valid) {
    await supabase
      .schema("cms")
      .from("ai_audit_email_verifications")
      .update({ attempts: Number(verification.attempts) + 1 })
      .eq("id", verificationId)
    throw new Error("Invalid verification code")
  }

  const now = new Date().toISOString()
  const { error: updateVerificationError } = await supabase
    .schema("cms")
    .from("ai_audit_email_verifications")
    .update({ verified_at: now })
    .eq("id", verificationId)

  if (updateVerificationError) throw updateVerificationError

  const { error: updateLeadError } = await supabase
    .schema("cms")
    .from("ai_audit_leads")
    .update({ email_verified_at: now })
    .eq("id", leadId)

  if (updateLeadError) throw updateLeadError

  return true
}

export async function getVerifiedAuditLead(leadId: string): Promise<AuditLeadRecord | null> {
  const supabase = createSupabaseAdminClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .schema("cms")
    .from("ai_audit_leads")
    .select("id,email,email_verified_at")
    .eq("id", leadId)
    .single()

  if (error || !data?.email_verified_at) return null
  return data as AuditLeadRecord
}

export async function saveAuditReport({
  leadId,
  locale,
  profile,
  answers,
  selectedWorkflows,
  score,
  source,
  report,
}: {
  leadId: string
  locale: AuditLocale
  profile: AuditProfile
  answers: Record<string, number>
  selectedWorkflows: WorkflowSelection[]
  score: number
  source: "openai" | "fallback"
  report: AuditReport
}) {
  const supabase = createSupabaseAdminClient()
  if (!supabase) throw new Error("Supabase service role is not configured")

  const { data, error } = await supabase
    .schema("cms")
    .from("ai_audit_reports")
    .insert({
      lead_id: leadId,
      report_reference_id: report.report_reference_id,
      locale,
      profile,
      answers,
      selected_workflows: selectedWorkflows,
      score,
      source,
      report,
    })
    .select("id")
    .single()

  if (error || !data) throw error ?? new Error("Failed to save audit report")

  await supabase
    .schema("cms")
    .from("ai_audit_leads")
    .update({ generated_report_at: new Date().toISOString() })
    .eq("id", leadId)

  return data.id as string
}

export async function saveAuditContactRequest(reportId: string) {
  const supabase = createSupabaseAdminClient()
  if (!supabase) throw new Error("Supabase service role is not configured")

  const now = new Date().toISOString()
  const { data, error } = await supabase
    .schema("cms")
    .from("ai_audit_reports")
    .update({ contact_requested_at: now })
    .eq("id", reportId)
    .select("lead_id")
    .single()

  if (error || !data) throw error ?? new Error("Failed to save contact request")

  await supabase
    .schema("cms")
    .from("ai_audit_leads")
    .update({ contact_requested_at: now })
    .eq("id", data.lead_id)

  return true
}
