import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motionClasses } from "@/styles/motion"
import { websiteClasses } from "@/styles/tokens"

import { BilingualText, WebsiteContainer, type WebsiteText } from "./shared"

type CTASectionProps = {
  title?: WebsiteText
  description?: WebsiteText
  action?: WebsiteText
  trustLine?: WebsiteText
}

export function CTASection({
  title = { en: "Ready to systemize your business?", zh: "准备好开始系统化了吗？" },
  description = {
    en: "Use one strong system foundation before scaling new teams and workflows.",
    zh: "在扩展团队与流程前，先建立一个强大的系统基础。",
  },
  action = { en: "Book demo", zh: "预约免费演示" },
  trustLine = { en: "Start with one business diagnosis to identify your system and automation opportunities.", zh: "从一次业务诊断开始，找出你的系统化与自动化机会。" },
}: CTASectionProps) {
  return (
    <WebsiteContainer>
      <section
        className={cn(
          "relative overflow-hidden rounded-3xl bg-system p-6 text-system-foreground md:p-10",
          motionClasses.fadeUp
        )}
      >
        <div className="absolute -right-16 -top-16 size-56 rounded-full bg-primary/25 blur-3xl" />
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex max-w-3xl flex-col gap-3">
            <h2 className={websiteClasses.h2}>
              <BilingualText text={title} />
            </h2>
            <p className="text-base leading-7 opacity-80">
              <BilingualText text={description} />
            </p>
            <p className="rounded-2xl border border-system-foreground/15 bg-background/10 px-4 py-3 text-sm leading-6">
              <BilingualText text={trustLine} />
            </p>
          </div>
          <Button size="lg" variant="primary">
            <BilingualText text={action} />
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </section>
    </WebsiteContainer>
  )
}
