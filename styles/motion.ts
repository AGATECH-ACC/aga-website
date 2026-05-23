export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2, ease: "easeOut" },
} as const

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.24, ease: "easeOut" },
} as const

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: "easeOut" },
} as const

export const slideLeft = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.24, ease: "easeOut" },
} as const

export const motionPresets = {
  fadeIn,
  fadeUp,
  scaleIn,
  slideLeft,
} as const

export const motionClasses = {
  fadeIn: "animate-in fade-in duration-300",
  fadeUp: "animate-in fade-in slide-in-from-bottom-3 duration-300",
  scaleIn: "animate-in fade-in zoom-in-95 duration-300",
  slideLeft: "animate-in fade-in slide-in-from-right-4 duration-300",
  floatSlow: "motion-safe:animate-float-slow",
} as const
