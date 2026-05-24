import type { Locale } from "@/lib/i18n/dictionary"

export type SolutionBlueprint = {
  slug: string
  image: string
  insideLabel: string
  resultLabel: string
  inside: string[]
  result: string
  modules: Array<{ title: string; description: string }>
}

const en: Record<string, SolutionBlueprint> = {
  "education-training": {
    slug: "education-training",
    image: "/assets/aga-hero-3.png",
    insideLabel: "Inside",
    resultLabel: "End result",
    inside: ["Enrollment pipeline", "Course scheduling", "Student follow-up", "Payment visibility"],
    result:
      "Owners see enrollment, class delivery, teacher workload, and follow-up status without checking multiple chats.",
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
    image: "/assets/aga-hero-2.png",
    insideLabel: "Inside",
    resultLabel: "End result",
    inside: ["Outlet task checks", "Stock movement", "Staffing rhythm", "Daily sales view"],
    result:
      "F&B teams run outlet routines consistently while owners see sales, stock, staffing, and finance signals faster.",
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
    image: "/assets/aga-hero-4.png",
    insideLabel: "Inside",
    resultLabel: "End result",
    inside: ["Booking intake", "Task dispatch", "Customer updates", "Completion proof"],
    result:
      "Service teams know who handles each job, customers receive clearer updates, and owners see execution quality.",
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
    image: "/assets/aga-hero-5.png",
    insideLabel: "Inside",
    resultLabel: "End result",
    inside: ["Quotation flow", "Order tracking", "Inventory checks", "Collection status"],
    result:
      "Wholesale teams reduce missed orders, quote confusion, inventory surprises, and unclear collection follow-up.",
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
    image: "/assets/aga-hero-1.png",
    insideLabel: "Inside",
    resultLabel: "End result",
    inside: ["Project pipeline", "Client files", "Approval trail", "Delivery milestones"],
    result:
      "Professional teams keep projects, clients, documents, approvals, and deadlines visible from one shared system.",
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
