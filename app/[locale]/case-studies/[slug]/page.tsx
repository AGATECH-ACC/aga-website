import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SectionHeader,
  WebsiteContainer,
  WebsiteSection,
} from "@/components/website"
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n/dictionary"
import { getCmsCaseStudies } from "@/lib/cms/public-content"

import { LocalizedShell } from "../../_components/LocalizedShell"

export const revalidate = 60

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return locales.flatMap((locale) => {
    const dictionary = getDictionary(locale)

    return dictionary.caseStudyItems.map((item) => ({
      locale,
      slug: item.slug,
    }))
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params

  if (!isLocale(localeParam)) {
    return {}
  }

  const dictionary = getDictionary(localeParam)
  const item = dictionary.caseStudyItems.find((caseStudy) => caseStudy.slug === slug)

  if (!item) {
    return {}
  }

  return {
    title: `${item.title} | AGA`,
    description: item.summary,
  }
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)
  const caseStudies = await getCmsCaseStudies(locale, dictionary.caseStudyItems, {
    includeFallback: false,
  })
  const item = caseStudies.find((caseStudy) => caseStudy.slug === slug)

  if (!item) {
    notFound()
  }

  const labels =
    locale === "zh"
      ? {
          back: "返回案例",
          challenge: "挑战",
          solution: "AGA 如何协助",
          result: "成果",
          snapshot: "项目摘要",
          approach: "实施模板",
          before: "系统化前",
          during: "AGA 介入",
          after: "系统化后",
          measurement: "关键记录",
        }
      : {
          back: "Back to case studies",
          challenge: "Challenge",
          solution: "How AGA Helped",
          result: "Result",
          snapshot: "Project Snapshot",
          approach: "Implementation Template",
          before: "Before Systemization",
          during: "AGA Intervention",
          after: "After Systemization",
          measurement: "What To Measure",
        }

  return (
    <LocalizedShell locale={locale} path={`/${locale}/case-studies/${slug}`}>
      <WebsiteSection>
        <WebsiteContainer className="flex flex-col gap-10">
          <Link
            href={`/${locale}/case-studies`}
            className="inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            {labels.back}
          </Link>

          <div className="rounded-[2rem] border bg-muted/20 p-6 md:p-10">
            <SectionHeader
              eyebrow={item.industry}
              title={item.title}
              accent={item.metric}
              description={item.summary}
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                { title: labels.before, body: item.challenge },
                { title: labels.during, body: item.solution },
                { title: labels.after, body: item.result },
              ].map((block, index) => (
                <Card key={block.title} className="bg-background">
                  <CardHeader>
                    <Badge className="w-fit" variant="secondary">
                      {String(index + 1).padStart(2, "0")}
                    </Badge>
                    <CardTitle>{block.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-muted-foreground">{block.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader>
                <CardTitle>{labels.approach}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm leading-7 text-muted-foreground">
                <p>{item.challenge}</p>
                <p>{item.solution}</p>
                <p>{item.result}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{labels.measurement}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-muted-foreground">
                <p><span className="font-semibold text-foreground">{locale === "zh" ? "行业：" : "Industry:"}</span> {item.industry}</p>
                <p><span className="font-semibold text-foreground">{locale === "zh" ? "核心指标：" : "Main metric:"}</span> {item.metric}</p>
                <p><span className="font-semibold text-foreground">{locale === "zh" ? "流程焦点：" : "Workflow focus:"}</span> {item.summary}</p>
                <p><span className="font-semibold text-foreground">{locale === "zh" ? "可复盘内容：" : "Review points:"}</span> {locale === "zh" ? "挑战、方案、成果，以及团队采用后的执行节奏。" : "Challenge, solution, result, and the operating rhythm after adoption."}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { title: labels.challenge, body: item.challenge },
              { title: labels.solution, body: item.solution },
              { title: labels.result, body: item.result },
            ].map((block) => (
              <Card key={block.title} className="bg-muted/20">
                <CardHeader>
                  <CardTitle>{block.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-muted-foreground">{block.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </WebsiteContainer>
      </WebsiteSection>
    </LocalizedShell>
  )
}
