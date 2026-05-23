export const colors = {
  background: "var(--background)",
  foreground: "var(--foreground)",
  card: "var(--card)",
  cardForeground: "var(--card-foreground)",
  primary: "var(--primary)",
  primaryForeground: "var(--primary-foreground)",
  secondary: "var(--secondary)",
  secondaryForeground: "var(--secondary-foreground)",
  muted: "var(--muted)",
  mutedForeground: "var(--muted-foreground)",
  accent: "var(--accent)",
  accentForeground: "var(--accent-foreground)",
  border: "var(--border)",
  input: "var(--input)",
  ring: "var(--ring)",
  system: "var(--system)",
  systemForeground: "var(--system-foreground)",
  destructive: "var(--destructive)",
} as const

export const spacing = {
  none: "0",
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
} as const

export const radius = {
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  full: "9999px",
} as const

export const typography = {
  h1: {
    fontSize: "clamp(2.25rem, 7vw, 4.5rem)",
    lineHeight: "1",
    fontWeight: "600",
  },
  h2: {
    fontSize: "clamp(1.75rem, 4vw, 3rem)",
    lineHeight: "1.08",
    fontWeight: "600",
  },
  h3: {
    fontSize: "1.125rem",
    lineHeight: "1.35",
    fontWeight: "600",
  },
  body: {
    fontSize: "1rem",
    lineHeight: "1.6",
    fontWeight: "400",
  },
  caption: {
    fontSize: "0.875rem",
    lineHeight: "1.4",
    fontWeight: "400",
  },
} as const

export const shadow = {
  sm: "0 1px 2px color-mix(in oklab, var(--foreground) 8%, transparent)",
  md: "0 8px 24px color-mix(in oklab, var(--foreground) 10%, transparent)",
  lg: "0 20px 60px color-mix(in oklab, var(--foreground) 12%, transparent)",
} as const

export const tokens = {
  colors,
  spacing,
  radius,
  typography,
  shadow,
} as const

export const websiteClasses = {
  section: "py-16 md:py-24",
  sectionCompact: "py-10 md:py-14",
  container: "mx-auto w-full max-w-6xl px-4 md:px-8",
  sectionGap: "gap-8 md:gap-12",
  cardRadius: "rounded-xl",
  imageRadius: "rounded-2xl",
  h1: "text-4xl font-semibold leading-tight tracking-normal md:text-6xl",
  h2: "text-3xl font-semibold leading-tight tracking-normal md:text-5xl",
  h3: "text-xl font-semibold leading-snug tracking-normal",
  body: "text-base leading-7",
  caption: "text-sm leading-5",
} as const
