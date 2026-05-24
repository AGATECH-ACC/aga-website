"use client"

import { useMemo, useState } from "react"

import { cn } from "@/lib/utils"

import { BilingualText, type WebsiteText } from "./shared"

type ProcessStep = {
  step: string
  title: WebsiteText
  description: WebsiteText
}

type ProcessTimelineProps = {
  steps?: ProcessStep[]
  tabs?: Array<{
    label: string
    steps: ProcessStep[]
  }>
  productLabel?: string
  visualLabel?: string
}

export function ProcessTimeline({
  steps = [
    {
      step: "01",
      title: { en: "Consult" },
      description: { en: "Understand workflows." },
    },
    {
      step: "02",
      title: { en: "Design" },
      description: { en: "Shape the system." },
    },
    {
      step: "03",
      title: { en: "Build" },
      description: { en: "Automate operations." },
    },
    {
      step: "04",
      title: { en: "Train" },
      description: { en: "Enable the team." },
    },
    {
      step: "05",
      title: { en: "Support" },
      description: { en: "Improve long-term." },
    },
  ],
  tabs,
  productLabel = "Product",
  visualLabel = "Process image area",
}: ProcessTimelineProps) {
  const fallbackTabs = useMemo(
    () => [
      { label: "AGA Flow", steps: steps.slice(0, 3) },
      { label: "AGA Sales", steps: steps.slice(0, 3) },
      { label: "AGA AI", steps: steps.slice(0, 3) },
    ],
    [steps]
  )
  const timelineTabs = tabs?.length ? tabs : fallbackTabs
  const [activeTab, setActiveTab] = useState(0)
  const activeSteps = timelineTabs[activeTab]?.steps.slice(0, 3) ?? steps.slice(0, 3)

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-system">
          {productLabel}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {timelineTabs.map((item, index) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveTab(index)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                index === activeTab
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-system/10 hover:text-system"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative grid gap-8 md:grid-cols-3 md:items-start">
        <div className="absolute bottom-8 left-4 top-4 border-l border-dashed border-muted-foreground/35 md:hidden" />
        <div className="absolute left-[12%] right-[12%] top-4 hidden border-t border-dashed border-muted-foreground/40 md:block" />
        {activeSteps.map((item, index) => (
          <div
            key={`${timelineTabs[activeTab]?.label}-${item.step}`}
            className="relative grid grid-cols-[2rem_1fr] gap-x-4 gap-y-3 md:flex md:flex-col md:items-center md:text-center"
          >
            <span className="relative z-10 grid size-8 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground ring-8 ring-background">
              {index + 1}
            </span>
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-semibold tracking-normal">
                <BilingualText text={item.title} />
              </h3>
              <div className="rounded-2xl bg-system/10 px-6 py-5 text-base font-medium leading-7 text-foreground">
                <BilingualText text={item.description} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-sm font-medium text-muted-foreground">
        {visualLabel}
      </p>
    </div>
  )
}
