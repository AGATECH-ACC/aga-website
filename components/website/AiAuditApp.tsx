"use client"

import Link from "next/link"
import { useId, useMemo, useRef, useState } from "react"
import {
  ArrowRight,
  AlertTriangle,
  BarChart3,
  Bot,
  Building2,
  Check,
  ChevronDown,
  Clock,
  Download,
  Flame,
  Gauge,
  LineChart,
  Loader2,
  MessageCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  Workflow,
} from "lucide-react"

import {
  buildFallbackReport,
  computeAuditScore,
  getAuditSections,
  headcounts,
  industries,
  industryWorkflows,
  inferWorkflowMaturity,
  maturityLabel,
  roles,
  toolCategories,
  uiText,
  workflowDefinitions,
  workflowMaturityColors,
  workflowMaturityLabels,
  type AuditLocale,
  type AuditProfile,
  type AuditReport,
  type WorkflowSelection,
} from "@/lib/aiaudit"
import { cn } from "@/lib/utils"

type Screen = "gate" | "profile" | "audit" | "workflows" | "analyzing" | "results"

type AiAuditAppProps = {
  locale: AuditLocale
}

const industryLabels: Record<AuditLocale, Record<string, string>> = {
  en: Object.fromEntries(industries.map((industry) => [industry, industry])),
  zh: {
    Manufacturing: "制造业",
    "F&B / Restaurant": "餐饮业",
    Retail: "零售业",
    "Logistics / Transport": "物流 / 运输",
    "Professional Services": "专业服务",
    "Construction / Property": "建筑 / 房地产",
    "Healthcare / Clinic": "医疗 / 诊所",
    Education: "教育",
    "Finance / Accounting": "财务 / 会计",
    "Technology / IT": "科技 / IT",
    "Trading / Wholesale": "批发贸易",
    Other: "其他",
  },
}

const headcountLabels: Record<AuditLocale, Record<string, string>> = {
  en: Object.fromEntries(headcounts.map((headcount) => [headcount, headcount])),
  zh: {
    "1-10 staff": "1-10 人",
    "11-20 staff": "11-20 人",
    "21-50 staff": "21-50 人",
    "51-100 staff": "51-100 人",
    "100+ staff": "100 人以上",
  },
}

const roleLabels: Record<AuditLocale, Record<string, string>> = {
  en: Object.fromEntries(roles.map((role) => [role, role])),
  zh: {
    "Founder / Owner": "创办人 / 老板",
    "CEO / Managing Director": "CEO / 董事经理",
    "Executive Director": "执行董事",
    "COO / Operations Head": "COO / 运营负责人",
    "Business Partner": "业务合伙人",
  },
}

const copy = {
  en: {
    navTitle: "AGA AI Audit",
    navSubtitle: "OneSystem readiness check",
    switchLanguage: "中文",
    heroEyebrow: "AI READINESS AUDIT",
    heroTitle: "Find out what your business should systemize first.",
    heroBody:
      "AGA maps your pain points, current systems, workflow tools, and AI readiness into a practical roadmap for OneSystem and OneIntelligence.",
    start: "Start audit",
    estimated: "8 min assessment",
    secure: "Server-side OpenAI report",
    profileMissing: "Complete every profile field to continue.",
    auditStep: "STEP 2 OF 4 · AI READINESS",
    auditTitle: "Score your business reality",
    auditDescription: "Choose the answer that best reflects today, not the version you wish existed.",
    previous: "Previous",
    next: "Next",
    continueWorkflows: "Continue to workflows",
    expand: "Map tools",
    collapse: "Close",
    remove: "Remove",
    add: "Add",
    addCustom: "Add workflow",
    customPlaceholder: "Example: Franchise onboarding",
    selectedTools: "Selected tools",
    noTools: "No tools selected yet",
    manual: "Manual only",
    sourceOpenai: "Generated with OpenAI",
    sourceFallback: "Generated with local fallback",
    score: "AI readiness score",
    maturity: "Maturity",
    painPoints: "Top pain points",
    breakdown: "Maturity breakdown",
    recommended: "Recommended platform",
    currentTools: "Current tools",
    addTools: "Tools to add",
    retireTools: "Tools to retire",
    upgradePath: "Upgrade path",
    keyActions: "Key actions",
    expectedRoi: "Expected ROI",
    investment: "Investment range",
    whatsappText: "Hi AGA Ventures! I completed the AI Audit and would like to discuss my report.",
    tabs: { overview: "Overview", workflows: "Workflows", roadmap: "Roadmap" },
    revenueLeak: "Revenue leak",
    perMonth: "/month",
    wastedHours: "hours wasted/week",
    yearlyLeak: "yearly impact",
    weeklyDelay: "weekly delay cost",
    whatWeSee: "What we see in your company",
    competitorThreat: "Competitor threat",
    benchmark: "Benchmark",
    monthlyImpact: "Monthly impact",
    today: "Today",
    in12Months: "In 12 months",
    monthlyWaste: "Monthly waste",
    verdict: "AGA OneIntelligence verdict",
    costOfInaction: "Cost of inaction",
    threeMonths: "3 months",
    reportRef: "Report reference",
  },
  zh: {
    navTitle: "AGA AI 审计",
    navSubtitle: "OneSystem 准备度检测",
    switchLanguage: "EN",
    heroEyebrow: "AI 准备度审计",
    heroTitle: "找出你的企业应该先系统化哪一个流程。",
    heroBody:
      "AGA 会把你的痛点、系统现状、流程工具和 AI 准备度整理成 OneSystem 与 OneIntelligence 的落地路线图。",
    start: "开始审计",
    estimated: "约 8 分钟",
    secure: "OpenAI 在服务器端生成",
    profileMissing: "请填写所有公司资料后继续。",
    auditStep: "第 2 / 4 步 · AI 准备度",
    auditTitle: "评估真实业务现状",
    auditDescription: "请选择最接近今天情况的答案，而不是理想状态。",
    previous: "上一题",
    next: "下一题",
    continueWorkflows: "继续流程登记",
    expand: "登记工具",
    collapse: "收起",
    remove: "移除",
    add: "添加",
    addCustom: "添加流程",
    customPlaceholder: "例如：加盟商导入",
    selectedTools: "已选工具",
    noTools: "还未选择工具",
    manual: "纯手动处理",
    sourceOpenai: "由 OpenAI 生成",
    sourceFallback: "由本地备用报告生成",
    score: "AI 准备度分数",
    maturity: "成熟度",
    painPoints: "主要痛点",
    breakdown: "成熟度拆解",
    recommended: "建议平台",
    currentTools: "当前工具",
    addTools: "建议添加",
    retireTools: "建议淘汰",
    upgradePath: "升级路径",
    keyActions: "关键行动",
    expectedRoi: "预期回报",
    investment: "投资范围",
    whatsappText: "Hi AGA Ventures! 我已经完成 AI Audit，想进一步讨论报告。",
    tabs: { overview: "总览", workflows: "流程", roadmap: "路线图" },
    revenueLeak: "营收 / 运营流失",
    perMonth: "/月",
    wastedHours: "每周浪费小时",
    yearlyLeak: "年度影响",
    weeklyDelay: "每周延迟成本",
    whatWeSee: "我们在你公司看到的情况",
    competitorThreat: "竞争者威胁",
    benchmark: "行业基准",
    monthlyImpact: "每月影响",
    today: "今天",
    in12Months: "12 个月后",
    monthlyWaste: "每月浪费",
    verdict: "AGA OneIntelligence 结论",
    costOfInaction: "不行动成本",
    threeMonths: "3 个月",
    reportRef: "报告编号",
  },
} as const

function AuditShell({
  locale,
  screen,
  children,
}: {
  locale: AuditLocale
  screen: Screen
  children: React.ReactNode
}) {
  const alternateLocale = locale === "en" ? "zh" : "en"

  return (
    <main className="min-h-screen overflow-hidden bg-[#0F1923] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute left-[-12rem] top-[-12rem] size-[32rem] rounded-full bg-[#E8521A]/25 blur-3xl" />
        <div className="absolute right-[-10rem] top-1/3 size-[28rem] rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/4 size-[26rem] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-[#0F1923]/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#E8521A] text-lg font-black text-white">A</span>
            <span>
              <span className="block text-sm font-bold tracking-normal">{copy[locale].navTitle}</span>
              <span className="block text-xs text-white/55">{copy[locale].navSubtitle}</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 md:inline-flex">
              {screen === "results" ? copy[locale].score : copy[locale].estimated}
            </span>
            <Link
              href={`/${alternateLocale}/aiaudit`}
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10"
            >
              {copy[locale].switchLanguage}
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 md:px-8 md:py-12">{children}</div>
    </main>
  )
}

function Pill({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold text-white/75", className)} style={style}>
      {children}
    </span>
  )
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit"
  className?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-[#E8521A] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#E8521A]/25 transition hover:bg-[#ff6a2f] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  )
}

function GhostButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10", className)}
    >
      {children}
    </button>
  )
}

function ScoreRing({ score, locale }: { score: number; locale: AuditLocale }) {
  const maturity = maturityLabel(score, locale)
  const degree = Math.round((score / 100) * 360)

  return (
    <div className="relative grid size-44 place-items-center rounded-full" style={{ background: `conic-gradient(${maturity.color} ${degree}deg, rgba(255,255,255,.1) 0deg)` }}>
      <div className="grid size-36 place-items-center rounded-full bg-[#101B28] text-center shadow-inner">
        <div>
          <div className="text-5xl font-black">{score}</div>
          <div className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-white/45">/ 100</div>
        </div>
      </div>
    </div>
  )
}

function GateScreen({ locale, onStart }: { locale: AuditLocale; onStart: () => void }) {
  const text = uiText[locale]

  return (
    <div className="grid min-h-[calc(100vh-10rem)] items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
      <section>
        <Pill className="border-[#E8521A]/30 bg-[#E8521A]/15 text-[#ffb08d]">{copy[locale].heroEyebrow}</Pill>
        <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.02] tracking-normal md:text-7xl">
          {copy[locale].heroTitle}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">{copy[locale].heroBody}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <PrimaryButton onClick={onStart}>
            {copy[locale].start}
            <ArrowRight className="size-4" />
          </PrimaryButton>
          <GhostButton>
            <ShieldCheck className="size-4" />
            {copy[locale].secure}
          </GhostButton>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/25 backdrop-blur">
        <div className="rounded-[1.5rem] bg-[#E8521A] p-7 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">{text.ownerOnly}</p>
          <h2 className="mt-4 text-3xl font-black tracking-normal">{text.ownerQuestion}</h2>
          <div className="mt-8 grid gap-3">
            <PrimaryButton onClick={onStart} className="bg-white text-[#0F1923] shadow-none hover:bg-white/90">
              {text.yesOwner}
              <ArrowRight className="size-4" />
            </PrimaryButton>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-white/80">{text.noOwnerMessage}</div>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            [Building2, "Profile"],
            [Workflow, "Registry"],
            [Bot, "AI roadmap"],
          ].map(([Icon, label]) => (
            <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <Icon className="size-5 text-[#E8521A]" />
              <p className="mt-3 text-sm font-semibold text-white/80">{String(label)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ProfileScreen({
  locale,
  onSubmit,
}: {
  locale: AuditLocale
  onSubmit: (profile: AuditProfile) => void
}) {
  const text = uiText[locale]
  const [profile, setProfile] = useState<AuditProfile>({
    company: "",
    industry: "",
    headcount: "",
    role: "",
  })
  const [showError, setShowError] = useState(false)
  const canContinue = Object.values(profile).every(Boolean)

  function update<K extends keyof AuditProfile>(key: K, value: AuditProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }))
  }

  function submit() {
    if (!canContinue) {
      setShowError(true)
      return
    }
    onSubmit(profile)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Pill>{text.profileStep}</Pill>
      <h1 className="mt-5 text-4xl font-black tracking-normal md:text-6xl">{text.profileTitle}</h1>
      <p className="mt-4 text-lg text-white/65">{text.profileDescription}</p>

      <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 md:p-7">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white/70">{text.companyName}</span>
          <input
            value={profile.company}
            onChange={(event) => update("company", event.target.value)}
            className="h-12 rounded-xl border border-white/10 bg-white/10 px-4 text-white outline-none transition placeholder:text-white/35 focus:border-[#E8521A]"
            placeholder="AGA Ventures"
          />
        </label>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <SelectField label={text.industry} value={profile.industry} onChange={(value) => update("industry", value)} options={industries} labels={industryLabels[locale]} placeholder={text.select} />
          <SelectField label={text.headcount} value={profile.headcount} onChange={(value) => update("headcount", value)} options={headcounts} labels={headcountLabels[locale]} placeholder={text.select} />
          <SelectField label={text.role} value={profile.role} onChange={(value) => update("role", value)} options={roles} labels={roleLabels[locale]} placeholder={text.select} />
        </div>

        {showError ? <p className="mt-4 text-sm font-semibold text-[#ffb08d]">{copy[locale].profileMissing}</p> : null}

        <div className="mt-7 flex justify-end">
          <PrimaryButton onClick={submit}>
            {text.continue}
            <ArrowRight className="size-4" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
  labels,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  labels: Record<string, string>
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const labelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const selectedLabel = value ? labels[value] ?? value : placeholder

  return (
    <div
      ref={rootRef}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget
        if (!(nextTarget instanceof Node) || !rootRef.current?.contains(nextTarget)) {
          setOpen(false)
        }
      }}
      className="grid gap-2"
    >
      <span id={labelId} className="text-sm font-semibold text-white/70">
        {label}
      </span>
      <div className="relative">
        <button
          type="button"
          aria-labelledby={labelId}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "flex h-12 w-full items-center justify-between gap-3 rounded-xl border bg-white/10 px-4 text-left text-white outline-none transition hover:bg-white/[0.14] focus-visible:border-[#E8521A] focus-visible:ring-2 focus-visible:ring-[#E8521A]/30",
            open ? "border-[#E8521A] bg-white/[0.14]" : "border-white/10"
          )}
        >
          <span className={cn("min-w-0 truncate", !value && "text-white/65")}>{selectedLabel}</span>
          <ChevronDown className={cn("size-4 shrink-0 text-white/45 transition", open && "rotate-180 text-[#ffb08d]")} />
        </button>

        {open ? (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-72 overflow-y-auto rounded-xl border border-white/10 bg-[#182330] p-1.5 shadow-2xl shadow-black/35">
            <button
              type="button"
              onClick={() => {
                onChange("")
                setOpen(false)
              }}
              className={cn(
                "flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition hover:bg-white/10",
                !value ? "bg-[#E8521A] text-white" : "text-white/68"
              )}
            >
              <span className="truncate">{placeholder}</span>
              {!value ? <Check className="size-4 shrink-0" /> : null}
            </button>
            {options.map((option) => {
              const selected = value === option
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition hover:bg-white/10",
                    selected ? "bg-[#E8521A] text-white" : "text-white/78"
                  )}
                >
                  <span className="truncate">{labels[option] ?? option}</span>
                  {selected ? <Check className="size-4 shrink-0" /> : null}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function AuditScreen({
  locale,
  answers,
  onChange,
  onComplete,
}: {
  locale: AuditLocale
  answers: Record<string, number>
  onChange: (answers: Record<string, number>) => void
  onComplete: () => void
}) {
  const sections = getAuditSections(locale)
  const [index, setIndex] = useState(0)
  const questions = sections.flatMap((section) => section.questions.map((question) => ({ ...question, section })))
  const current = questions[index]
  const progress = Math.round(((index + 1) / questions.length) * 100)
  const canContinue = answers[current.id] !== undefined

  function choose(value: number) {
    onChange({ ...answers, [current.id]: value })
  }

  function next() {
    if (index === questions.length - 1) onComplete()
    else setIndex(index + 1)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Pill>{copy[locale].auditStep}</Pill>
      <div className="mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-black tracking-normal md:text-6xl">{copy[locale].auditTitle}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/65">{copy[locale].auditDescription}</p>
        </div>
        <div className="text-sm font-bold text-white/60">{progress}%</div>
      </div>

      <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[#E8521A] transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 md:p-8">
        <Pill className="border-white/10" style={{ color: current.section.color } as React.CSSProperties}>
          {current.section.label}
        </Pill>
        <h2 className="mt-5 text-2xl font-black tracking-normal md:text-4xl">{current.text}</h2>
        <div className="mt-7 grid gap-3">
          {current.options.map((option, optionIndex) => {
            const selected = answers[current.id] === optionIndex
            return (
              <button
                key={option}
                type="button"
                onClick={() => choose(optionIndex)}
                className={cn(
                  "flex items-center justify-between rounded-2xl border p-4 text-left transition",
                  selected ? "border-[#E8521A] bg-[#E8521A]/15" : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
                )}
              >
                <span className="font-semibold text-white/85">{option}</span>
                <span className={cn("grid size-6 place-items-center rounded-full border", selected ? "border-[#E8521A] bg-[#E8521A]" : "border-white/25")}>
                  {selected ? <Check className="size-4" /> : null}
                </span>
              </button>
            )
          })}
        </div>
        <div className="mt-7 flex justify-between">
          <GhostButton onClick={() => setIndex(Math.max(0, index - 1))} className={index === 0 ? "invisible" : undefined}>
            {copy[locale].previous}
          </GhostButton>
          <PrimaryButton onClick={next} disabled={!canContinue}>
            {index === questions.length - 1 ? copy[locale].continueWorkflows : copy[locale].next}
            <ArrowRight className="size-4" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

function WorkflowScreen({
  locale,
  profile,
  selectedWorkflows,
  onChange,
  onGenerate,
}: {
  locale: AuditLocale
  profile: AuditProfile
  selectedWorkflows: WorkflowSelection[]
  onChange: (workflows: WorkflowSelection[]) => void
  onGenerate: () => void
}) {
  const text = uiText[locale]
  const baseWorkflows = industryWorkflows[profile.industry] ?? industryWorkflows.Other
  const [expanded, setExpanded] = useState<string | null>(baseWorkflows[0] ?? null)
  const [search, setSearch] = useState("")
  const [customName, setCustomName] = useState("")

  const selectedNames = new Set(selectedWorkflows.map((workflow) => workflow.name))
  const toolsCount = selectedWorkflows.reduce((sum, workflow) => sum + workflow.tools.length, 0)
  const avgMaturity = selectedWorkflows.length
    ? Math.round(selectedWorkflows.reduce((sum, workflow) => sum + inferWorkflowMaturity(workflow.tools), 0) / selectedWorkflows.length)
    : 0

  function toggleWorkflow(name: string) {
    if (selectedNames.has(name)) {
      onChange(selectedWorkflows.filter((workflow) => workflow.name !== name))
    } else {
      onChange([...selectedWorkflows, { name, tools: [] }])
      setExpanded(name)
    }
  }

  function updateTools(name: string, tools: string[]) {
    onChange(selectedWorkflows.map((workflow) => (workflow.name === name ? { ...workflow, tools } : workflow)))
  }

  function addCustom() {
    const name = customName.trim()
    if (!name || selectedNames.has(name)) return
    onChange([...selectedWorkflows, { name, tools: [] }])
    setExpanded(name)
    setCustomName("")
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[.72fr_.28fr]">
      <section>
        <Pill>{text.workflowStep}</Pill>
        <h1 className="mt-5 text-4xl font-black tracking-normal md:text-6xl">{text.workflowTitle}</h1>
        <p className="mt-4 max-w-3xl text-lg text-white/65">{text.workflowDescription}</p>

        <div className="mt-8 grid gap-4">
          {baseWorkflows.map((name) => (
            <WorkflowCard
              key={name}
              locale={locale}
              name={name}
              selected={selectedNames.has(name)}
              expanded={expanded === name}
              search={search}
              setSearch={setSearch}
              selectedTools={selectedWorkflows.find((workflow) => workflow.name === name)?.tools ?? []}
              onToggle={() => toggleWorkflow(name)}
              onExpand={() => setExpanded(expanded === name ? null : name)}
              onToolsChange={(tools) => updateTools(name, tools)}
            />
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:flex-row">
          <input
            value={customName}
            onChange={(event) => setCustomName(event.target.value)}
            placeholder={copy[locale].customPlaceholder}
            className="h-12 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 text-white outline-none placeholder:text-white/35 focus:border-[#E8521A]"
          />
          <GhostButton onClick={addCustom}>
            {copy[locale].addCustom}
            <ArrowRight className="size-4" />
          </GhostButton>
        </div>
      </section>

      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
          <div className="grid gap-3">
            <Stat label={text.workflowsSelected} value={String(selectedWorkflows.length)} />
            <Stat label={text.toolsMapped} value={String(toolsCount)} />
            <Stat label={text.avgMaturity} value={workflowMaturityLabels[locale][avgMaturity]} color={workflowMaturityColors[avgMaturity]} />
          </div>
          <PrimaryButton onClick={onGenerate} disabled={!selectedWorkflows.length} className="mt-6 w-full">
            {text.generate}
            <Sparkles className="size-4" />
          </PrimaryButton>
        </div>
      </aside>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F1923]/55 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-normal" style={color ? { color } : undefined}>
        {value}
      </p>
    </div>
  )
}

function WorkflowCard({
  locale,
  name,
  selected,
  expanded,
  search,
  setSearch,
  selectedTools,
  onToggle,
  onExpand,
  onToolsChange,
}: {
  locale: AuditLocale
  name: string
  selected: boolean
  expanded: boolean
  search: string
  setSearch: (search: string) => void
  selectedTools: string[]
  onToggle: () => void
  onExpand: () => void
  onToolsChange: (tools: string[]) => void
}) {
  const definition = workflowDefinitions[name]
  const categories = definition?.categories ?? Object.keys(toolCategories).slice(0, 4)
  const toolList = categories.flatMap((category) => toolCategories[category] ?? [])
  const uniqueTools = Array.from(new Set(toolList))
  const filteredTools = uniqueTools.filter((tool) => tool.toLowerCase().includes(search.toLowerCase()))

  function toggleTool(tool: string) {
    if (selectedTools.includes(tool)) {
      onToolsChange(selectedTools.filter((item) => item !== tool))
    } else {
      onToolsChange([...selectedTools, tool])
    }
  }

  return (
    <article className={cn("rounded-[1.5rem] border bg-white/[0.05] transition", selected ? "border-[#E8521A]/60" : "border-white/10")}>
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <button type="button" onClick={onToggle} className="flex flex-1 items-start gap-4 text-left">
          <span className={cn("mt-1 grid size-6 place-items-center rounded-lg border", selected ? "border-[#E8521A] bg-[#E8521A]" : "border-white/20")}>
            {selected ? <Check className="size-4" /> : null}
          </span>
          <span>
            <span className="block text-lg font-bold tracking-normal">{name}</span>
            <span className="mt-1 block text-sm leading-6 text-white/55">{definition?.description[locale]}</span>
          </span>
        </button>
        <GhostButton onClick={onExpand} className="py-2">
          {expanded ? copy[locale].collapse : copy[locale].expand}
          <ChevronDown className={cn("size-4 transition", expanded && "rotate-180")} />
        </GhostButton>
      </div>

      {expanded ? (
        <div className="border-t border-white/10 p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/35" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={uiText[locale].searchTools}
              className="h-11 w-full rounded-xl border border-white/10 bg-[#0F1923]/60 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#E8521A]"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onToolsChange([])}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/65 hover:bg-white/10"
            >
              {uiText[locale].manualOnly}
            </button>
            {filteredTools.map((tool) => {
              const active = selectedTools.includes(tool)
              return (
                <button
                  key={tool}
                  type="button"
                  onClick={() => toggleTool(tool)}
                  className={cn(
                    "rounded-full border px-3 py-2 text-xs font-semibold transition",
                    active ? "border-[#E8521A] bg-[#E8521A] text-white" : "border-white/10 bg-white/5 text-white/65 hover:bg-white/10"
                  )}
                >
                  {tool}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </article>
  )
}

function AnalyzingScreen({ locale }: { locale: AuditLocale }) {
  return (
    <div className="grid min-h-[calc(100vh-10rem)] place-items-center text-center">
      <div>
        <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-[#E8521A]/15">
          <Loader2 className="size-10 animate-spin text-[#E8521A]" />
        </div>
        <h1 className="mt-6 text-4xl font-black tracking-normal md:text-6xl">{uiText[locale].analyzingTitle}</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-white/60">{copy[locale].secure}</p>
      </div>
    </div>
  )
}

function ResultsScreen({
  locale,
  report,
  score,
  profile,
  source,
  onRestart,
}: {
  locale: AuditLocale
  report: AuditReport
  score: number
  profile: AuditProfile
  source: "openai" | "fallback"
  onRestart: () => void
}) {
  const maturity = maturityLabel(score, locale)
  const [activeTab, setActiveTab] = useState<"overview" | "workflows" | "roadmap">("overview")
  const whatsappMessage =
    locale === "zh"
      ? `Hi AGA Ventures! 我刚完成 ${profile.company || "我的公司"} 的 AI Audit。分数是 ${score}/100，报告编号 ${report.report_reference_id}。我想讨论结果。`
      : `Hi AGA Ventures! I just completed the AI Audit for ${profile.company || "my company"}. My score is ${score}/100. Report reference: ${report.report_reference_id}. I want to discuss my results.`
  const whatsappHref = `https://wa.me/60183576003?text=${encodeURIComponent(whatsappMessage)}`
  const tabs = [
    { id: "overview" as const, label: copy[locale].tabs.overview, icon: BarChart3 },
    { id: "workflows" as const, label: copy[locale].tabs.workflows, icon: Workflow },
    { id: "roadmap" as const, label: copy[locale].tabs.roadmap, icon: Sparkles },
  ]

  return (
    <div className="grid gap-8 lg:grid-cols-[.34fr_.66fr]">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6">
          <Pill className={source === "openai" ? "border-emerald-400/25 text-emerald-200" : "border-amber-400/25 text-amber-200"}>
            {source === "openai" ? copy[locale].sourceOpenai : copy[locale].sourceFallback}
          </Pill>
          <div className="mt-6 flex justify-center">
            <ScoreRing score={score} locale={locale} />
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm font-semibold text-white/45">{copy[locale].maturity}</p>
            <h2 className="mt-1 text-2xl font-black tracking-normal" style={{ color: maturity.color }}>
              {maturity.label}
            </h2>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-white/45">{maturity.tag}</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <ImpactStat label={copy[locale].revenueLeak} value={formatRM(report.revenue_leak.monthly_leak_rm)} />
            <ImpactStat label={copy[locale].wastedHours} value={String(report.revenue_leak.weekly_wasted_hours)} />
          </div>
          <p className="mt-4 rounded-2xl border border-white/10 bg-[#0F1923]/45 p-4 text-xs font-semibold leading-6 text-white/62">
            {copy[locale].reportRef}: <span className="text-white">{report.report_reference_id}</span>
          </p>
          <div className="mt-6 grid gap-3">
            <PrimaryButton onClick={() => window.print()}>
              <Download className="size-4" />
              {uiText[locale].saveReport}
            </PrimaryButton>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
            >
              <MessageCircle className="size-4" />
              {uiText[locale].talkToAga}
            </a>
            <GhostButton onClick={onRestart}>
              <RefreshCw className="size-4" />
              {uiText[locale].backToStart}
            </GhostButton>
          </div>
        </div>
      </aside>

      <section className="space-y-5">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
          <Pill>{uiText[locale].reportTitle}</Pill>
          <h1 className="mt-5 text-3xl font-black tracking-normal md:text-5xl">
            {formatRM(report.revenue_leak.monthly_leak_rm)}{copy[locale].perMonth} · {report.revenue_leak.weekly_wasted_hours} {copy[locale].wastedHours}
          </h1>
          <p className="mt-5 text-lg leading-8 text-white/70">{report.executive_summary}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-2 text-xs font-bold transition sm:gap-2 sm:px-3 sm:text-sm",
                  activeTab === tab.id ? "bg-[#E8521A] text-white shadow-lg shadow-[#E8521A]/20" : "text-white/62 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {activeTab === "overview" ? (
          <div className="space-y-5">
            <ReportSection icon={<TrendingDown className="size-5" />} title={copy[locale].revenueLeak}>
              <div className="grid gap-3 md:grid-cols-4">
                <ImpactStat label={copy[locale].revenueLeak} value={formatRM(report.revenue_leak.monthly_leak_rm)} accent />
                <ImpactStat label={copy[locale].yearlyLeak} value={formatRM(report.revenue_leak.yearly_leak_rm)} />
                <ImpactStat label={copy[locale].wastedHours} value={String(report.revenue_leak.weekly_wasted_hours)} />
                <ImpactStat label={copy[locale].weeklyDelay} value={formatRM(report.revenue_leak.weekly_delay_cost_rm)} />
              </div>
            </ReportSection>

            <div className="grid gap-5 md:grid-cols-2">
              <InsightPanel icon={<Gauge className="size-5" />} title={copy[locale].whatWeSee} body={report.company_diagnosis.what_we_see} />
              <InsightPanel icon={<AlertTriangle className="size-5" />} title={copy[locale].competitorThreat} body={report.company_diagnosis.competitor_threat} tone="warning" />
            </div>

            <ReportSection icon={<BarChart3 className="size-5" />} title={copy[locale].benchmark}>
              <div className="grid gap-4 md:grid-cols-[.32fr_.68fr]">
                <div className="rounded-2xl border border-[#E8521A]/25 bg-[#E8521A]/12 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffb08d]">{report.benchmark.percentile_band}</p>
                  <p className="mt-3 text-3xl font-black tracking-normal">{report.benchmark.label}</p>
                  <p className="mt-3 text-sm leading-6 text-white/62">{report.benchmark.comparison}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {Object.entries(report.maturity_breakdown).map(([key, item]) => (
                    <ScoreBar key={key} label={key} score={item.score} insight={item.insight} />
                  ))}
                </div>
              </div>
            </ReportSection>

            <ReportSection icon={<Target className="size-5" />} title={copy[locale].painPoints}>
              <div className="grid gap-3">
                {report.top_pain_points.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-[#0F1923]/45 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-bold tracking-normal">{item.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Pill className="border-[#E8521A]/25 text-[#ffb08d]">{formatRM(item.monthly_impact_rm)}{copy[locale].perMonth}</Pill>
                        <Pill className={cn(item.urgency === "HIGH" && "border-red-400/25 text-red-200", item.urgency === "MEDIUM" && "border-amber-400/25 text-amber-200")}>{item.urgency}</Pill>
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/60">{item.description}</p>
                  </div>
                ))}
              </div>
            </ReportSection>

            <ReportSection icon={<LineChart className="size-5" />} title={`${copy[locale].today} → ${copy[locale].in12Months}`}>
              <div className="grid gap-4 md:grid-cols-2">
                <VisionList title={copy[locale].today} items={report.before_after_vision.before} tone="before" />
                <VisionList title={copy[locale].in12Months} items={report.before_after_vision.after} tone="after" />
              </div>
            </ReportSection>
          </div>
        ) : null}

        {activeTab === "workflows" ? (
          <ReportSection icon={<Workflow className="size-5" />} title={uiText[locale].workflows}>
            <div className="space-y-4">
              {report.workflow_analysis.map((workflow) => (
                <article key={workflow.name} className="rounded-[1.25rem] border border-white/10 bg-[#0F1923]/45 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-black tracking-normal">{workflow.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/60">{workflow.gap_summary}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Pill className="border-[#E8521A]/25 text-[#ffb08d]">{formatRM(workflow.monthly_waste_rm)}{copy[locale].perMonth}</Pill>
                      <Pill className="border-blue-400/25 text-blue-200">L{workflow.maturity_level} · {workflow.maturity_label}</Pill>
                      <Pill className="border-red-400/25 text-red-200">{workflow.priority}</Pill>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <MiniList title={copy[locale].currentTools} items={workflow.current_tools.length ? workflow.current_tools : [copy[locale].manual]} />
                    <MiniList title={copy[locale].addTools} items={workflow.tools_to_add} />
                    <MiniList title={copy[locale].retireTools} items={workflow.tools_to_retire.length ? workflow.tools_to_retire : ["-"]} />
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm font-bold text-white/85">{copy[locale].recommended}: {workflow.recommended_platform}</p>
                    <div className="mt-3 grid gap-3">
                      {workflow.upgrade_path.map((stage) => (
                        <TimelineStep key={`${workflow.name}-${stage.stage}`} stage={stage.stage} title={stage.timeline} body={`${stage.action} (${stage.benefit})`} />
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </ReportSection>
        ) : null}

        {activeTab === "roadmap" ? (
          <div className="space-y-5">
            <ReportSection icon={<Sparkles className="size-5" />} title={uiText[locale].roadmap}>
              <div className="grid gap-4">
                {report.priority_roadmap.map((stage) => (
                  <article key={stage.stage} className="rounded-[1.25rem] border border-white/10 bg-[#0F1923]/45 p-5">
                    <Pill className="border-[#E8521A]/25 text-[#ffb08d]">{stage.timeline}</Pill>
                    <h3 className="mt-3 text-2xl font-black tracking-normal">{stage.stage}. {stage.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/62">{stage.focus}</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <MiniList title={copy[locale].keyActions} items={stage.key_actions} />
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">{copy[locale].investment}</p>
                        <p className="mt-2 font-bold">{stage.investment_range}</p>
                        <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-white/40">{copy[locale].expectedRoi}</p>
                        <p className="mt-2 text-sm leading-6 text-white/62">{stage.expected_roi}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </ReportSection>

            <InsightPanel icon={<Bot className="size-5" />} title={copy[locale].verdict} body={report.one_intelligence_verdict} />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.75rem] border border-amber-400/25 bg-amber-400/10 p-6">
                <Clock className="size-6 text-amber-200" />
                <h3 className="mt-4 text-2xl font-black tracking-normal">{report.urgency_statement}</h3>
              </div>
              <div className="rounded-[1.75rem] border border-[#E8521A]/35 bg-[#E8521A]/15 p-6">
                <Flame className="size-6 text-[#ffb08d]" />
                <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-[#ffb08d]">{copy[locale].costOfInaction}</p>
                <h3 className="mt-2 text-4xl font-black tracking-normal">{formatRM(report.revenue_leak.three_month_inaction_cost_rm)}</h3>
                <p className="mt-2 text-sm leading-6 text-white/62">{copy[locale].threeMonths}</p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[#E8521A]/25 bg-[#E8521A] p-6 text-white md:p-8">
              <Pill className="border-white/25 bg-white/15 text-white">{copy[locale].reportRef}: {report.report_reference_id}</Pill>
              <h2 className="mt-5 text-3xl font-black tracking-normal">{report.cta_message}</h2>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0F1923]">
                {uiText[locale].talkToAga}
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}

function formatRM(value: number) {
  return `RM ${Math.round(value).toLocaleString("en-MY")}`
}

function ImpactStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn("rounded-2xl border p-4", accent ? "border-[#E8521A]/35 bg-[#E8521A]/15" : "border-white/10 bg-[#0F1923]/45")}>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/42">{label}</p>
      <p className={cn("mt-2 text-2xl font-black tracking-normal", accent && "text-[#ffb08d]")}>{value}</p>
    </div>
  )
}

function InsightPanel({
  icon,
  title,
  body,
  tone = "default",
}: {
  icon: React.ReactNode
  title: string
  body: string
  tone?: "default" | "warning"
}) {
  return (
    <section className={cn("rounded-[1.75rem] border p-6 md:p-8", tone === "warning" ? "border-amber-400/25 bg-amber-400/10" : "border-white/10 bg-white/[0.06]")}>
      <span className={cn("grid size-10 place-items-center rounded-xl", tone === "warning" ? "bg-amber-400/15 text-amber-200" : "bg-[#E8521A]/15 text-[#E8521A]")}>{icon}</span>
      <h2 className="mt-5 text-2xl font-black tracking-normal">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-white/68">{body}</p>
    </section>
  )
}

function ScoreBar({ label, score, insight }: { label: string; score: number; insight: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F1923]/45 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E8521A]">{label}</p>
        <p className="text-sm font-black">{score}</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[#E8521A]" style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
      </div>
      <p className="mt-3 text-sm leading-6 text-white/60">{insight}</p>
    </div>
  )
}

function VisionList({ title, items, tone }: { title: string; items: string[]; tone: "before" | "after" }) {
  return (
    <div className={cn("rounded-2xl border p-4", tone === "before" ? "border-red-400/20 bg-red-400/8" : "border-emerald-400/20 bg-emerald-400/8")}>
      <p className={cn("text-sm font-black tracking-normal", tone === "before" ? "text-red-200" : "text-emerald-200")}>{title}</p>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3 text-sm leading-6 text-white/68">
            <span className={cn("mt-1 grid size-5 shrink-0 place-items-center rounded-full text-xs font-black", tone === "before" ? "bg-red-400/18 text-red-200" : "bg-emerald-400/18 text-emerald-200")}>
              {tone === "before" ? "!" : "✓"}
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TimelineStep({ stage, title, body }: { stage: number; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#E8521A] text-xs font-black">{stage}</span>
      <p className="text-sm leading-6 text-white/62">
        <strong className="font-semibold text-white">{title}:</strong> {body}
      </p>
    </div>
  )
}

function ReportSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-[#E8521A]/15 text-[#E8521A]">{icon}</span>
        <h2 className="text-2xl font-black tracking-normal">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function MiniList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export function AiAuditApp({ locale }: AiAuditAppProps) {
  const [screen, setScreen] = useState<Screen>("gate")
  const [profile, setProfile] = useState<AuditProfile | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [selectedWorkflows, setSelectedWorkflows] = useState<WorkflowSelection[]>([])
  const [report, setReport] = useState<AuditReport | null>(null)
  const [reportSource, setReportSource] = useState<"openai" | "fallback">("fallback")

  const score = useMemo(() => computeAuditScore(answers, locale), [answers, locale])

  async function generateReport() {
    if (!profile) return
    setScreen("analyzing")

    try {
      const response = await fetch("/api/aiaudit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, profile, answers, selectedWorkflows }),
      })
      const payload = (await response.json()) as { report?: AuditReport; source?: "openai" | "fallback" }

      if (!response.ok || !payload.report) throw new Error("Audit API failed")

      setReport(payload.report)
      setReportSource(payload.source ?? "fallback")
    } catch {
      setReport(buildFallbackReport({ locale, profile, answers, score, selectedWorkflows }))
      setReportSource("fallback")
    }

    setScreen("results")
  }

  function reset() {
    setScreen("gate")
    setProfile(null)
    setAnswers({})
    setSelectedWorkflows([])
    setReport(null)
    setReportSource("fallback")
  }

  return (
    <AuditShell locale={locale} screen={screen}>
      {screen === "gate" ? <GateScreen locale={locale} onStart={() => setScreen("profile")} /> : null}
      {screen === "profile" ? (
        <ProfileScreen
          locale={locale}
          onSubmit={(nextProfile) => {
            setProfile(nextProfile)
            setSelectedWorkflows((industryWorkflows[nextProfile.industry] ?? industryWorkflows.Other).slice(0, 4).map((name) => ({ name, tools: [] })))
            setScreen("audit")
          }}
        />
      ) : null}
      {screen === "audit" ? <AuditScreen locale={locale} answers={answers} onChange={setAnswers} onComplete={() => setScreen("workflows")} /> : null}
      {screen === "workflows" && profile ? (
        <WorkflowScreen
          locale={locale}
          profile={profile}
          selectedWorkflows={selectedWorkflows}
          onChange={setSelectedWorkflows}
          onGenerate={generateReport}
        />
      ) : null}
      {screen === "analyzing" ? <AnalyzingScreen locale={locale} /> : null}
      {screen === "results" && report && profile ? <ResultsScreen locale={locale} report={report} score={score} profile={profile} source={reportSource} onRestart={reset} /> : null}
    </AuditShell>
  )
}
