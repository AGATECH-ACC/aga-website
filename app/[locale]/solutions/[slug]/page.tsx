import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CheckCircle2, MapPin, Replace, TriangleAlert } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeader, WebsiteContainer, WebsiteSection } from "@/components/website"
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n/dictionary"
import { getCmsIndustry, getCmsProducts } from "@/lib/cms/public-content"
import { getSolutionBlueprint } from "@/lib/solutions/blueprints"
import { absoluteUrl, breadcrumbSchema, JsonLd, solutionServiceSchema } from "@/lib/seo/json-ld"

import { LocalizedShell } from "../../_components/LocalizedShell"

export const revalidate = 60

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

function getSlugFromHref(href: string) {
  return href.split("/").filter(Boolean).at(-1) ?? ""
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getDictionary(locale).industriesSection.industries.map((industry) => ({
      locale,
      slug: getSlugFromHref(industry.href),
    }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params

  if (!isLocale(localeParam)) return {}

  const dictionary = getDictionary(localeParam)
  const cmsIndustry = await getCmsIndustry(localeParam, slug)
  const fallbackIndustry = dictionary.industriesSection.industries.find(
    (item) => getSlugFromHref(item.href) === slug
  )
  const industry = cmsIndustry ?? fallbackIndustry

  if (!industry) return {}

  const title = `${industry.title} Systemization for Malaysian SMEs | AGA Ventures`
  const description = industry.description
  const url = `/${localeParam}/solutions/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(url),
      languages: {
        en: absoluteUrl(`/en/solutions/${slug}`),
        zh: absoluteUrl(`/zh/solutions/${slug}`),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(url),
      type: "website",
    },
  }
}

export default async function SolutionDetailPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)
  const cmsIndustry = await getCmsIndustry(locale, slug)
  const fallbackIndustry = dictionary.industriesSection.industries.find(
    (item) => getSlugFromHref(item.href) === slug
  )
  const industry = cmsIndustry ?? fallbackIndustry
  const products = await getCmsProducts(locale, dictionary.productsSection.products)
  const blueprint = getSolutionBlueprint(locale, slug)
  const pageBlueprint = {
    ...blueprint,
    vertical: cmsIndustry?.vertical || blueprint?.vertical,
    audience: cmsIndustry?.audience || blueprint?.audience,
    image: cmsIndustry?.image || blueprint?.image,
    inside: cmsIndustry?.inside?.length ? cmsIndustry.inside : blueprint?.inside,
    result: cmsIndustry?.result || blueprint?.result,
    painPoints: cmsIndustry?.painPoints?.length ? cmsIndustry.painPoints : blueprint?.painPoints,
    trustAnchors: cmsIndustry?.trustAnchors?.length ? cmsIndustry.trustAnchors : blueprint?.trustAnchors,
    legacyToolsReplaced: cmsIndustry?.legacyToolsReplaced?.length ? cmsIndustry.legacyToolsReplaced : blueprint?.legacyToolsReplaced,
    questionHeadings: cmsIndustry?.questionHeadings?.length ? cmsIndustry.questionHeadings : blueprint?.questionHeadings,
    modules: cmsIndustry?.modules?.length ? cmsIndustry.modules : blueprint?.modules,
  }

  if (!industry) {
    notFound()
  }

  const modules = pageBlueprint.modules?.length
    ? pageBlueprint.modules
    : "modules" in industry && industry.modules.length
      ? industry.modules
      : products.slice(0, 3).map((product) => ({
          title: product.name + " — " + product.tagline,
          description: product.description,
          href: product.href,
        }))
  const labels =
    locale === "zh"
      ? {
          back: "返回全部方案",
          snapshot: "AI 可读取摘要",
          pain: "主要痛点",
          tools: "替代旧工具",
          trust: "服务地区信号",
          modules: "系统模块",
          questions: "高意图问题",
          answer: "AGA 的做法",
          result: "预期结果",
          includes: "包含",
        }
      : {
          back: "Back to all solutions",
          snapshot: "AI-readable snapshot",
          pain: "Core pain points",
          tools: "Legacy tools replaced",
          trust: "Localized trust anchors",
          modules: "System modules",
          questions: "High-intent questions",
          answer: "AGA approach",
          result: "Expected result",
          includes: "Includes",
        }
  const pagePath = `/${locale}/solutions/${slug}`

  return (
    <LocalizedShell locale={locale} path={`/${locale}/solutions/${slug}`}>
      <JsonLd
        data={[
          solutionServiceSchema({
            locale,
            slug,
            title: industry.title,
            description: industry.description,
            blueprint: pageBlueprint.slug ? pageBlueprint : undefined,
          }),
          breadcrumbSchema([
            { name: "Home", href: `/${locale}` },
            { name: dictionary.pages.solutions.accent, href: `/${locale}/solutions` },
            { name: industry.title, href: pagePath },
          ]),
        ]}
      />
      <WebsiteSection>
        <WebsiteContainer className="flex flex-col gap-10">
          <Link
            href={`/${locale}/solutions`}
            className="inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            {labels.back}
          </Link>

          <SectionHeader
            eyebrow={dictionary.pages.solutions.eyebrow}
            title={industry.title}
            accent={dictionary.pages.solutions.accent}
            description={industry.description}
          />

          <section className="rounded-[2rem] border bg-muted/20 p-6 md:p-8" aria-label={labels.snapshot}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">{labels.snapshot}</p>
            <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="text-2xl font-bold tracking-normal md:text-3xl">
                  {pageBlueprint.questionHeadings?.[0] ?? industry.title}
                </h2>
                <p className="mt-4 leading-8 text-muted-foreground">{pageBlueprint.result ?? industry.description}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {(pageBlueprint.inside ?? modules.map((module) => module.title)).slice(0, 4).map((item) => (
                  <div key={item} className="flex gap-2 rounded-2xl bg-background p-4 text-sm font-medium">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {pageBlueprint.slug ? (
            <div className="grid gap-5 lg:grid-cols-3">
              <SeoFactCard icon={<TriangleAlert className="size-5" />} title={labels.pain} items={pageBlueprint.painPoints ?? []} />
              <SeoFactCard icon={<Replace className="size-5" />} title={labels.tools} items={pageBlueprint.legacyToolsReplaced ?? []} />
              <SeoFactCard icon={<MapPin className="size-5" />} title={labels.trust} items={pageBlueprint.trustAnchors ?? []} />
            </div>
          ) : null}

          <section>
            <h2 className="text-3xl font-bold tracking-normal">{labels.modules}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {modules.map((module) => (
                <Card key={module.title} className="h-full">
                  <CardHeader>
                    <CardTitle>{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-muted-foreground">{module.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {pageBlueprint.questionHeadings?.length ? (
            <section className="grid gap-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">{labels.questions}</p>
              {pageBlueprint.questionHeadings.map((heading, index) => (
                <Card key={heading} className="bg-muted/20">
                  <CardHeader>
                    <CardTitle className="text-2xl tracking-normal">{heading}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 text-sm leading-7 text-muted-foreground">
                    <p>
                      <span className="font-semibold text-foreground">{labels.answer}: </span>
                      {modules[index % modules.length]?.description ?? industry.description}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">{labels.result}: </span>
                      {pageBlueprint.result}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </section>
          ) : null}
        </WebsiteContainer>
      </WebsiteSection>
    </LocalizedShell>
  )
}

function SeoFactCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</span>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3 text-sm leading-6 text-muted-foreground">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
