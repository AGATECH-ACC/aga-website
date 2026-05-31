import { NextResponse } from "next/server"
import OpenAI from "openai"

import {
  auditReportJsonSchema,
  buildFinancialImpact,
  buildFallbackReport,
  buildReportReferenceId,
  computeAuditScore,
  getAuditSections,
  maturityLabel,
  type AuditLocale,
  type AuditProfile,
  type AuditReport,
  type WorkflowSelection,
} from "@/lib/aiaudit"

export const runtime = "nodejs"

type AuditRequestBody = {
  locale?: string
  profile?: Partial<AuditProfile>
  answers?: Record<string, unknown>
  selectedWorkflows?: Array<Partial<WorkflowSelection>>
}

function normalizeLocale(locale?: string): AuditLocale {
  return locale === "zh" ? "zh" : "en"
}

function normalizeProfile(profile?: Partial<AuditProfile>): AuditProfile {
  return {
    company: String(profile?.company ?? "").trim(),
    industry: String(profile?.industry ?? "").trim(),
    headcount: String(profile?.headcount ?? "").trim(),
    role: String(profile?.role ?? "").trim(),
  }
}

function normalizeAnswers(answers?: Record<string, unknown>) {
  const normalized: Record<string, number> = {}

  Object.entries(answers ?? {}).forEach(([key, value]) => {
    const numericValue = Number(value)
    if (Number.isInteger(numericValue) && numericValue >= 0 && numericValue <= 4) {
      normalized[key] = numericValue
    }
  })

  return normalized
}

function normalizeWorkflows(workflows?: Array<Partial<WorkflowSelection>>): WorkflowSelection[] {
  return (workflows ?? [])
    .map((workflow) => ({
      name: String(workflow.name ?? "").trim(),
      tools: Array.isArray(workflow.tools)
        ? workflow.tools.map((tool) => String(tool).trim()).filter(Boolean)
        : [],
    }))
    .filter((workflow) => workflow.name)
    .slice(0, 12)
}

function fallbackResponse({
  locale,
  profile,
  answers,
  score,
  selectedWorkflows,
  reason,
}: {
  locale: AuditLocale
  profile: AuditProfile
  answers: Record<string, number>
  score: number
  selectedWorkflows: WorkflowSelection[]
  reason: "missing_api_key" | "openai_error"
}) {
  return NextResponse.json({
    source: "fallback",
    reason,
    report: buildFallbackReport({ locale, profile, answers, score, selectedWorkflows }),
  })
}

function buildPrompt({
  locale,
  profile,
  answers,
  selectedWorkflows,
  score,
}: {
  locale: AuditLocale
  profile: AuditProfile
  answers: Record<string, number>
  selectedWorkflows: WorkflowSelection[]
  score: number
}) {
  const sections = getAuditSections(locale).map((section) => ({
    id: section.id,
    label: section.label,
    answers: section.questions.map((question) => ({
      id: question.id,
      question: question.text,
      answerIndex: answers[question.id],
      answer: answers[question.id] === undefined ? null : question.options[answers[question.id]],
      score: answers[question.id] === undefined ? null : question.scores[answers[question.id]],
    })),
  }))
  const revenueLeak = buildFinancialImpact({ locale, profile, answers, score, selectedWorkflows })
  const reportReferenceId = buildReportReferenceId({ profile, score, selectedWorkflows })
  const deterministicReport = buildFallbackReport({ locale, profile, answers, score, selectedWorkflows })

  return JSON.stringify({
    language: locale === "zh" ? "Simplified Chinese" : "English",
    instruction:
      locale === "zh"
        ? "请为马来西亚 SME 老板生成专业、具体、可执行的 AI 审计报告。品牌术语 OneSystem, OneIntelligence, Workflow Registry, Business DNA, Cortex 保持英文。"
        : "Generate a professional, specific, actionable AI audit report for a Malaysian SME owner. Keep brand terms OneSystem, OneIntelligence, Workflow Registry, Business DNA, and Cortex in English.",
    companyProfile: profile,
    aiReadinessScore: score,
    maturity: maturityLabel(score, locale),
    reportReferenceId,
    deterministicFinancialImpact: revenueLeak,
    deterministicAllocations: {
      painPoints: deterministicReport.top_pain_points.map((item) => ({
        title: item.title,
        monthly_impact_rm: item.monthly_impact_rm,
      })),
      workflows: deterministicReport.workflow_analysis.map((workflow) => ({
        name: workflow.name,
        monthly_waste_rm: workflow.monthly_waste_rm,
      })),
    },
    auditSections: sections,
    selectedWorkflows,
    outputRules: [
      "Return only valid JSON matching the provided schema.",
      "Do not use markdown.",
      "Preserve reportReferenceId exactly as report_reference_id.",
      "Preserve deterministicFinancialImpact numbers exactly as revenue_leak.",
      "Use deterministicFinancialImpact as the source of truth for pain point and workflow RM allocations.",
      "Use deterministicAllocations as the preferred monthly_impact_rm and monthly_waste_rm values; rewrite titles and descriptions only if useful.",
      "Keep recommendations practical for SME owners.",
      "Mention AGA OneSystem and OneIntelligence where relevant.",
      "Use realistic Malaysian implementation timelines and investment ranges.",
    ],
  })
}

function isAuditReport(value: unknown): value is AuditReport {
  if (!value || typeof value !== "object") return false
  const report = value as Partial<AuditReport>
  return (
    typeof report.report_reference_id === "string" &&
    !!report.revenue_leak &&
    !!report.company_diagnosis &&
    !!report.benchmark &&
    typeof report.executive_summary === "string" &&
    Array.isArray(report.top_pain_points) &&
    !!report.maturity_breakdown &&
    Array.isArray(report.workflow_analysis) &&
    Array.isArray(report.priority_roadmap) &&
    !!report.before_after_vision &&
    typeof report.one_intelligence_verdict === "string" &&
    typeof report.urgency_statement === "string" &&
    typeof report.cta_message === "string"
  )
}

export async function POST(request: Request) {
  let body: AuditRequestBody

  try {
    body = (await request.json()) as AuditRequestBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const locale = normalizeLocale(body.locale)
  const profile = normalizeProfile(body.profile)
  const answers = normalizeAnswers(body.answers)
  const selectedWorkflows = normalizeWorkflows(body.selectedWorkflows)
  const score = computeAuditScore(answers, locale)

  if (!process.env.OPENAI_API_KEY) {
    return fallbackResponse({ locale, profile, answers, score, selectedWorkflows, reason: "missing_api_key" })
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are AGA Ventures' senior AI transformation consultant. You diagnose workflow maturity and produce concise implementation reports for SME owners.",
        },
        {
          role: "user",
          content: buildPrompt({ locale, profile, answers, selectedWorkflows, score }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "ai_audit_report",
          schema: auditReportJsonSchema,
          strict: true,
        },
      },
    })

    const parsed = JSON.parse(response.output_text)

    if (!isAuditReport(parsed)) {
      throw new Error("OpenAI response did not match the audit report shape")
    }

    return NextResponse.json({ source: "openai", report: parsed })
  } catch (error) {
    console.error("AI audit report generation failed", error)
    return fallbackResponse({ locale, profile, answers, score, selectedWorkflows, reason: "openai_error" })
  }
}
