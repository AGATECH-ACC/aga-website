import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SectionHeader,
  WebsiteContainer,
  WebsiteSection,
} from "@/components/website"
import { getDictionary, isLocale, type Locale } from "@/lib/i18n/dictionary"
import { getCmsCaseStudies } from "@/lib/cms/public-content"

import { LocalizedShell } from "../_components/LocalizedShell"

export const revalidate = 60

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function CaseStudiesPage({ params }: PageProps) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)
  const caseStudies = await getCmsCaseStudies(locale, dictionary.caseStudyItems, {
    includeFallback: false,
  })

  return (
    <LocalizedShell locale={locale} path={`/${locale}/case-studies`}>
      <WebsiteSection>
        <WebsiteContainer className="flex flex-col gap-10">
          <SectionHeader
            eyebrow={dictionary.pages.caseStudies.eyebrow}
            title={dictionary.pages.caseStudies.title}
            accent={dictionary.pages.caseStudies.accent}
            description={dictionary.pages.caseStudies.description}
          />

          {caseStudies.length ? (
            <div className="grid gap-5 md:grid-cols-3">
              {caseStudies.map((item) => (
                <Link key={item.slug} href={`/${locale}/case-studies/${item.slug}`}>
                  <Card className="group h-full overflow-hidden bg-muted/20 transition-transform hover:-translate-y-1">
                    <div className="relative h-44 overflow-hidden bg-foreground">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--primary)/0.45),transparent_30%),linear-gradient(135deg,hsl(var(--system)/0.65),hsl(var(--foreground)))]" />
                      <div className="absolute left-5 top-5 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground">
                        {item.industry}
                      </div>
                      <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-background/20 bg-background/10 p-4 text-background backdrop-blur-md">
                        <p className="text-3xl font-semibold tracking-normal">
                          {item.metric.split(" ")[0] || item.metric}
                        </p>
                        <p className="mt-1 text-xs text-background/75">{item.metric}</p>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <p className="text-sm leading-6 text-muted-foreground">
                        {item.summary}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        {locale === "zh" ? "查看案例" : "View case study"}
                        <ArrowUpRight className="size-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-muted-foreground">
                {locale === "zh"
                  ? "暂无已发布案例。请到后台案例管理新增并设为上线。"
                  : "No live case studies yet. Add and publish records from Admin → Case Studies."}
              </CardContent>
            </Card>
          )}
        </WebsiteContainer>
      </WebsiteSection>
    </LocalizedShell>
  )
}
