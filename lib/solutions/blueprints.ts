import type { Locale } from "@/lib/i18n/dictionary"

export type SolutionBlueprint = {
  slug: string
  vertical: string
  audience: string
  image: string
  insideLabel: string
  resultLabel: string
  inside: string[]
  result: string
  painPoints: string[]
  trustAnchors: string[]
  legacyToolsReplaced: string[]
  questionHeadings: string[]
  modules: Array<{ title: string; description: string }>
}

const en: Record<string, SolutionBlueprint> = {
  "education-training": {
    slug: "education-training",
    vertical: "Education and training centres",
    audience: "Malaysia education centre owners, principals, operators, and admin managers",
    image: "/assets/aga-hero-3.png",
    insideLabel: "Inside",
    resultLabel: "End result",
    inside: ["Enrollment pipeline", "Course scheduling", "Student follow-up", "Payment visibility"],
    result:
      "Owners see enrollment, class delivery, teacher workload, and follow-up status without checking multiple chats.",
    painPoints: [
      "Student enquiries are scattered across WhatsApp, calls, walk-ins, and spreadsheets.",
      "Class scheduling, replacements, payment follow-up, and attendance depend on manual reminders.",
      "Owners cannot see admissions, academic delivery, and admin workload in one operating view.",
    ],
    trustAnchors: ["Kuala Lumpur", "Petaling Jaya", "Shah Alam", "Selangor", "Malaysia"],
    legacyToolsReplaced: ["WhatsApp group follow-up", "Excel student lists", "paper attendance", "manual payment reminders"],
    questionHeadings: [
      "How can an education centre replace manual WhatsApp student follow-up?",
      "How can class scheduling, attendance, and payment reminders run in one workflow?",
      "How can owners see admissions and academic operations from one dashboard?",
    ],
    modules: [
      {
        title: "Enrollment CRM",
        description: "Track leads, trial classes, student status, parent communication, and conversion stages.",
      },
      {
        title: "Class operations",
        description: "Plan schedules, teachers, rooms, attendance, replacements, and recurring class tasks.",
      },
      {
        title: "Student follow-up",
        description: "Keep renewal, payment, absence, and progress reminders visible to the right team member.",
      },
    ],
  },
  fnb: {
    slug: "fnb",
    vertical: "F&B outlets and restaurant groups",
    audience: "Malaysia restaurant owners, outlet managers, operations managers, and F&B group directors",
    image: "/assets/aga-hero-2.png",
    insideLabel: "Inside",
    resultLabel: "End result",
    inside: ["Outlet task checks", "Stock movement", "Staffing rhythm", "Daily sales view"],
    result:
      "F&B teams run outlet routines consistently while owners see sales, stock, staffing, and finance signals faster.",
    painPoints: [
      "Outlet opening, closing, hygiene, maintenance, and issue checks live inside chat groups.",
      "Stock requests, wastage, transfers, and low-stock alerts are not connected to owner visibility.",
      "Daily sales, staffing, and finance signals arrive late or require manual spreadsheet checking.",
    ],
    trustAnchors: ["Kuala Lumpur", "Petaling Jaya", "Shah Alam", "Selangor", "Malaysia"],
    legacyToolsReplaced: ["WhatsApp outlet checklists", "Excel stock sheets", "paper duty rosters", "manual sales reports"],
    questionHeadings: [
      "How can F&B owners replace WhatsApp outlet checklists with automated workflows?",
      "How can stock requests, transfers, and wastage become visible in one system?",
      "How can restaurant owners see outlet performance without chasing every manager?",
    ],
    modules: [
      {
        title: "Outlet control board",
        description: "Daily opening, closing, hygiene, maintenance, and issue reports in one operational view.",
      },
      {
        title: "Inventory workflow",
        description: "Track stock requests, transfers, wastage, purchase needs, and low-stock alerts.",
      },
      {
        title: "Finance visibility",
        description: "Connect sales, cost, cash collection, and outlet performance into owner dashboards.",
      },
    ],
  },
  services: {
    slug: "services",
    vertical: "Service businesses",
    audience: "Malaysia service business owners, operations managers, dispatch leads, and customer service teams",
    image: "/assets/aga-hero-4.png",
    insideLabel: "Inside",
    resultLabel: "End result",
    inside: ["Booking intake", "Task dispatch", "Customer updates", "Completion proof"],
    result:
      "Service teams know who handles each job, customers receive clearer updates, and owners see execution quality.",
    painPoints: [
      "Customer requests, bookings, and job details are split across WhatsApp, calls, and personal notes.",
      "Dispatch, status updates, completion proof, and service recovery depend on manager follow-up.",
      "Owners lack a clean view of job load, blocked tasks, overdue work, and customer response quality.",
    ],
    trustAnchors: ["Kuala Lumpur", "Petaling Jaya", "Shah Alam", "Selangor", "Malaysia"],
    legacyToolsReplaced: ["WhatsApp job dispatch", "manual appointment lists", "paper job sheets", "spreadsheet status trackers"],
    questionHeadings: [
      "How can service companies replace manual WhatsApp dispatch with automated workflows?",
      "How can booking intake, task assignment, and completion proof stay connected?",
      "How can owners monitor service quality and blocked jobs from one dashboard?",
    ],
    modules: [
      {
        title: "Booking workflow",
        description: "Capture requests, customer details, appointment windows, priority, and required resources.",
      },
      {
        title: "Dispatch board",
        description: "Assign jobs, track team movement, monitor status, and escalate blocked tasks.",
      },
      {
        title: "Customer follow-up",
        description: "Manage updates, completion evidence, feedback, repeat jobs, and service recovery.",
      },
    ],
  },
  "wholesale-trade": {
    slug: "wholesale-trade",
    vertical: "Wholesale trade and distribution",
    audience: "Malaysia wholesale distributors, trading companies, sales coordinators, warehouse teams, and SME owners",
    image: "/assets/aga-hero-5.png",
    insideLabel: "Inside",
    resultLabel: "End result",
    inside: ["Quotation flow", "Order tracking", "Inventory checks", "Collection status"],
    result:
      "Wholesale teams reduce missed orders, quote confusion, inventory surprises, and unclear collection follow-up.",
    painPoints: [
      "Quotation requests, price approvals, customer confirmations, and order handovers are scattered.",
      "Inventory checks, packing status, delivery exceptions, and customer updates are not connected.",
      "Collection follow-up depends on memory, personal messages, and manual aging reports.",
    ],
    trustAnchors: ["Kuala Lumpur", "Petaling Jaya", "Shah Alam", "Selangor", "Malaysia"],
    legacyToolsReplaced: ["WhatsApp order taking", "Excel quotation trackers", "paper delivery notes", "manual collection reminders"],
    questionHeadings: [
      "How can wholesale distributors replace manual WhatsApp order tracking?",
      "How can quotations, inventory checks, delivery, and collection status connect in one workflow?",
      "How can owners reduce missed orders and unclear payment follow-up?",
    ],
    modules: [
      {
        title: "Quote-to-order flow",
        description: "Track quotation requests, approvals, customer confirmation, order status, and handover.",
      },
      {
        title: "Inventory and delivery",
        description: "Connect stock availability, packing, delivery notes, and fulfillment exceptions.",
      },
      {
        title: "Collection control",
        description: "Monitor customer balances, payment promises, aging, and follow-up ownership.",
      },
    ],
  },
  "professional-services": {
    slug: "professional-services",
    vertical: "Professional services and agencies",
    audience: "Malaysia agencies, consultancies, accounting firms, project teams, and professional service owners",
    image: "/assets/aga-hero-1.png",
    insideLabel: "Inside",
    resultLabel: "End result",
    inside: ["Project pipeline", "Client files", "Approval trail", "Delivery milestones"],
    result:
      "Professional teams keep projects, clients, documents, approvals, and deadlines visible from one shared system.",
    painPoints: [
      "Client files, approvals, revision rounds, and delivery milestones sit across chat, email, drives, and spreadsheets.",
      "Teams lose time clarifying scope, owner, deadline, version, and approval status.",
      "Owners cannot see project risk, workload, overdue work, and client follow-up clearly.",
    ],
    trustAnchors: ["Kuala Lumpur", "Petaling Jaya", "Shah Alam", "Selangor", "Malaysia"],
    legacyToolsReplaced: ["WhatsApp approval trails", "Excel project trackers", "shared-drive folder hunting", "manual deadline reminders"],
    questionHeadings: [
      "How can agencies replace manual WhatsApp approvals with structured workflows?",
      "How can client files, revisions, deadlines, and approvals stay visible in one project workspace?",
      "How can professional service owners monitor delivery risk without manual status chasing?",
    ],
    modules: [
      {
        title: "Project workspace",
        description: "Organize clients, scopes, milestones, owners, deadlines, and delivery status.",
      },
      {
        title: "Document and approval flow",
        description: "Track files, review rounds, client approvals, internal approvals, and version status.",
      },
      {
        title: "Management review",
        description: "Give leaders visibility into workload, overdue items, delivery risk, and client follow-up.",
      },
    ],
  },
}

const zh: Record<string, SolutionBlueprint> = {
  "education-training": {
    ...en["education-training"],
    insideLabel: "里面包含",
    resultLabel: "最后结果",
    inside: ["报名流程", "课程排班", "学员跟进", "付款可视化"],
    result: "老板不用翻多个群组，也能看见报名、课程交付、老师工作量与跟进状态。",
    painPoints: ["学员询问分散在 WhatsApp、电话、walk-in 与表格。", "排课、补课、付款跟进与出席记录依赖人工提醒。", "老板无法在同一个视图看见招生、教学交付与行政工作量。"],
    trustAnchors: ["Kuala Lumpur", "Petaling Jaya", "Shah Alam", "Selangor", "Malaysia"],
    legacyToolsReplaced: ["WhatsApp 跟进群", "Excel 学员表", "纸本出席记录", "人工付款提醒"],
    questionHeadings: ["教育中心如何替代人工 WhatsApp 学员跟进？", "排课、出席与付款提醒如何在同一流程运行？", "老板如何从一个仪表盘看见招生与教学运营？"],
    modules: [
      { title: "报名 CRM", description: "管理线索、试听课、学员状态、家长沟通与转化阶段。" },
      { title: "课程运营", description: "规划排班、老师、教室、出席、补课与周期性课程任务。" },
      { title: "学员跟进", description: "让续费、付款、缺席与学习进度提醒清楚分派给负责人。" },
    ],
  },
  fnb: {
    ...en.fnb,
    insideLabel: "里面包含",
    resultLabel: "最后结果",
    inside: ["门店检查", "库存流动", "人手安排", "每日销售"],
    result: "门店日常更一致，老板更快看清销售、库存、人手与财务信号。",
    painPoints: ["开店、关店、卫生、维修和异常检查都分散在聊天群。", "补货、调货、损耗和低库存提醒没有连接到老板视图。", "每日销售、人手和财务信号太迟，仍需人工检查表格。"],
    trustAnchors: ["Kuala Lumpur", "Petaling Jaya", "Shah Alam", "Selangor", "Malaysia"],
    legacyToolsReplaced: ["WhatsApp 门店检查", "Excel 库存表", "纸本人手表", "人工销售报告"],
    questionHeadings: ["F&B 老板如何用自动化流程替代 WhatsApp 门店检查？", "库存申请、调货与损耗如何集中可视化？", "餐饮老板如何不用追每位店长也看见门店表现？"],
    modules: [
      { title: "门店控制板", description: "开店、关店、卫生、维修与异常报告集中在一个运营视图。" },
      { title: "库存流程", description: "追踪补货、调货、损耗、采购需求与低库存提醒。" },
      { title: "财务可视化", description: "把销售、成本、收款与门店表现连接成老板仪表盘。" },
    ],
  },
  services: {
    ...en.services,
    insideLabel: "里面包含",
    resultLabel: "最后结果",
    inside: ["预约入口", "任务派工", "客户更新", "完成证明"],
    result: "服务团队知道谁负责每个任务，客户更新更清楚，老板看得见执行质量。",
    painPoints: ["客户请求、预约和任务资料分散在 WhatsApp、电话和个人笔记。", "派工、状态更新、完成证明和服务补救都依赖经理追进度。", "老板缺少任务量、卡点、逾期事项和客户回应质量的清晰视图。"],
    trustAnchors: ["Kuala Lumpur", "Petaling Jaya", "Shah Alam", "Selangor", "Malaysia"],
    legacyToolsReplaced: ["WhatsApp 派工", "人工预约清单", "纸本工单", "Excel 状态追踪"],
    questionHeadings: ["服务公司如何用自动化流程替代人工 WhatsApp 派工？", "预约入口、任务分派和完成证明如何连接？", "老板如何从一个仪表盘看见服务质量和卡住任务？"],
    modules: [
      { title: "预约流程", description: "记录客户请求、资料、时间窗口、优先级与所需资源。" },
      { title: "派工看板", description: "分派任务、追踪团队状态、查看进度并升级卡住事项。" },
      { title: "客户跟进", description: "管理更新、完成证明、反馈、复购任务与服务补救。" },
    ],
  },
  "wholesale-trade": {
    ...en["wholesale-trade"],
    insideLabel: "里面包含",
    resultLabel: "最后结果",
    inside: ["报价流程", "订单追踪", "库存检查", "收款状态"],
    result: "批发团队减少漏单、报价混乱、库存惊喜与收款跟进不清的问题。",
    painPoints: ["报价请求、价格审批、客户确认和订单交接分散。", "库存检查、包装状态、交付异常和客户更新没有连接。", "收款跟进依赖记忆、个人信息和人工账龄报告。"],
    trustAnchors: ["Kuala Lumpur", "Petaling Jaya", "Shah Alam", "Selangor", "Malaysia"],
    legacyToolsReplaced: ["WhatsApp 接单", "Excel 报价追踪", "纸本送货单", "人工收款提醒"],
    questionHeadings: ["批发分销商如何替代人工 WhatsApp 订单追踪？", "报价、库存检查、送货与收款状态如何连接成一个流程？", "老板如何减少漏单和不清楚的收款跟进？"],
    modules: [
      { title: "报价到订单", description: "追踪报价请求、审批、客户确认、订单状态与交接。" },
      { title: "库存与交付", description: "连接库存可用量、包装、送货单与交付异常。" },
      { title: "收款控制", description: "监控客户余额、付款承诺、账龄与跟进负责人。" },
    ],
  },
  "professional-services": {
    ...en["professional-services"],
    insideLabel: "里面包含",
    resultLabel: "最后结果",
    inside: ["项目管道", "客户文件", "审批记录", "交付里程碑"],
    result: "专业服务团队从同一套系统看见项目、客户、文件、审批与期限。",
    painPoints: ["客户文件、审批、修改轮次和交付里程碑分散在聊天、电邮、云端硬盘和表格。", "团队浪费时间确认范围、负责人、期限、版本和审批状态。", "老板无法清楚看见项目风险、工作量、逾期事项和客户跟进。"],
    trustAnchors: ["Kuala Lumpur", "Petaling Jaya", "Shah Alam", "Selangor", "Malaysia"],
    legacyToolsReplaced: ["WhatsApp 审批记录", "Excel 项目追踪", "云端文件夹寻找", "人工期限提醒"],
    questionHeadings: ["Agency 如何用结构化流程替代人工 WhatsApp 审批？", "客户文件、修改、期限与审批如何在同一个项目空间可视化？", "专业服务老板如何不靠人工追进度也看见交付风险？"],
    modules: [
      { title: "项目工作区", description: "整理客户、范围、里程碑、负责人、期限与交付状态。" },
      { title: "文件与审批", description: "追踪文件、审核轮次、客户审批、内部审批与版本状态。" },
      { title: "管理复盘", description: "让管理层看见工作量、逾期事项、交付风险与客户跟进。" },
    ],
  },
}

export function getSolutionBlueprint(locale: Locale, slug: string) {
  return (locale === "zh" ? zh : en)[slug]
}

export function getSolutionBlueprints(locale: Locale) {
  return locale === "zh" ? zh : en
}
