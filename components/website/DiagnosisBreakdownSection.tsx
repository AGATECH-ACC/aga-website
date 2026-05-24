import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n/dictionary"
import { WebsiteContainer, WebsiteSection } from "./shared"

const content = {
  en: {
    eyebrow: "Free business diagnosis",
    heading: "Here's what happens in your 30 minutes",
    note: "Free. No commitment. No sales pressure until you're ready.",
    cta: "Book My Free Diagnosis →",
    steps: [
      {
        step: "1",
        time: "Min 0-10",
        body: "We map your current workflow: how sales, operations, and finance actually run today — including where things get stuck.",
        tag: "Workflow map",
      },
      {
        step: "2",
        time: "Min 10-20",
        body: "We identify your top 3 automation and systemization opportunities — what to fix first for the fastest business impact.",
        tag: "Top 3 priorities",
      },
      {
        step: "3",
        time: "Min 20-30",
        body: "You walk away with a prioritized systemization plan — a clear first-step roadmap you can act on immediately, no commitment required.",
        tag: "Action plan — yours to keep",
      },
    ],
  },
  zh: {
    eyebrow: "免费业务诊断",
    heading: "30 分钟里会发生什么",
    note: "免费。无需承诺。准备好之前，不会有销售压力。",
    cta: "预约我的免费诊断 →",
    steps: [
      {
        step: "1",
        time: "第 0-10 分钟",
        body: "我们梳理你现在的工作流：销售、运营、财务实际如何运作，以及哪里卡住。",
        tag: "流程地图",
      },
      {
        step: "2",
        time: "第 10-20 分钟",
        body: "我们找出最值得优先处理的 3 个自动化与系统化机会，让你先解决最有业务影响的问题。",
        tag: "前三个优先事项",
      },
      {
        step: "3",
        time: "第 20-30 分钟",
        body: "你会带走一份按优先级整理的系统化行动计划：清楚知道第一步该怎么做，不需要马上承诺合作。",
        tag: "行动计划",
      },
    ],
  },
} as const

export function DiagnosisBreakdownSection({ locale = "en" }: { locale?: Locale }) {
  const copy = content[locale]

  return (
    <WebsiteSection className="bg-background pb-8 pt-10 md:pb-8 md:pt-12">
      <WebsiteContainer>
        <div className="overflow-hidden rounded-[28px] border bg-foreground p-5 text-background shadow-2xl md:p-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-background/55">
              {copy.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal md:text-5xl">
              {copy.heading}
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {copy.steps.map((item) => (
              <article
                key={item.step}
                className="group flex h-full flex-col rounded-3xl bg-background p-6 text-foreground shadow-xl shadow-black/10 ring-1 ring-background/10 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid size-12 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25">
                    {item.step}
                  </div>
                  <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {item.time}
                  </div>
                </div>
                <p className="mt-7 flex-1 text-sm leading-7 text-muted-foreground">{item.body}</p>
                <span className="mt-6 w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {item.tag}
                </span>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <p className="text-sm font-semibold text-background/72">
              {copy.note}
            </p>
            <Button asChild variant="primary" size="lg" className="shadow-lg shadow-primary/25">
              <Link href="https://client.agaventures.ai/enquiry">
                {copy.cta}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </div>
      </WebsiteContainer>
    </WebsiteSection>
  )
}
