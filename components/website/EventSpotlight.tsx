"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, CalendarDays, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { websiteClasses } from "@/styles/tokens"

type EventSpotlightProps = {
  eyebrow: string
  title: string
  description: string
  href: string
  action: string
}

export function EventSpotlight({
  eyebrow,
  title,
  description,
  href,
  action,
}: EventSpotlightProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) {
    return null
  }

  return (
    <section className="sticky top-0 z-[60] border-b bg-foreground text-background shadow-lg">
      <div
        className={cn(
          websiteClasses.container,
          "flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <CalendarDays className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-background/55">
              {eyebrow}
            </p>
            <h2 className="text-base font-semibold tracking-normal md:text-lg">
              {title}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-background/70">
              {description}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 self-start md:self-center">
          <Button asChild size="sm" className="bg-background text-foreground hover:bg-background/90">
            <Link href={href}>
              {action}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <button
            type="button"
            aria-label="Close spotlight event"
            onClick={() => setVisible(false)}
            className="grid size-8 place-items-center rounded-full border border-background/15 text-background/70 transition-colors hover:bg-background/10 hover:text-background"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
