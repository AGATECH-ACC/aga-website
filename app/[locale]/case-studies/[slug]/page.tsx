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
import { absoluteUrl, breadcrumbSchema, caseStudyReportSchema, JsonLd } from "@/lib/seo/json-ld"

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

type CaseStudy = Awaited<ReturnType<typeof getCmsCaseStudies>>[number]
type GeoCaseStudy = CaseStudy & {
  locationSignal?: string
  workflowFocus?: string
  agaSystem?: string
  legacyToolsReplaced?: string[]
}

async function getCaseStudy(locale: Locale, slug: string) {
  const dictionary = getDictionary(locale)
  const caseStudies = await getCmsCaseStudies(locale, dictionary.caseStudyItems)

  return caseStudies.find((caseStudy) => caseStudy.slug === slug)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params

  if (!isLocale(localeParam)) {
    return {}
  }

  const item = await getCaseStudy(localeParam, slug)

  if (!item) {
    return {}
  }

  const url = `/${localeParam}/case-studies/${slug}`

  return {
    title: `${item.title} | AGA`,
    description: item.summary,
    alternates: {
      canonical: absoluteUrl(url),
      languages: {
        en: absoluteUrl(`/en/case-studies/${slug}`),
        zh: absoluteUrl(`/zh/case-studies/${slug}`),
      },
    },
    openGraph: {
      title: item.title,
      description: item.summary,
      url: absoluteUrl(url),
      type: "article",
    },
  }
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)
  const item = await getCaseStudy(locale, slug)

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
          snapshot: "影响摘要",
          approach: "实施模板",
          before: "系统化前的业务如何运作？",
          during: "AGA 如何把流程变成可执行系统？",
          after: "系统化后产生什么结果？",
          measurement: "关键记录",
          workflow: "流程焦点",
          proof: "可验证成果",
        }
      : {
          back: "Back to case studies",
          challenge: "Challenge",
          solution: "How AGA Helped",
          result: "Result",
          snapshot: "Impact Snapshot",
          approach: "Implementation Template",
          before: "How did the business operate before systemization?",
          during: "How did AGA turn the workflow into an executable system?",
          after: "What changed after systemization?",
          measurement: "What To Measure",
          workflow: "Workflow focus",
          proof: "Verifiable impact",
        }
  const snapshotItems = buildImpactSnapshot(item, locale)

  return (
    <LocalizedShell locale={locale} path={`/${locale}/case-studies/${slug}`}>
      <JsonLd
        data={[
          caseStudyReportSchema({ locale, ...item }),
          breadcrumbSchema([
            { name: "Home", href: `/${locale}` },
            { name: dictionary.pages.caseStudies.eyebrow, href: `/${locale}/case-studies` },
            { name: item.title, href: `/${locale}/case-studies/${slug}` },
          ]),
        ]}
      />
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
            <ImpactSnapshot title={labels.snapshot} items={snapshotItems} />
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
                <p><span className="font-semibold text-foreground">{labels.workflow}:</span> {item.summary}</p>
                <p><span className="font-semibold text-foreground">{labels.proof}:</span> {item.result}</p>
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

function buildImpactSnapshot(item: GeoCaseStudy, locale: Locale) {
  return locale === "zh"
    ? [
        { label: "行业", value: item.industry },
        { label: "地点信号", value: item.locationSignal || "Malaysia" },
        { label: "影响指标", value: item.metric },
        { label: "流程焦点", value: item.workflowFocus || item.summary },
        { label: "替代旧工具", value: item.legacyToolsReplaced?.join("、") || "WhatsApp、Excel、人工提醒" },
        { label: "AGA 系统", value: item.agaSystem || "OneSystem + Workflow Registry" },
        { label: "原本问题", value: item.challenge },
        { label: "AGA 方案", value: item.solution },
        { label: "结果", value: item.result },
      ]
    : [
        { label: "Industry", value: item.industry },
        { label: "Location signal", value: item.locationSignal || "Malaysia" },
        { label: "Impact metric", value: item.metric },
        { label: "Workflow focus", value: item.workflowFocus || item.summary },
        { label: "Legacy tools replaced", value: item.legacyToolsReplaced?.join(", ") || "WhatsApp, Excel, manual reminders" },
        { label: "AGA system", value: item.agaSystem || "OneSystem + Workflow Registry" },
        { label: "Original pain", value: item.challenge },
        { label: "AGA solution", value: item.solution },
        { label: "Outcome", value: item.result },
      ]
}

function ImpactSnapshot({ title, items }: { title: string; items: Array<{ label: string; value: string }> }) {
  return (
    <section className="mt-8 rounded-2xl border bg-background p-5" aria-label={title}>
      <h2 className="text-xl font-bold tracking-normal">{title}</h2>
      <dl className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl bg-muted/40 p-4">
            <dt className="text-xs font-semibold uppercase tracking-widest text-primary">{item.label}</dt>
            <dd className="mt-2 text-sm leading-6 text-muted-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
