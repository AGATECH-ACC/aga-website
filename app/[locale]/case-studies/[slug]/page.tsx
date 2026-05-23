import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

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
  const caseStudies = await getCmsCaseStudies(locale, dictionary.caseStudyItems)
  const item = caseStudies.find((caseStudy) => caseStudy.slug === slug)

  if (!item) {
    notFound()
  }

  const labels =
    locale === "zh"
      ? { back: "返回案例", challenge: "挑战", solution: "方案", result: "成果" }
      : { back: "Back to case studies", challenge: "Challenge", solution: "Solution", result: "Result" }

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

          <SectionHeader
            eyebrow={item.industry}
            title={item.title}
            accent={item.metric}
            description={item.summary}
          />

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
