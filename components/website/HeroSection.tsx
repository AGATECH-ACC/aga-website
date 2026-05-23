import {
  ArrowRight,
  Bot,
  ChartNoAxesColumnIncreasing,
  CircleDollarSign,
  DatabaseZap,
  MessageCircle,
  Workflow,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motionClasses } from "@/styles/motion"
import { websiteClasses } from "@/styles/tokens"

import { BilingualText, WebsiteContainer, type WebsiteText } from "./shared"

type HeroSectionProps = {
  title: WebsiteText
  accent: WebsiteText
  description: WebsiteText
  primaryAction?: WebsiteText
  secondaryAction?: WebsiteText
  visualNote?: string
}

export function HeroSection({
  title,
  accent,
  description,
  primaryAction = { en: "Book demo", zh: "预约免费演示" },
  secondaryAction = { en: "Contact on WhatsApp", zh: "WhatsApp 联系我们" },
  visualNote = "Premium system foundation for scalable business workflows.",
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      <WebsiteContainer className="relative grid min-h-[640px] items-center gap-8 py-10 min-[720px]:grid-cols-[0.9fr_1.1fr] md:py-16">
        <div
          className={cn(
            "relative flex flex-col gap-6 overflow-hidden rounded-[28px] border bg-card p-6 shadow-lg md:p-8",
            motionClasses.fadeUp
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,hsl(var(--primary)/0.16),transparent_34%),linear-gradient(135deg,hsl(var(--system)/0.08),transparent_52%)]" />
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="relative inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            AGA System Steward
          </div>
          <h1 className={cn(websiteClasses.h1, "max-w-3xl min-[720px]:text-5xl lg:text-6xl")}>
            <BilingualText text={title} />
            <span className="block text-primary">
              <BilingualText text={accent} />
            </span>
          </h1>
          <p className="relative max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            <BilingualText text={description} />
          </p>
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" variant="primary">
              <BilingualText text={primaryAction} />
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              className="border-border bg-background text-foreground hover:bg-muted"
              variant="secondary"
            >
              <BilingualText text={secondaryAction} />
              <MessageCircle data-icon="inline-end" />
            </Button>
          </div>
        </div>

        <HeroVisualScroller visualNote={visualNote} />
      </WebsiteContainer>
    </section>
  )
}

function HeroVisualScroller({ visualNote }: { visualNote: string }) {
  const slides = [
    {
      title: "System dashboard",
      subtitle: "企业系统掌控台",
      icon: Bot,
      metric: "70%",
      note: "重复工作可自动化",
    },
    {
      title: "Workflow builder",
      subtitle: "自动化流程",
      icon: Workflow,
      metric: "5",
      note: "关键流程连接",
    },
    {
      title: "Sales pipeline",
      subtitle: "销售跟进系统",
      icon: ChartNoAxesColumnIncreasing,
      metric: "24h",
      note: "自动提醒跟进",
    },
    {
      title: "Finance visibility",
      subtitle: "财务管理报表",
      icon: CircleDollarSign,
      metric: "1",
      note: "老板仪表盘",
    },
    {
      title: "AI agent desk",
      subtitle: "AI Agent 工作台",
      icon: DatabaseZap,
      metric: "AI",
      note: "自动处理任务",
    },
  ]

  return (
    <div className="relative overflow-hidden rounded-[28px]">
      <div className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {slides.map((slide, index) => {
          const Icon = slide.icon

          return (
            <div
              key={slide.title}
              className="min-h-[28rem] min-w-full snap-center rounded-[28px] bg-foreground p-4 text-background shadow-xl"
            >
              <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-[22px] bg-background/8 p-4">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,hsl(var(--primary)/0.2),transparent_30%),radial-gradient(circle_at_0%_100%,hsl(var(--system)/0.28),transparent_36%)]" />
                <div className="flex items-center justify-between rounded-2xl bg-background p-4 text-foreground">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      AGA {slide.title}
                    </p>
                    <h2 className="text-xl font-semibold tracking-normal">
                      {slide.subtitle}
                    </h2>
                  </div>
                  <div className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
                    <Icon data-icon="inline-start" />
                  </div>
                </div>
                <div className="relative grid flex-1 gap-4">
                  <div className="rounded-2xl bg-background p-4 text-foreground">
                    <p className="text-xs text-muted-foreground">Automation flow</p>
                    <div className="mt-4 grid gap-3">
                      {["销售线索", "审批任务", "财务报表"].map((item, itemIndex) => (
                        <div key={item} className="flex items-center gap-3">
                          <span className="grid size-7 place-items-center rounded-full bg-system/10 text-xs font-semibold text-system">
                            {itemIndex + 1}
                          </span>
                          <div className="h-2 flex-1 rounded-full bg-muted">
                            <div
                              className={cn(
                                "h-2 rounded-full bg-system",
                                itemIndex === 0 && "w-4/5",
                                itemIndex === 1 && "w-2/3",
                                itemIndex === 2 && "w-3/5"
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-system p-5 text-system-foreground">
                    <p className="text-4xl font-semibold tracking-normal">
                      {slide.metric}
                    </p>
                    <p className="mt-2 text-sm opacity-80">{slide.note}</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-between text-xs text-background/65">
                  <span>{visualNote}</span>
                  <span>{index + 1}/5</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
