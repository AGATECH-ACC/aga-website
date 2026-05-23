import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { websiteClasses } from "@/styles/tokens"

import { BilingualText, type WebsiteText } from "./shared"

type SectionHeaderProps = {
  eyebrow?: WebsiteText
  title: WebsiteText
  accent?: WebsiteText
  description?: WebsiteText
  align?: "left" | "center"
}

export function SectionHeader({
  eyebrow,
  title,
  accent,
  description,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "mx-auto max-w-3xl text-center"
      )}
    >
      {eyebrow ? (
        <Badge
          className={cn("w-fit", align === "center" && "mx-auto")}
          variant="secondary"
        >
          <BilingualText text={eyebrow} />
        </Badge>
      ) : null}
      <h2 className={websiteClasses.h2}>
        <BilingualText text={title} className="text-foreground" />
        {accent ? (
          <span className="text-system">
            {" "}
            <BilingualText text={accent} />
          </span>
        ) : null}
      </h2>
      {description ? (
        <p className={cn("max-w-2xl text-base leading-7 text-muted-foreground", align === "center" && "mx-auto")}>
          <BilingualText text={description} />
        </p>
      ) : null}
    </div>
  )
}
