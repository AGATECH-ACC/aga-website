"use client"

import { useEffect, useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motionClasses } from "@/styles/motion"

import { BilingualText, type WebsiteText } from "./shared"

type StatItem = {
  value: string
  target?: number
  suffix?: string
  label: WebsiteText
}

type StatsGridProps = {
  stats?: StatItem[]
}

export function StatsGrid({
  stats = [
    { value: "50+", label: { en: "Delivered projects" } },
    { value: "70%", label: { en: "Growth average" } },
    { value: "200+", label: { en: "Hours saved monthly" } },
  ],
}: StatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.value} className={cn("text-center", motionClasses.scaleIn)}>
          <CardContent className="flex flex-col items-center gap-2 py-6">
            <div className="text-4xl font-semibold tracking-normal text-system md:text-5xl">
              <AnimatedStatValue value={stat.value} target={stat.target} suffix={stat.suffix} />
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

function AnimatedStatValue({ value, target, suffix }: { value: string; target?: number; suffix?: string }) {
  const parsed = /^(\d+)(.*)$/.exec(value)
  const animationTarget = target ?? (parsed ? Number(parsed[1]) : 0)
  const displaySuffix = suffix ?? parsed?.[2] ?? ""
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!animationTarget) {
      return
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionFrame = requestAnimationFrame(() => setCount(animationTarget))

      return () => cancelAnimationFrame(reducedMotionFrame)
    }

    let frame = 0
    const duration = 1100
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setCount(Math.round(animationTarget * eased))

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [animationTarget])

  if (!parsed && target === undefined) {
    return value
  }

  return (
    <>
      {count}
      {displaySuffix}
    </>
  )
}
