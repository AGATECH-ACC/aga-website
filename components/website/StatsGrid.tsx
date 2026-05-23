"use client"

import { useEffect, useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motionClasses } from "@/styles/motion"

import { BilingualText, type WebsiteText } from "./shared"

type StatItem = {
  value: string
  label: WebsiteText
}

type StatsGridProps = {
  stats?: StatItem[]
}

export function StatsGrid({
  stats = [
    { value: "50+", label: { en: "Delivered projects", zh: "已交付项目" } },
    { value: "70%", label: { en: "Growth average", zh: "平均业务增长" } },
    { value: "200+", label: { en: "Hours saved monthly", zh: "每月节省人时" } },
  ],
}: StatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.value} className={cn("text-center", motionClasses.scaleIn)}>
          <CardContent className="flex flex-col items-center gap-2 py-6">
            <div className="text-4xl font-semibold tracking-normal text-system md:text-5xl">
              <AnimatedStatValue value={stat.value} />
            </div>
            <p className="text-sm leading-5 text-muted-foreground">
              <BilingualText text={stat.label} />
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function AnimatedStatValue({ value }: { value: string }) {
  const parsed = /^(\d+)(.*)$/.exec(value)
  const target = parsed ? Number(parsed[1]) : 0
  const suffix = parsed?.[2] ?? ""
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!target) {
      return
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionFrame = requestAnimationFrame(() => setCount(target))

      return () => cancelAnimationFrame(reducedMotionFrame)
    }

    let frame = 0
    const duration = 1100
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setCount(Math.round(target * eased))

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [target])

  if (!parsed) {
    return value
  }

  return (
    <>
      {count}
      {suffix}
    </>
  )
}
