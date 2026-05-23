import { cn } from "@/lib/utils"
import { websiteClasses as wc } from "@/styles/tokens"

type SocialProofStripProps = {
  label?: string
  logos?: readonly string[]
  className?: string
}

export function SocialProofStrip({
  label = "Trusted by ASEAN companies from startups to enterprise",
  logos = [],
  className,
}: SocialProofStripProps) {
  if (!logos.length) return null

  const marqueeLogos = [...logos, ...logos]

  return (
    <section className={cn("border-t border-border bg-muted/20 py-10", className)}>
      <div className={cn(wc.container, "flex flex-col gap-7 overflow-hidden")}>
        {label && (
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
        )}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-muted/20 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-muted/20 to-transparent" />
          <div className="flex w-max animate-marquee-left gap-4">
            {marqueeLogos.map((logo, index) => (
              <div
                key={`${logo}-${index}`}
                className="grid h-16 min-w-40 place-items-center rounded-2xl border bg-background px-6 text-sm font-bold uppercase tracking-widest text-muted-foreground shadow-sm md:min-w-52"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
