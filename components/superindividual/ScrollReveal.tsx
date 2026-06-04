"use client"

import { useEffect, useRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type ScrollRevealProps = {
  children: ReactNode
  className?: string
}

export function ScrollReveal({ children, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }

    const revealIfInView = () => {
      const rect = element.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        element.classList.add("is-visible")
        return true
      }
      return false
    }

    if (revealIfInView()) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          element.classList.add("is-visible")
          observer.unobserve(element)
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn("superindividual-reveal", className)}>
      {children}
    </div>
  )
}
