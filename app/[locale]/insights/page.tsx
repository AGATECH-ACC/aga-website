import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"

import { listInsights } from "@/lib/cms/db"
import { getDictionary, isLocale, type Locale } from "@/lib/i18n/dictionary"
import type { CmsInsight } from "@/lib/cms/types"
import { getFallbackInsights } from "@/lib/insights/fallback"
import { cn } from "@/lib/utils"
import { websiteClasses as wc } from "@/styles/tokens"

import { LocalizedShell } from "../_components/LocalizedShell"

type PageProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string; page?: string }>
}

export const revalidate = 60

function localizedInsightHref(href: string, slug: string, locale: Locale) {
  if (href.includes("/insights#")) return `/${locale}/insights/${slug}`
  if (href.startsWith("/en/")) return href.replace("/en/", `/${locale}/`)
  if (href.startsWith("/zh/")) return href.replace("/zh/", `/${locale}/`)
  if (href.startsWith("http")) return href
  return `/${locale}/insights/${slug}`
}

function formatDate(value: string | null, locale: Locale) {
  if (!value) return "-"

  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en", {
    dateStyle: "medium",
  }).format(new Date(value))
}

function truncate(value: string, length = 120) {
  if (value.length <= length) return value
  return `${value.slice(0, length).trim()}...`
}

function categoryHref(locale: Locale, category?: string) {
  if (!category) return `/${locale}/insights`
  return `/${locale}/insights?category=${encodeURIComponent(category)}`
}

function InsightCard({
  insight,
  locale,
  featured = false,
}: {
  insight: CmsInsight
  locale: Locale
  featured?: boolean
}) {
  const href = localizedInsightHref(insight.href, insight.slug, locale)
  const summary = insight.summary
  const publishedAt = insight.publishedAt

  return (
    <Link
      href={href}
      className={cn(
        "group block overflow-hidden rounded-2xl border bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-lg",
        featured && "grid md:grid-cols-[1.2fr_0.8fr]"
      )}
    >
      <div className={cn("relative aspect-video bg-muted", featured && "md:aspect-auto md:min-h-[360px]")}>
        <Image
          src={insight.coverImage || "/assets/aga-hero-1.png"}
          alt={insight.title}
          fill
          sizes={featured ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
          className="object-cover"
        />
      </div>
      <div className={cn("grid content-start gap-3 p-5", featured && "p-6 md:p-8")}>
        <span className="w-fit rounded-full bg-[#E8521A] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
          {insight.category || (locale === "zh" ? "洞察" : "Insight")}
        </span>
        <h2 className={cn("line-clamp-2 font-bold leading-tight tracking-normal group-hover:text-primary", featured ? "text-3xl md:text-4xl" : "text-xl")}>
          {insight.title}
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {insight.readingTimeMinutes ?? 1} min read
          </span>
          <span>{formatDate(publishedAt, locale)}</span>
        </div>
        {summary ? (
          <p className={cn("text-sm leading-6 text-muted-foreground", featured && "text-base leading-7")}>
            {truncate(summary)}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

export default async function InsightsPage({ params, searchParams }: PageProps) {
  const { locale: localeParam } = await params
  const { category, page } = await searchParams

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)
  const insights = await listInsights({ activeOnly: true, locale })
  const allCards = insights.length
    ? insights
    : getFallbackInsights(locale)
  const categories = Array.from(new Set(allCards.map((insight) => insight.category).filter(Boolean)))
  const activeCategory = category && categories.includes(category) ? category : ""
  const filteredCards = activeCategory
    ? allCards.filter((insight) => insight.category === activeCategory)
    : allCards
  const featured = filteredCards.find((insight) => "isFeatured" in insight && insight.isFeatured) ?? filteredCards[0]
  const pageNumber = Math.max(Number(page ?? "1") || 1, 1)
  const visibleCount = pageNumber * 9
  const restCards = filteredCards.filter((insight) => insight.slug !== featured?.slug)
  const visibleRestCards = restCards.slice(0, visibleCount)
  const labels =
    locale === "zh"
      ? { all: "全部", loadMore: "加载更多" }
      : { all: "All", loadMore: "Load more" }

  return (
    <LocalizedShell locale={locale} path={`/${locale}/insights`}>
      <main className={cn(wc.container, "py-12 md:py-16")}>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            {dictionary.pages.insights.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-normal md:text-6xl">
            {dictionary.pages.insights.title}{" "}
            <span className="text-primary">{dictionary.pages.insights.accent}</span>
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {dictionary.pages.insights.description}
          </p>
        </div>

        {categories.length ? (
          <nav className="mt-10 flex gap-2 overflow-x-auto pb-2" aria-label="Insight categories">
            <Link
              href={categoryHref(locale)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary",
                !activeCategory && "border-primary bg-primary text-primary-foreground hover:text-primary-foreground"
              )}
            >
              {labels.all}
            </Link>
            {categories.map((item) => (
              <Link
                key={item}
                href={categoryHref(locale, item)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary",
                  activeCategory === item && "border-primary bg-primary text-primary-foreground hover:text-primary-foreground"
                )}
              >
                {item}
              </Link>
            ))}
          </nav>
        ) : null}

        {featured ? (
          <section className="mt-8">
            <InsightCard insight={featured} locale={locale} featured />
          </section>
        ) : null}

        {visibleRestCards.length ? (
          <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleRestCards.map((insight) => (
              <InsightCard key={insight.slug} insight={insight} locale={locale} />
            ))}
          </section>
        ) : null}

        {visibleRestCards.length < restCards.length ? (
          <div className="mt-10 flex justify-center">
            <Link
              href={`/${locale}/insights?${new URLSearchParams({
                ...(activeCategory ? { category: activeCategory } : {}),
                page: String(pageNumber + 1),
              }).toString()}`}
              className="rounded-full bg-system px-5 py-3 text-sm font-semibold text-system-foreground transition hover:bg-system/90"
            >
              {labels.loadMore}
            </Link>
          </div>
        ) : null}
      </main>
    </LocalizedShell>
  )
}
