import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { websiteClasses } from "@/styles/tokens"

import { BilingualText, WebsiteContainer, type BilingualText as BilingualTextType } from "./shared"

type LogoStripProps = {
  label?: BilingualTextType
  logos?: string[]
}

export function LogoStrip({
  label = { en: "Trusted by growing teams" },
  logos = ["LOGO", "LUMI", "IPSM", "BOGO", "WAVE", "NOVA"],
}: LogoStripProps) {
  return (
    <div className="border-y bg-muted/30 py-6">
      <WebsiteContainer className="flex flex-col gap-4 md:flex-row md:items-center">
        <Badge variant="outline" className="w-fit">
          <BilingualText text={label} />
        </Badge>
        <div
          className={cn(
            "grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6",
            websiteClasses.cardRadius
          )}
        >
          {logos.map((logo) => (
            <div
              key={logo}
              className="flex h-10 items-center justify-center rounded-lg border bg-background text-sm font-semibold text-muted-foreground"
            >
              {logo}
            </div>
          ))}
        </div>
      </WebsiteContainer>
    </div>
  )
}
