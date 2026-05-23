import { cn } from "@/lib/utils"
import { websiteClasses } from "@/styles/tokens"

export type BilingualText = {
  en: string
  zh?: string
}

export type WebsiteText = BilingualText | string

export function getWebsiteTextKey(text: WebsiteText) {
  return typeof text === "string" ? text : text.en
}

export function BilingualText({
  text,
  className,
  muted = false,
}: {
  text: WebsiteText
  className?: string
  muted?: boolean
}) {
  if (typeof text === "string") {
    return (
      <span
        className={cn(
          "tracking-normal",
          muted && "text-muted-foreground",
          className
        )}
      >
        {text}
      </span>
    )
  }

  return (
    <span
      className={cn(
        "tracking-normal",
        muted && "text-muted-foreground",
        className
      )}
    >
      <span>{text.en}</span>
      {text.zh ? (
        <span className={muted ? undefined : "text-muted-foreground"}>
          {" "}
          / {text.zh}
        </span>
      ) : null}
    </span>
  )
}

export function WebsiteContainer({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn(websiteClasses.container, className)}>{children}</div>
  )
}

export function WebsiteSection({
  className,
  children,
  compact = false,
  id,
}: {
  className?: string
  children: React.ReactNode
  compact?: boolean
  id?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        compact ? websiteClasses.sectionCompact : websiteClasses.section,
        className
      )}
    >
      {children}
    </section>
  )
}
