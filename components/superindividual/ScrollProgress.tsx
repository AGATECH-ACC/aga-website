"use client"

import { useEffect, useState } from "react"

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight
      const nextProgress =
        scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0
      setProgress(Math.min(100, Math.max(0, nextProgress)))
    }

    updateProgress()
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress)

    return () => {
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-1 bg-white/5"
    >
      <div
        className="h-full bg-gradient-to-r from-[#E8521A] via-[#ff8a42] to-[#E8521A] shadow-[0_0_20px_rgba(232,82,26,0.55)] transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
