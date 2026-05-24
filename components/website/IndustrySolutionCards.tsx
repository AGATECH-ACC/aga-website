import Link from "next/link"
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Handshake,
  Utensils,
  Warehouse,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { BilingualText, getWebsiteTextKey, type WebsiteText } from "./shared"

type IndustryCard = {
  title: WebsiteText
  description?: WebsiteText
  active?: boolean
  href?: string
  visualKind?: "education" | "fnb" | "services" | "wholesale" | "professional"
}

type IndustrySolutionCardsProps = {
  industries?: IndustryCard[]
  ctaLabel?: WebsiteText
}

export function IndustrySolutionCards({
  industries = [
    { title: { en: "Accounting" } },
    { title: { en: "Manufacturing" } },
    { title: { en: "Real estate" } },
    {
      title: { en: "F&B chains" },
      description: { en: "Inventory, staffing, finance." },
      active: true,
    },
    { title: { en: "Retail" } },
  ],
  ctaLabel = { en: "Learn more" },
}: IndustrySolutionCardsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {industries.map((industry) => (
        <IndustryCardItem
          key={getWebsiteTextKey(industry.title)}
          industry={industry}
          ctaLabel={ctaLabel}
        />
      ))}
    </div>
  )
}

function IndustryCardItem({
  industry,
  ctaLabel,
}: {
  industry: IndustryCard
  ctaLabel: WebsiteText
}) {
  const Icon = {
    education: GraduationCap,
    fnb: Utensils,
    services: BriefcaseBusiness,
    wholesale: Warehouse,
    professional: Handshake,
  }[industry.visualKind ?? "services"]

  const card = (
    <Card
      className={cn(
        "group min-h-64 overflow-hidden bg-muted/30 transition-transform hover:-translate-y-1",
        industry.active && "border-system bg-system text-system-foreground"
      )}
    >
      <CardContent className="relative flex min-h-64 flex-col justify-end gap-3 overflow-hidden p-5">
        <div
          className={cn(
            "absolute inset-0 bg-muted/30",
            industry.active && "bg-system"
          )}
        />
        <div className={cn(
          "absolute inset-x-4 top-4 h-32 overflow-hidden rounded-2xl border bg-background/80",
          !industry.active && "bg-muted/30"
        )}>
          <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--system)/0.16),transparent_55%,hsl(var(--primary)/0.18))]" />
          <div className="absolute right-4 top-4 grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Icon className="size-6" />
          </div>
          <div className="absolute bottom-4 left-4 right-20 grid gap-2">
            <span className="h-2 rounded-full bg-system/70" />
            <span className="h-2 w-2/3 rounded-full bg-muted-foreground/20" />
            <span className="h-2 w-1/2 rounded-full bg-muted-foreground/20" />
          </div>
        </div>
        <div className="relative mt-36 flex flex-col gap-3">
          <Badge className="w-fit" variant={industry.active ? "secondary" : "outline"}>
            <BilingualText text={industry.title} />
          </Badge>
          {industry.description ? (
            <p className="text-sm leading-5 opacity-80">
              <BilingualText text={industry.description} />
            </p>
          ) : null}
          {industry.href ? (
            <span className="inline-flex items-center gap-2 text-sm font-medium">
              <BilingualText text={ctaLabel} />
              <ArrowRight data-icon="inline-end" />
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )

  if (!industry.href) {
    return card
  }

  return (
    <Link href={industry.href} className="focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
      {card}
    </Link>
  )
}
