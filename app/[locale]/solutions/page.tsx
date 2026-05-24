import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, CheckCircle2 } from "lucide-react"

import { getDictionary, isLocale, type Locale } from "@/lib/i18n/dictionary"
import { getCmsIndustries } from "@/lib/cms/public-content"
import { getSolutionBlueprints } from "@/lib/solutions/blueprints"
import { cn } from "@/lib/utils"

import { LocalizedShell } from "../_components/LocalizedShell"
import { SectionHeader, WebsiteContainer, WebsiteSection } from "@/components/website"

export const revalidate = 60

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function SolutionsPage({ params }: PageProps) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)
  const industries = await getCmsIndustries(locale, dictionary.industriesSection.industries)
  const blueprints = getSolutionBlueprints(locale)
  const labels =
    locale === "zh"
      ? { inside: "里面包含", result: "最后结果" }
      : { inside: "Inside the system", result: "End result" }

  return (
    <LocalizedShell locale={locale} path={`/${locale}/solutions`}>
      <WebsiteSection>
        <WebsiteContainer className="flex flex-col gap-10">
          <SectionHeader
            eyebrow={dictionary.industriesSection.eyebrow}
            title={dictionary.pages.solutions.title}
            accent={dictionary.pages.solutions.accent}
            description={dictionary.pages.solutions.description}
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {industries.map((industry) => {
              const slug = industry.href.split("/").filter(Boolean).at(-1) ?? ""
              const blueprint = blueprints[slug]
              const inside = blueprint?.inside ?? []
              const image = blueprint?.image ?? "/assets/aga-hero-1.png"
              const result = blueprint?.result ?? industry.description

              return (
                <Link
                  key={industry.href}
                  href={industry.href}
                  className={cn(
                    "group overflow-hidden rounded-2xl border bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-lg",
                    "active" in industry && industry.active && "border-primary/40"
                  )}
                >
                  <div className="relative aspect-[16/8] bg-muted">
                    <Image
                      src={image}
                      alt={industry.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-white/75">
                        {labels.inside}
                      </p>
                      <h2 className="mt-1 text-2xl font-bold tracking-normal text-white">
                        {industry.title}
                      </h2>
                    </div>
                  </div>
                  <div className="grid gap-5 p-5">
                    <p className="text-sm leading-6 text-muted-foreground">
                      {industry.description}
                    </p>
                    {inside.length ? (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {inside.map((item) => (
                          <span key={item} className="inline-flex items-center gap-2 text-sm font-medium">
                            <CheckCircle2 className="size-4 text-primary" />
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="rounded-xl bg-muted/50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                        {labels.result}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground">
                        {result}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      {dictionary.industriesSection.ctaLabel}
                      <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </WebsiteContainer>
      </WebsiteSection>
    </LocalizedShell>
  )
}
