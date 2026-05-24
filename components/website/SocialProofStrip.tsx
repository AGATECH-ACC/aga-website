import { cn } from "@/lib/utils"
import { websiteClasses as wc } from "@/styles/tokens"

type SocialProofStripProps = {
  label?: string
  logos?: readonly {
    id: string
    name: string
    imageUrl: string
    linkUrl?: string
  }[]
  className?: string
}

export function SocialProofStrip({
  label = "Trusted by growth-stage businesses across Malaysia",
  logos = [],
  className,
}: SocialProofStripProps) {
  if (!logos.length) return null

  const marqueeLogos = [...logos, ...logos]

  return (
    <section className={cn("border-t border-border bg-background py-10", className)}>
      <div className={cn(wc.container, "flex flex-col gap-7 overflow-hidden")}>
        {label && (
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
        )}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
          <div className="flex w-max animate-marquee-left gap-4">
            {marqueeLogos.map((logo, index) => (
              <LogoTile key={`${logo.id}-${index}`} logo={logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function LogoTile({
  logo,
}: {
  logo: {
    name: string
    imageUrl: string
    linkUrl?: string
  }
}) {
  const content = (
    <div className="grid h-14 min-w-36 place-items-center px-6 md:min-w-44">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.imageUrl}
        alt={logo.name}
        className="max-h-9 max-w-32 object-contain grayscale transition duration-300 hover:grayscale-0"
      />
    </div>
  )

  if (!logo.linkUrl) {
    return content
  }

  return (
    <a href={logo.linkUrl} aria-label={logo.name}>
      {content}
    </a>
  )
}
