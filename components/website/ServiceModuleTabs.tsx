import Link from "next/link"
import {
  ArrowUpRight,
  BadgeDollarSign,
  Bot,
  ChartNoAxesCombined,
  DatabaseZap,
  Workflow,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { websiteClasses } from "@/styles/tokens"

import { BilingualText, getWebsiteTextKey, type WebsiteText } from "./shared"

type ServiceVisualKind =
  | "workflow"
  | "operations"
  | "sales"
  | "finance"
  | "ai"

type ServiceModule = {
  title: WebsiteText
  description: WebsiteText
  href?: string
  visualKind?: ServiceVisualKind
}

type ServiceModuleTabsProps = {
  modules?: ServiceModule[]
  visualNote?: string
}

export function ServiceModuleTabs({
  modules = [
    {
      title: { en: "Business systems", zh: "业务系统" },
      description: {
        en: "Automated cross-team workflows and approvals.",
        zh: "自动化跨团队任务流、审批与文档管理。",
      },
    },
    {
      title: { en: "Sales and customers", zh: "销售与客户管理" },
      description: { en: "CRM and customer visibility.", zh: "客户关系与销售流程可视化。" },
    },
    {
      title: { en: "Marketing automation", zh: "营销自动化" },
      description: { en: "Repeatable campaigns and journeys.", zh: "可复用活动与客户旅程。" },
    },
    {
      title: { en: "Finance and budgets", zh: "财务与预算" },
      description: { en: "Reporting and planning systems.", zh: "报表、预算与计划系统。" },
    },
  ],
  visualNote = "System modules stay reusable across service, solution, and event pages.",
}: ServiceModuleTabsProps) {
  const activeModule = modules[0]

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_0.95fr] md:items-stretch">
      <div className="flex flex-col divide-y rounded-xl border bg-background">
        {modules.map((module, index) => (
          <ServiceModuleRow
            key={getWebsiteTextKey(module.title)}
            module={module}
            active={index === 0}
          />
        ))}
      </div>
      <Card className="min-h-96">
        <CardContent className="relative flex min-h-96 items-end overflow-hidden p-4">
          <ServiceVisual kind={activeModule?.visualKind ?? "workflow"} />
          <div
            className={cn(
              websiteClasses.imageRadius,
              "relative w-full bg-foreground p-6 text-background shadow-xl"
            )}
          >
            <p className="max-w-sm text-base leading-7">
              {visualNote}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ServiceModuleRow({
  module,
  active,
}: {
  module: ServiceModule
  active?: boolean
}) {
  const content = (
    <div
      className={cn(
        "group flex items-start justify-between gap-4 p-5 text-left transition-colors",
        active && "border-l-4 border-system bg-muted/50",
        module.href && "hover:bg-muted/60"
      )}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold tracking-normal">
          <BilingualText text={module.title} />
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          <BilingualText text={module.description} />
        </p>
      </div>
      {module.href ? (
        <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-full border text-system transition-colors group-hover:border-system group-hover:bg-system group-hover:text-system-foreground">
          <ArrowUpRight className="size-4" />
        </span>
      ) : null}
    </div>
  )

  if (!module.href) {
    return content
  }

  return (
    <Link href={module.href} className="focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
      {content}
    </Link>
  )
}

function ServiceVisual({ kind }: { kind: ServiceVisualKind }) {
  const Icon = {
    workflow: Workflow,
    operations: DatabaseZap,
    sales: ChartNoAxesCombined,
    finance: BadgeDollarSign,
    ai: Bot,
  }[kind]

  const labels = {
    workflow: ["Process map", "Approval", "Tasks"],
    operations: ["Lark", "ERP", "Workflow"],
    sales: ["Leads", "Pipeline", "Follow-up"],
    finance: ["Revenue", "Cost", "Cash flow"],
    ai: ["Agent", "Trigger", "Action"],
  }[kind]

  return (
    <div className="absolute inset-4 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,hsl(var(--muted)),hsl(var(--background)))]">
      <div className="absolute -right-12 -top-16 size-48 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-16 left-10 size-56 rounded-full bg-system/20 blur-3xl" />
      <div className="relative grid h-full place-items-center p-8">
        <div className="w-full max-w-sm rounded-2xl border bg-background/90 p-5 shadow-xl backdrop-blur">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">AGA System View</p>
              <p className="text-lg font-semibold tracking-normal">Module preview</p>
            </div>
            <div className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Icon className="size-5" />
            </div>
          </div>
          <div className="grid gap-3">
            {labels.map((label, index) => (
              <div key={label} className="flex items-center gap-3 rounded-xl bg-muted p-3">
                <span className="grid size-7 place-items-center rounded-full bg-system/10 text-xs font-semibold text-system">
                  {index + 1}
                </span>
                <span className="text-sm font-medium">{label}</span>
                <span className="ml-auto h-2 w-20 rounded-full bg-system/70" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
