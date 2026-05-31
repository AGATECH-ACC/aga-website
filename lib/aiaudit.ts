export type AuditLocale = "en" | "zh"

export type AuditProfile = {
  company: string
  industry: string
  headcount: string
  role: string
}

export type AuditQuestion = {
  id: string
  text: string
  options: string[]
  scores: number[]
}

export type AuditSection = {
  id: "pain" | "system" | "ai"
  label: string
  weight: number
  color: string
  icon: string
  questions: AuditQuestion[]
}

export type WorkflowSelection = {
  name: string
  tools: string[]
}

export type FinancialImpact = {
  monthly_leak_rm: number
  yearly_leak_rm: number
  weekly_wasted_hours: number
  weekly_delay_cost_rm: number
  three_month_inaction_cost_rm: number
}

export type AuditReport = {
  report_reference_id: string
  revenue_leak: FinancialImpact
  company_diagnosis: {
    what_we_see: string
    competitor_threat: string
  }
  benchmark: {
    label: string
    percentile_band: string
    comparison: string
  }
  executive_summary: string
  top_pain_points: Array<{
    title: string
    description: string
    urgency: "HIGH" | "MEDIUM" | "LOW"
    monthly_impact_rm: number
  }>
  maturity_breakdown: {
    pain: { score: number; insight: string }
    system: { score: number; insight: string }
    ai: { score: number; insight: string }
  }
  workflow_analysis: Array<{
    name: string
    current_tools: string[]
    maturity_level: number
    maturity_label: string
    monthly_waste_rm: number
    gap_summary: string
    priority: "HIGH" | "MEDIUM" | "LOW"
    recommended_platform: string
    upgrade_path: Array<{
      stage: number
      timeline: string
      action: string
      benefit: string
    }>
    tools_to_add: string[]
    tools_to_retire: string[]
  }>
  priority_roadmap: Array<{
    stage: number
    title: string
    timeline: string
    focus: string
    top_workflows: string[]
    key_actions: string[]
    investment_range: string
    expected_roi: string
  }>
  before_after_vision: {
    before: string[]
    after: string[]
  }
  one_intelligence_verdict: string
  urgency_statement: string
  cta_message: string
}

export const auditBrand = {
  orange: "#E8521A",
  navy: "#0F1923",
  navy2: "#1A2535",
}

export const toolCategories: Record<string, string[]> = {
  "Communication & Collaboration": [
    "WhatsApp",
    "WhatsApp Business",
    "Telegram",
    "Email (Gmail/Outlook)",
    "Lark",
    "Slack",
    "Microsoft Teams",
    "Google Chat",
    "Zoom",
    "Phone calls only",
  ],
  "Office & Documents": [
    "Microsoft Excel",
    "Google Sheets",
    "Microsoft Word",
    "Google Docs",
    "Microsoft 365",
    "Google Workspace",
    "Notion",
    "Dropbox",
    "OneDrive",
    "Airtable",
    "Physical paper / manual",
  ],
  "Project & Task Management": [
    "Asana",
    "Monday.com",
    "Trello",
    "ClickUp",
    "Jira",
    "Lark Base",
    "Basecamp",
    "Todoist",
    "Smartsheet",
  ],
  "CRM & Sales": [
    "Salesforce",
    "HubSpot CRM",
    "Zoho CRM",
    "Pipedrive",
    "Odoo CRM",
    "WhatsApp (manual tracking)",
    "Excel/Sheets (manual tracking)",
  ],
  "Accounting & Finance": [
    "SQL Accounting",
    "AutoCount",
    "QuickBooks",
    "Xero",
    "MYOB",
    "Financio",
    "Odoo Accounting",
    "Microsoft Excel",
    "Manual / paper ledger",
  ],
  "HR & Payroll": [
    "Kakitangan.com",
    "JuzTalent",
    "Info-Tech",
    "HReasily",
    "Talenox",
    "Zoho People",
    "Manual payroll",
    "Excel/Sheets",
  ],
  "Inventory & Stock": [
    "Odoo Inventory",
    "SQL Inventory",
    "StoreHub Inventory",
    "Cin7",
    "inFlow",
    "Excel/Sheets",
    "Manual logbook",
  ],
  "E-Commerce & Marketplaces": [
    "Shopify",
    "WooCommerce",
    "Lazada Seller Center",
    "Shopee Seller Center",
    "TikTok Shop",
    "Own website only",
  ],
  "POS & Retail": ["StoreHub", "Slurp!", "Lightspeed", "Square", "Loyverse", "Cash register only", "Manual receipts"],
  "Logistics & Delivery": [
    "Lalamove",
    "GrabExpress",
    "J&T Express",
    "Pos Laju",
    "DHL",
    "Ninjavan",
    "Manual coordination",
    "Own fleet (manual)",
  ],
  "Marketing & Analytics": [
    "Google Analytics",
    "Meta Business Suite",
    "Google Ads",
    "Meta Ads",
    "TikTok Ads",
    "Mailchimp",
    "Canva",
    "No marketing tools",
  ],
  "Customer Support": [
    "Zendesk",
    "Freshdesk",
    "HubSpot Service Hub",
    "WhatsApp Business API",
    "Intercom",
    "Respond.io",
    "Manual / email only",
  ],
  "ERP Systems": ["SAP", "Oracle NetSuite", "Microsoft Dynamics 365", "Odoo (full ERP)", "No ERP"],
  "AI & Automation Tools": [
    "ChatGPT / OpenAI",
    "Claude",
    "Google Gemini",
    "Microsoft Copilot",
    "Zapier",
    "Make",
    "n8n",
    "Power Automate",
    "Lark AI",
    "None yet",
  ],
}

export const workflowDefinitions: Record<string, { icon: string; description: Record<AuditLocale, string>; categories: string[] }> = {
  "Sales & Business Development": {
    icon: "🤝",
    description: {
      en: "Lead generation, quotations, onboarding, and contract management",
      zh: "线索、报价、客户导入与合约管理",
    },
    categories: ["CRM & Sales", "Communication & Collaboration", "Office & Documents", "Marketing & Analytics", "AI & Automation Tools"],
  },
  "Finance & Accounting": {
    icon: "💰",
    description: {
      en: "Invoicing, AP/AR, payroll, tax, compliance, and financial reporting",
      zh: "发票、应收应付、薪资、税务、合规与财务报表",
    },
    categories: ["Accounting & Finance", "HR & Payroll", "Office & Documents", "ERP Systems", "AI & Automation Tools"],
  },
  "HR & People Management": {
    icon: "👥",
    description: {
      en: "Recruitment, onboarding, attendance, leave, and performance reviews",
      zh: "招聘、入职、考勤、请假与绩效管理",
    },
    categories: ["HR & Payroll", "Communication & Collaboration", "Office & Documents", "AI & Automation Tools"],
  },
  "Procurement & Purchasing": {
    icon: "🛒",
    description: {
      en: "Vendors, purchase orders, approvals, and supplier evaluation",
      zh: "供应商、采购单、审批与供应商评估",
    },
    categories: ["Accounting & Finance", "Communication & Collaboration", "Office & Documents", "ERP Systems"],
  },
  "Inventory & Stock Management": {
    icon: "📦",
    description: {
      en: "Stock tracking, reorder points, warehouse management, and cycle counts",
      zh: "库存追踪、补货点、仓库管理与盘点",
    },
    categories: ["Inventory & Stock", "ERP Systems", "E-Commerce & Marketplaces", "Office & Documents"],
  },
  "Customer Service & Support": {
    icon: "🎧",
    description: {
      en: "Customer inquiries, complaints, after-sales support, and feedback",
      zh: "客户咨询、投诉、售后支持与反馈收集",
    },
    categories: ["Customer Support", "Communication & Collaboration", "CRM & Sales", "AI & Automation Tools"],
  },
  "Marketing & Brand": {
    icon: "📣",
    description: {
      en: "Campaigns, content, ads, SEO, and analytics",
      zh: "活动、内容、广告、SEO 与数据分析",
    },
    categories: ["Marketing & Analytics", "E-Commerce & Marketplaces", "Communication & Collaboration", "AI & Automation Tools"],
  },
  "Reporting & Analytics": {
    icon: "📊",
    description: {
      en: "KPI dashboards, management reports, BI, and data visualization",
      zh: "KPI 仪表盘、管理报表、商业智能与数据可视化",
    },
    categories: ["Office & Documents", "ERP Systems", "Accounting & Finance", "AI & Automation Tools"],
  },
  "Project Management": {
    icon: "📋",
    description: {
      en: "Planning, task assignment, milestones, and team delivery",
      zh: "项目规划、任务分派、里程碑与团队交付",
    },
    categories: ["Project & Task Management", "Communication & Collaboration", "Office & Documents", "AI & Automation Tools"],
  },
  "Production & Operations": {
    icon: "🏭",
    description: {
      en: "Production scheduling, capacity planning, BOM, and shop floor ops",
      zh: "生产排程、产能规划、BOM 与现场运营",
    },
    categories: ["ERP Systems", "Office & Documents", "Inventory & Stock", "AI & Automation Tools"],
  },
  "Quality Control & Compliance": {
    icon: "✅",
    description: {
      en: "Inspections, defects, ISO, and certification workflows",
      zh: "检查、缺陷、ISO 与认证流程",
    },
    categories: ["Office & Documents", "Communication & Collaboration", "ERP Systems"],
  },
  "Logistics & Delivery Management": {
    icon: "🚚",
    description: {
      en: "Shipping, last-mile delivery, fleet management, and route planning",
      zh: "运输、最后一公里、车队管理与路线规划",
    },
    categories: ["Logistics & Delivery", "Communication & Collaboration", "Office & Documents", "AI & Automation Tools"],
  },
  "E-Commerce & Online Sales": {
    icon: "🛍",
    description: {
      en: "Online store, marketplaces, order processing, and fulfillment",
      zh: "网店、平台订单、处理与履约",
    },
    categories: ["E-Commerce & Marketplaces", "Inventory & Stock", "Logistics & Delivery", "Marketing & Analytics"],
  },
  "POS & In-Store Operations": {
    icon: "🏪",
    description: {
      en: "POS transactions, cash, retail floor operations, and outlet routines",
      zh: "POS、现金、门店运营与店面例行工作",
    },
    categories: ["POS & Retail", "Inventory & Stock", "Accounting & Finance"],
  },
  "Patient / Client Case Management": {
    icon: "🏥",
    description: {
      en: "Appointments, case records, follow-ups, and treatment/client plans",
      zh: "预约、个案记录、跟进与服务计划",
    },
    categories: ["CRM & Sales", "Customer Support", "Communication & Collaboration", "Office & Documents"],
  },
}

export const industryWorkflows: Record<string, string[]> = {
  Manufacturing: [
    "Production & Operations",
    "Quality Control & Compliance",
    "Inventory & Stock Management",
    "Procurement & Purchasing",
    "Logistics & Delivery Management",
    "Sales & Business Development",
    "HR & People Management",
    "Finance & Accounting",
    "Reporting & Analytics",
  ],
  "F&B / Restaurant": [
    "POS & In-Store Operations",
    "Inventory & Stock Management",
    "Procurement & Purchasing",
    "Customer Service & Support",
    "E-Commerce & Online Sales",
    "Logistics & Delivery Management",
    "Marketing & Brand",
    "HR & People Management",
    "Finance & Accounting",
  ],
  "Retail / E-Commerce": [
    "E-Commerce & Online Sales",
    "POS & In-Store Operations",
    "Inventory & Stock Management",
    "Customer Service & Support",
    "Marketing & Brand",
    "Logistics & Delivery Management",
    "HR & People Management",
    "Finance & Accounting",
    "Reporting & Analytics",
  ],
  "Logistics / Transport": [
    "Logistics & Delivery Management",
    "Sales & Business Development",
    "Customer Service & Support",
    "HR & People Management",
    "Finance & Accounting",
    "Reporting & Analytics",
    "Procurement & Purchasing",
  ],
  "Professional Services": [
    "Sales & Business Development",
    "Project Management",
    "Customer Service & Support",
    "HR & People Management",
    "Finance & Accounting",
    "Marketing & Brand",
    "Reporting & Analytics",
  ],
  "Construction / Property": [
    "Project Management",
    "Procurement & Purchasing",
    "HR & People Management",
    "Finance & Accounting",
    "Quality Control & Compliance",
    "Sales & Business Development",
    "Reporting & Analytics",
  ],
  "Healthcare / Clinic": [
    "Patient / Client Case Management",
    "Customer Service & Support",
    "HR & People Management",
    "Finance & Accounting",
    "Inventory & Stock Management",
    "Reporting & Analytics",
    "Marketing & Brand",
  ],
  Education: [
    "Patient / Client Case Management",
    "Customer Service & Support",
    "HR & People Management",
    "Finance & Accounting",
    "Marketing & Brand",
    "Reporting & Analytics",
    "Project Management",
  ],
  "Finance / Accounting": [
    "Sales & Business Development",
    "Finance & Accounting",
    "Customer Service & Support",
    "HR & People Management",
    "Reporting & Analytics",
  ],
  "Technology / IT": [
    "Project Management",
    "Sales & Business Development",
    "Customer Service & Support",
    "HR & People Management",
    "Finance & Accounting",
    "Marketing & Brand",
    "Reporting & Analytics",
  ],
  "Trading / Wholesale": [
    "Sales & Business Development",
    "Inventory & Stock Management",
    "Procurement & Purchasing",
    "Logistics & Delivery Management",
    "Customer Service & Support",
    "Finance & Accounting",
    "HR & People Management",
    "Reporting & Analytics",
  ],
  Other: Object.keys(workflowDefinitions),
}

export const industries = Object.keys(industryWorkflows)
export const headcounts = ["1-10 staff", "11-20 staff", "21-50 staff", "51-100 staff", "100+ staff"]
export const roles = ["Founder / Owner", "CEO / Managing Director", "Executive Director", "COO / Operations Head", "Business Partner"]

export const uiText = {
  en: {
    gateTitle: "Is Your Business AI-Ready?",
    gateDescription: "Map your workflows, benchmark your tools, and get a full AI transformation roadmap in 8 minutes.",
    ownerOnly: "This audit is designed for business owners, founders and directors only.",
    ownerQuestion: "Are you currently running or leading a company?",
    yesOwner: "Yes, I run a business",
    noOwner: "No, I don't",
    noOwnerMessage: "This audit is built for business owners only. Share this with your director or decision-maker.",
    profileStep: "STEP 1 OF 4 · COMPANY PROFILE",
    profileTitle: "Tell us about your business",
    profileDescription: "Personalizes your audit and workflow recommendations.",
    companyName: "Company name",
    industry: "Industry",
    headcount: "Headcount",
    role: "Your role",
    select: "Select...",
    continue: "Continue to Audit",
    workflowStep: "STEP 3 OF 4 · WORKFLOW REGISTRY",
    workflowTitle: "Map your operations and tools",
    workflowDescription: "Pre-loaded by industry. Check workflows you have, expand to pick your tools.",
    workflowsSelected: "Workflows selected",
    toolsMapped: "Tools mapped",
    avgMaturity: "Avg maturity",
    searchTools: "Search tools...",
    manualOnly: "None — we do this manually",
    addWorkflow: "Add a workflow specific to your business",
    generate: "Generate My AI Audit Report",
    analyzingTitle: "AGA OneIntelligence is analyzing your business",
    reportTitle: "Your AI Readiness Report",
    overview: "Overview",
    workflows: "Workflows",
    roadmap: "Roadmap",
    saveReport: "Save Report",
    talkToAga: "Talk to AGA Ventures",
    backToStart: "Start over",
  },
  zh: {
    gateTitle: "你的企业准备好进入 AI 时代了吗？",
    gateDescription: "梳理流程、评估工具成熟度，并在 8 分钟内获得 AI 转型路线图。",
    ownerOnly: "此评估专为企业老板、创办人和董事设计。",
    ownerQuestion: "你目前是否正在经营或领导一家公司？",
    yesOwner: "是，我正在经营企业",
    noOwner: "不是",
    noOwnerMessage: "此评估适合企业决策者使用。请分享给你的董事或负责人。",
    profileStep: "第 1 / 4 步 · 公司资料",
    profileTitle: "告诉我们你的业务背景",
    profileDescription: "用于生成更贴近行业和流程的建议。",
    companyName: "公司名称",
    industry: "行业",
    headcount: "员工人数",
    role: "你的角色",
    select: "请选择...",
    continue: "继续评估",
    workflowStep: "第 3 / 4 步 · 流程登记",
    workflowTitle: "梳理你的运营流程与工具",
    workflowDescription: "系统会根据行业预载流程。选择已有流程，并展开选择目前使用的工具。",
    workflowsSelected: "已选流程",
    toolsMapped: "已登记工具",
    avgMaturity: "平均成熟度",
    searchTools: "搜索工具...",
    manualOnly: "没有工具 — 目前手动处理",
    addWorkflow: "添加你业务特有的流程",
    generate: "生成我的 AI 审计报告",
    analyzingTitle: "AGA OneIntelligence 正在分析你的业务",
    reportTitle: "你的 AI 准备度报告",
    overview: "总览",
    workflows: "流程",
    roadmap: "路线图",
    saveReport: "保存报告",
    talkToAga: "联系 AGA Ventures",
    backToStart: "重新开始",
  },
} as const

export function getAuditSections(locale: AuditLocale): AuditSection[] {
  const zh = locale === "zh"
  return [
    {
      id: "pain",
      label: zh ? "痛点强度" : "Pain points",
      weight: 0.4,
      color: "#E8521A",
      icon: "⚡",
      questions: [
        {
          id: "p1",
          text: zh ? "团队每周在手动行政工作上浪费多少时间？" : "How much time does your team lose weekly on manual admin tasks?",
          options: zh ? ["几乎没有", "几个小时", "半天", "一天", "多天"] : ["Almost none", "A few hours", "Half a day", "Full day", "Multiple days"],
          scores: [1, 2, 3, 4, 5],
        },
        {
          id: "p2",
          text: zh ? "错误或沟通失误造成业务问题的频率？" : "How often do errors or miscommunications cause business problems?",
          options: zh ? ["很少", "每月", "每周", "每天", "持续发生"] : ["Rarely", "Monthly", "Weekly", "Daily", "Constantly"],
          scores: [1, 2, 3, 4, 5],
        },
        {
          id: "p3",
          text: zh ? "实时掌握业务表现有多困难？" : "How difficult is it to get a real-time view of your business performance?",
          options: zh ? ["很容易", "需要一点整理", "需要一些时间", "很困难", "几乎不可能"] : ["Very easy", "Some effort", "Takes a while", "Very difficult", "Impossible"],
          scores: [1, 2, 3, 4, 5],
        },
        {
          id: "p4",
          text: zh ? "当前报表与数据收集流程有多痛？" : "How painful is your current reporting and data collection process?",
          options: zh ? ["顺畅", "还可以", "麻烦", "痛苦", "已经拖垮团队"] : ["Smooth", "Okay", "Annoying", "Painful", "Breaking us"],
          scores: [1, 2, 3, 4, 5],
        },
      ],
    },
    {
      id: "system",
      label: zh ? "系统成熟度" : "System maturity",
      weight: 0.3,
      color: "#2563EB",
      icon: "🏗",
      questions: [
        {
          id: "s1",
          text: zh ? "哪一个最接近你目前的技术工具组合？" : "Which best describes your current tech stack?",
          options: zh ? ["纸本和 WhatsApp", "基础表格和电邮", "一些 SaaS 但未整合", "已整合的软件系统", "完整数字生态"] : ["Paper & WhatsApp only", "Basic spreadsheets & email", "Some SaaS tools (not integrated)", "Integrated software systems", "Full digital ecosystem"],
          scores: [1, 2, 3, 4, 5],
        },
        {
          id: "s2",
          text: zh ? "你们是否有已记录的 SOP？" : "Do you have documented SOPs?",
          options: zh ? ["完全没有", "少量非正式", "部分记录", "大部分流程已记录", "ISO 级完整记录"] : ["No SOPs at all", "A few informal ones", "Partial documentation", "Most processes documented", "Full ISO-level documentation"],
          scores: [1, 2, 3, 4, 5],
        },
        {
          id: "s3",
          text: zh ? "部门之间共享资料和沟通的情况如何？" : "How well are your departments communicating and sharing data?",
          options: zh ? ["各自孤岛", "靠 WhatsApp/电邮", "共享文档/文件夹", "集中平台", "实时整合数据"] : ["Siloed — no visibility", "Shared via WhatsApp/email", "Shared docs & folders", "Centralized platform", "Real-time integrated data"],
          scores: [1, 2, 3, 4, 5],
        },
        {
          id: "s4",
          text: zh ? "你们如何追踪业务 KPI？" : "How do you currently track business KPIs?",
          options: zh ? ["没有追踪", "每月手动报告", "每周表格", "实时仪表盘", "AI 驱动分析"] : ["We don't", "Monthly manual reports", "Weekly spreadsheets", "Live dashboards", "AI-driven analytics"],
          scores: [1, 2, 3, 4, 5],
        },
      ],
    },
    {
      id: "ai",
      label: zh ? "AI 准备度" : "AI readiness",
      weight: 0.3,
      color: "#059669",
      icon: "🤖",
      questions: [
        {
          id: "a1",
          text: zh ? "领导层对 AI 进入运营的接受度？" : "How open is your leadership team to adopting AI in operations?",
          options: zh ? ["非常抗拒", "怀疑", "谨慎开放", "很积极", "已经推动中"] : ["Very resistant", "Skeptical", "Open but cautious", "Enthusiastic", "Already pushing for it"],
          scores: [1, 2, 3, 4, 5],
        },
        {
          id: "a2",
          text: zh ? "业务数据有多干净和容易取得？" : "How clean and accessible is your business data?",
          options: zh ? ["没有结构化数据", "混乱分散", "部分整理", "大多干净", "干净且集中"] : ["No structured data", "Messy/scattered data", "Some organized data", "Mostly clean data", "Clean, centralized data"],
          scores: [1, 2, 3, 4, 5],
        },
        {
          id: "a3",
          text: zh ? "数字化投资预算准备度？" : "What's your budget readiness for a digitalization investment?",
          options: zh ? ["没有预算", "考虑中", "下个周期规划", "已分配预算", "现在可投资"] : ["Not in budget", "Under consideration", "Planning next cycle", "Budget allocated", "Ready to invest now"],
          scores: [1, 2, 3, 4, 5],
        },
        {
          id: "a4",
          text: zh ? "是否尝试过 AI 工具用于业务？" : "Have you tried any AI tools for your business?",
          options: zh ? ["没听过", "听过但没试", "个人试过", "部分团队在用", "已用于运营"] : ["Never heard of them", "Heard but not tried", "Tried personally only", "A few team members use", "Actively used in ops"],
          scores: [1, 2, 3, 4, 5],
        },
      ],
    },
  ]
}

export function computeAuditScore(answers: Record<string, number>, locale: AuditLocale = "en") {
  let total = 0
  getAuditSections(locale).forEach((section) => {
    const raw = section.questions.reduce((sum, question) => {
      const answer = answers[question.id]
      return sum + (answer !== undefined ? question.scores[answer] ?? 0 : 0)
    }, 0)
    total += (raw / (section.questions.length * 5)) * section.weight
  })
  return Math.round(total * 100)
}

function roundToNearest(value: number, nearest: number) {
  return Math.max(nearest, Math.round(value / nearest) * nearest)
}

function headcountEstimate(headcount: string) {
  if (headcount.includes("1-10")) return 6
  if (headcount.includes("11-20")) return 15
  if (headcount.includes("21-50")) return 35
  if (headcount.includes("51-100")) return 75
  return 125
}

function productiveHourlyCost(headcount: string) {
  const estimate = headcountEstimate(headcount)
  if (estimate <= 10) return 18
  if (estimate <= 20) return 22
  if (estimate <= 50) return 28
  if (estimate <= 100) return 35
  return 42
}

function stableHash(input: string) {
  let hash = 0
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0
  }
  return hash.toString(16).toUpperCase().padStart(6, "0").slice(0, 6)
}

function sectionAverage(answers: Record<string, number>, sectionId: AuditSection["id"], locale: AuditLocale) {
  const section = getAuditSections(locale).find((item) => item.id === sectionId)
  if (!section) return 0
  const scores = section.questions.map((question) => {
    const answer = answers[question.id]
    return answer !== undefined ? question.scores[answer] ?? 0 : 0
  })
  return scores.reduce((sum, score) => sum + score, 0) / scores.length
}

export function buildReportReferenceId({
  profile,
  score,
  selectedWorkflows,
}: {
  profile: AuditProfile
  score: number
  selectedWorkflows: WorkflowSelection[]
}) {
  const seed = `${profile.company}|${profile.industry}|${profile.headcount}|${score}|${selectedWorkflows.map((workflow) => workflow.name).join(",")}`
  return `AGA-${stableHash(seed)}`
}

export function buildFinancialImpact({
  locale = "en",
  profile,
  answers,
  score,
  selectedWorkflows,
}: {
  locale?: AuditLocale
  profile: AuditProfile
  answers: Record<string, number>
  score: number
  selectedWorkflows: WorkflowSelection[]
}): FinancialImpact {
  const headcount = headcountEstimate(profile.headcount)
  const hourlyCost = productiveHourlyCost(profile.headcount)
  const painAverage = sectionAverage(answers, "pain", locale) || 3
  const scoreWeakness = Math.max(0.15, (100 - score) / 100)
  const manualWorkflows = selectedWorkflows.filter((workflow) => inferWorkflowMaturity(workflow.tools) <= 1).length
  const workflowDrag = Math.max(1, manualWorkflows) * 2.6
  const weeklyWastedHours = Math.min(
    260,
    Math.max(6, Math.round(headcount * (0.28 + painAverage * 0.13) * scoreWeakness + workflowDrag))
  )
  const monthlyLeak = roundToNearest(weeklyWastedHours * hourlyCost * 4.33, 100)

  return {
    monthly_leak_rm: monthlyLeak,
    yearly_leak_rm: monthlyLeak * 12,
    weekly_wasted_hours: weeklyWastedHours,
    weekly_delay_cost_rm: roundToNearest(monthlyLeak / 4, 50),
    three_month_inaction_cost_rm: monthlyLeak * 3,
  }
}

function allocateAmount(total: number, index: number, count: number) {
  if (count <= 1) return total
  const weights = [0.42, 0.32, 0.18, 0.08]
  const weightedTotal = weights.slice(0, count).reduce((sum, weight) => sum + weight, 0)
  return roundToNearest(total * ((weights[index] ?? 0.08) / weightedTotal), 50)
}

export function maturityLabel(score: number, locale: AuditLocale = "en") {
  const zh = locale === "zh"
  if (score < 30) return { level: 0, label: zh ? "手动运营" : "Manual Operations", tag: zh ? "关键缺口" : "CRITICAL GAP", color: "#EF4444" }
  if (score < 50) return { level: 1, label: zh ? "基础自动化" : "Basic Automation", tag: zh ? "早期阶段" : "EARLY STAGE", color: "#F59E0B" }
  if (score < 70) return { level: 2, label: zh ? "AI 准备中企业" : "AI-Ready Business", tag: zh ? "成长中" : "GROWING", color: "#3B82F6" }
  return { level: 3, label: zh ? "AI 原生企业" : "AI-Native Enterprise", tag: zh ? "先进" : "ADVANCED", color: "#10B981" }
}

export const workflowMaturityLabels = {
  en: ["Manual", "Basic Digital", "Automated", "AI-Enhanced"],
  zh: ["手动", "基础数字化", "自动化", "AI 增强"],
} as const

export const workflowMaturityColors = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981"]

export function inferWorkflowMaturity(tools: string[]) {
  if (!tools.length) return 0
  const normalized = tools.map((tool) => tool.toLowerCase())
  const hasAi = normalized.some((tool) => ["chatgpt", "openai", "claude", "gemini", "copilot", "lark ai", "notion ai"].some((key) => tool.includes(key)))
  const hasAutomation = normalized.some((tool) => ["zapier", "make", "n8n", "power automate"].some((key) => tool.includes(key)))
  const manualOnly = normalized.every((tool) => ["excel", "sheets", "word", "docs", "email", "whatsapp", "telegram", "paper", "manual", "phone", "only", "none", "cash register", "logbook"].some((key) => tool.includes(key)))
  if (hasAi) return 3
  if (hasAutomation) return 2
  if (manualOnly) return 1
  return 2
}

export function buildFallbackReport({
  locale,
  profile,
  answers = {},
  score,
  selectedWorkflows,
}: {
  locale: AuditLocale
  profile: AuditProfile
  answers?: Record<string, number>
  score: number
  selectedWorkflows: WorkflowSelection[]
}): AuditReport {
  const zh = locale === "zh"
  const labels = workflowMaturityLabels[locale]
  const workflows = selectedWorkflows.length ? selectedWorkflows : [{ name: zh ? "核心运营流程" : "Core Operations", tools: [] }]
  const revenueLeak = buildFinancialImpact({ locale, profile, answers, score, selectedWorkflows: workflows })
  const reportReferenceId = buildReportReferenceId({ profile, score, selectedWorkflows: workflows })
  const benchmark =
    score < 40
      ? { label: zh ? "低于平均" : "BELOW AVERAGE", percentile_band: zh ? "行业后 35%" : "bottom 35%", comparison: zh ? "你的系统化与 AI 准备度落后于多数同行。" : "Your system and AI readiness is behind most comparable operators." }
      : score < 65
        ? { label: zh ? "接近平均" : "NEAR AVERAGE", percentile_band: zh ? "行业中段" : "middle 50%", comparison: zh ? "你的企业已有基础，但关键流程仍会拖慢增长。" : "Your business has foundations in place, but key workflows still slow growth." }
        : { label: zh ? "高于平均" : "ABOVE AVERAGE", percentile_band: zh ? "行业前 30%" : "top 30%", comparison: zh ? "你的基础不错，下一步是把 AI 接入运营执行。" : "Your foundation is strong; the next step is connecting AI to execution." }

  return {
    report_reference_id: reportReferenceId,
    revenue_leak: revenueLeak,
    company_diagnosis: {
      what_we_see: zh
        ? `${profile.company || "你的企业"} 是一家 ${profile.headcount || "成长中"} 的 ${profile.industry || "SME"}，目前最大的问题不是缺少工具，而是流程、负责人和数据没有形成统一节奏。你的团队很可能已经在重复跟进、手动整理和跨部门确认上消耗大量时间。`
        : `${profile.company || "Your business"} is a ${profile.headcount || "growing"} ${profile.industry || "SME"} where the core issue is not a lack of tools, but a lack of one operating rhythm across workflows, owners, and data. Your team is likely losing time to repeated follow-ups, manual updates, and cross-department checking.`,
      competitor_threat: zh
        ? `同业竞争者正在把审批、销售跟进和报表自动化。接下来 12 个月继续等待，会让你的团队用手动速度对抗 AI 原生速度。`
        : `Competitors in your space are already automating approvals, sales follow-up, and reporting. Waiting another 12 months means running a manual-speed company against AI-native operators.`,
    },
    benchmark,
    executive_summary: zh
      ? `${profile.company || "你的企业"} 在 ${profile.industry || "当前行业"} 中已经具备系统化和 AI 升级的空间。当前分数显示，最重要的机会在于把分散工具、手动流程和管理报表整合为一套可追踪的 OneSystem。建议先处理高频、影响现金流和客户体验的流程。`
      : `${profile.company || "Your business"} shows clear opportunities to systemize operations and prepare for AI adoption in ${profile.industry || "your industry"}. The score suggests that scattered tools, manual follow-up, and reporting gaps should be consolidated into OneSystem first. The best starting point is the high-frequency workflows that affect cash flow, customer experience, and owner visibility.`,
    top_pain_points: [
      {
        title: zh ? "手动流程瓶颈" : "Manual Workflow Bottlenecks",
        description: zh ? "多个流程仍依赖 WhatsApp、表格或口头确认，容易造成延迟和责任不清。" : "Multiple workflows still rely on WhatsApp, spreadsheets, or verbal checks, creating delays and unclear ownership.",
        urgency: "HIGH",
        monthly_impact_rm: allocateAmount(revenueLeak.monthly_leak_rm, 0, 3),
      },
      {
        title: zh ? "缺少实时可视化" : "Limited Real-Time Visibility",
        description: zh ? "管理层无法快速看见任务、销售、库存或财务状态，决策容易慢半拍。" : "Leadership cannot quickly see task, sales, inventory, or finance status, making decisions slower than the business needs.",
        urgency: "HIGH",
        monthly_impact_rm: allocateAmount(revenueLeak.monthly_leak_rm, 1, 3),
      },
      {
        title: zh ? "AI 尚未连接业务流程" : "AI Not Connected to Workflows",
        description: zh ? "AI 使用仍偏个人工具层面，还没有成为运营、提醒、报表和执行的一部分。" : "AI use is still tool-level instead of being connected to operations, reminders, reporting, and execution.",
        urgency: "MEDIUM",
        monthly_impact_rm: allocateAmount(revenueLeak.monthly_leak_rm, 2, 3),
      },
    ],
    maturity_breakdown: {
      pain: { score: Math.min(100, Math.max(30, score + 15)), insight: zh ? "核心流程存在明显时间与沟通成本。" : "Core workflows show visible time and communication drag." },
      system: { score: Math.max(20, Math.min(90, score - 5)), insight: zh ? "系统基础存在，但仍需要整合和标准化。" : "System foundations exist but need integration and standardization." },
      ai: { score: Math.max(15, Math.min(85, score - 10)), insight: zh ? "AI 潜力高，前提是先整理数据和流程。" : "AI potential is strong once data and workflows are structured." },
    },
    workflow_analysis: workflows.map((workflow, index) => {
      const maturity = inferWorkflowMaturity(workflow.tools)
      return {
        name: workflow.name,
        current_tools: workflow.tools,
        maturity_level: maturity,
        maturity_label: labels[maturity],
        monthly_waste_rm: allocateAmount(revenueLeak.monthly_leak_rm, index, workflows.length),
        gap_summary: zh
          ? `${workflow.name} 目前仍有整合空间。建议先把任务、负责人、审批和状态集中到 OneSystem，再逐步加入 OneIntelligence。`
          : `${workflow.name} has room for integration. Start by centralizing tasks, owners, approvals, and status in OneSystem, then layer OneIntelligence on top.`,
        priority: maturity <= 1 ? "HIGH" : "MEDIUM",
        recommended_platform: zh ? "AGA OneSystem + OneIntelligence" : "AGA OneSystem + OneIntelligence",
        upgrade_path: [
          {
            stage: 1,
            timeline: zh ? "2-4 周" : "2-4 weeks",
            action: zh ? "把流程转入 OneSystem，建立任务、审批与仪表盘" : "Move the workflow into OneSystem with tasks, approvals, and dashboards",
            benefit: zh ? "减少手动跟进和重复确认" : "Reduce manual follow-up and repeated checking",
          },
          {
            stage: 2,
            timeline: zh ? "2-3 个月" : "2-3 months",
            action: zh ? "加入自动提醒、状态汇总和管理报表" : "Add automated reminders, status summaries, and management reports",
            benefit: zh ? "提升处理速度和可视化" : "Improve processing speed and visibility",
          },
          {
            stage: 3,
            timeline: zh ? "6-12 个月" : "6-12 months",
            action: zh ? "部署 AI Agent 协助跟进、预警和建议" : "Deploy AI agents for follow-up, alerts, and recommendations",
            benefit: zh ? "让业务逐步进入 AI 原生运营" : "Move the business toward AI-native operations",
          },
        ],
        tools_to_add: ["OneSystem", "Lark Base", "Lark Approval", "OneIntelligence"],
        tools_to_retire: workflow.tools.filter((tool) => /manual|excel|sheet|paper|logbook/i.test(tool)),
      }
    }),
    priority_roadmap: [
      {
        stage: 1,
        title: zh ? "快速见效" : "Quick Wins",
        timeline: zh ? "1-3 个月" : "1-3 months",
        focus: zh ? "处理最痛、最高频的手动流程" : "Remove the most painful manual workflows",
        top_workflows: workflows.slice(0, 3).map((workflow) => workflow.name),
        key_actions: zh ? ["建立 Workflow Registry", "把核心流程放入 OneSystem", "设置审批和提醒"] : ["Build the Workflow Registry", "Move core workflows into OneSystem", "Set up approvals and reminders"],
        investment_range: "RM 15,000 - RM 25,000",
        expected_roi: zh ? "每周节省 10-20 小时管理和跟进时间" : "Save 10-20 hours per week in management and follow-up effort",
      },
      {
        stage: 2,
        title: zh ? "优化整合" : "Optimization",
        timeline: zh ? "3-6 个月" : "3-6 months",
        focus: zh ? "把数据、部门和报表连接起来" : "Connect data, departments, and reporting",
        top_workflows: workflows.slice(0, 4).map((workflow) => workflow.name),
        key_actions: zh ? ["建立实时仪表盘", "自动化重复通知", "整理客户和财务数据"] : ["Build live dashboards", "Automate repeated notifications", "Structure customer and finance data"],
        investment_range: "RM 35,000 - RM 55,000",
        expected_roi: zh ? "减少错误、延误和重复输入" : "Reduce errors, delays, and duplicate data entry",
      },
      {
        stage: 3,
        title: zh ? "AI 转型" : "Transformation",
        timeline: zh ? "6-18 个月" : "6-18 months",
        focus: zh ? "让 AI Agent 辅助运营执行和预警" : "Let AI agents assist operations and alerts",
        top_workflows: workflows.slice(0, 5).map((workflow) => workflow.name),
        key_actions: zh ? ["部署 OneIntelligence", "生成自动摘要", "建立异常预警和建议"] : ["Deploy OneIntelligence", "Generate automatic summaries", "Build anomaly alerts and recommendations"],
        investment_range: "RM 80,000 - RM 120,000+",
        expected_roi: zh ? "企业在不同比增加人手下扩张运营能力" : "Scale operating capacity without adding headcount at the same rate",
      },
    ],
    before_after_vision: {
      before: zh
        ? ["老板需要追问才知道进度", "团队靠 WhatsApp 和表格同步", "报表滞后，决策慢半拍", "AI 只停留在个人工具"]
        : ["Owners chase updates manually", "Teams coordinate through WhatsApp and spreadsheets", "Reports arrive late and decisions lag", "AI stays as a personal tool"],
      after: zh
        ? ["关键流程集中在 OneSystem", "负责人、审批和状态实时可见", "管理层每周看到行动型报表", "OneIntelligence 协助提醒、总结和预警"]
        : ["Core workflows run through OneSystem", "Owners, approvals, and status are visible in real time", "Management gets action-ready weekly reporting", "OneIntelligence assists reminders, summaries, and alerts"],
    },
    one_intelligence_verdict: zh
      ? `${profile.company || "你的企业"} 不需要一次性做大型转型。你需要先止住每月约 RM ${revenueLeak.monthly_leak_rm.toLocaleString("en-MY")} 的运营浪费，把最高频流程变成可追踪、可审批、可报告的 OneSystem。若现在开始，第一阶段可以在 30-90 天内建立可见成果；若继续等待，竞争者会用更快的数据和 AI 节奏拉开差距。`
      : `${profile.company || "Your business"} does not need a massive transformation in one move. It needs to stop roughly RM ${revenueLeak.monthly_leak_rm.toLocaleString("en-MY")} in monthly operational waste by turning the highest-frequency workflows into a trackable, approvable, reportable OneSystem. If you start now, Stage 1 can create visible results in 30-90 days; if you wait, faster data and AI-native competitors widen the gap.`,
    urgency_statement: zh
      ? `每延迟一周，估计会继续损失 RM ${revenueLeak.weekly_delay_cost_rm.toLocaleString("en-MY")} 的运营浪费。`
      : `Every week you delay keeps an estimated RM ${revenueLeak.weekly_delay_cost_rm.toLocaleString("en-MY")} in operational waste on the table.`,
    cta_message: zh
      ? "你的竞争对手正在把 AI 接入运营，现在是建立 Business DNA 和 OneSystem 的关键窗口。"
      : "Your competitors are connecting AI into operations now; this is the window to build your Business DNA and OneSystem.",
  }
}

const scoreInsightSchema = {
  type: "object",
  additionalProperties: false,
  required: ["score", "insight"],
  properties: {
    score: { type: "number" },
    insight: { type: "string" },
  },
} as const

const financialImpactSchema = {
  type: "object",
  additionalProperties: false,
  required: ["monthly_leak_rm", "yearly_leak_rm", "weekly_wasted_hours", "weekly_delay_cost_rm", "three_month_inaction_cost_rm"],
  properties: {
    monthly_leak_rm: { type: "number" },
    yearly_leak_rm: { type: "number" },
    weekly_wasted_hours: { type: "number" },
    weekly_delay_cost_rm: { type: "number" },
    three_month_inaction_cost_rm: { type: "number" },
  },
} as const

export const auditReportJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "report_reference_id",
    "revenue_leak",
    "company_diagnosis",
    "benchmark",
    "executive_summary",
    "top_pain_points",
    "maturity_breakdown",
    "workflow_analysis",
    "priority_roadmap",
    "before_after_vision",
    "one_intelligence_verdict",
    "urgency_statement",
    "cta_message",
  ],
  properties: {
    report_reference_id: { type: "string" },
    revenue_leak: financialImpactSchema,
    company_diagnosis: {
      type: "object",
      additionalProperties: false,
      required: ["what_we_see", "competitor_threat"],
      properties: {
        what_we_see: { type: "string" },
        competitor_threat: { type: "string" },
      },
    },
    benchmark: {
      type: "object",
      additionalProperties: false,
      required: ["label", "percentile_band", "comparison"],
      properties: {
        label: { type: "string" },
        percentile_band: { type: "string" },
        comparison: { type: "string" },
      },
    },
    executive_summary: { type: "string" },
    top_pain_points: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "description", "urgency", "monthly_impact_rm"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          urgency: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
          monthly_impact_rm: { type: "number" },
        },
      },
    },
    maturity_breakdown: {
      type: "object",
      additionalProperties: false,
      required: ["pain", "system", "ai"],
      properties: {
        pain: scoreInsightSchema,
        system: scoreInsightSchema,
        ai: scoreInsightSchema,
      },
    },
    workflow_analysis: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "current_tools", "maturity_level", "maturity_label", "monthly_waste_rm", "gap_summary", "priority", "recommended_platform", "upgrade_path", "tools_to_add", "tools_to_retire"],
        properties: {
          name: { type: "string" },
          current_tools: { type: "array", items: { type: "string" } },
          maturity_level: { type: "number" },
          maturity_label: { type: "string" },
          monthly_waste_rm: { type: "number" },
          gap_summary: { type: "string" },
          priority: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
          recommended_platform: { type: "string" },
          upgrade_path: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["stage", "timeline", "action", "benefit"],
              properties: {
                stage: { type: "number" },
                timeline: { type: "string" },
                action: { type: "string" },
                benefit: { type: "string" },
              },
            },
          },
          tools_to_add: { type: "array", items: { type: "string" } },
          tools_to_retire: { type: "array", items: { type: "string" } },
        },
      },
    },
    priority_roadmap: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["stage", "title", "timeline", "focus", "top_workflows", "key_actions", "investment_range", "expected_roi"],
        properties: {
          stage: { type: "number" },
          title: { type: "string" },
          timeline: { type: "string" },
          focus: { type: "string" },
          top_workflows: { type: "array", items: { type: "string" } },
          key_actions: { type: "array", items: { type: "string" } },
          investment_range: { type: "string" },
          expected_roi: { type: "string" },
        },
      },
    },
    before_after_vision: {
      type: "object",
      additionalProperties: false,
      required: ["before", "after"],
      properties: {
        before: { type: "array", items: { type: "string" } },
        after: { type: "array", items: { type: "string" } },
      },
    },
    one_intelligence_verdict: { type: "string" },
    urgency_statement: { type: "string" },
    cta_message: { type: "string" },
  },
} as const
