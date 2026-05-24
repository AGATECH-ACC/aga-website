import { notFound } from "next/navigation"
import { cookies, headers } from "next/headers"
import type { Metadata } from "next"

import { InsightArticle } from "@/components/website/InsightArticle"
import { listInsights } from "@/lib/cms/db"
import { isLocale, type Locale } from "@/lib/i18n/dictionary"
import { getFallbackInsights } from "@/lib/insights/fallback"
import {
  articleMetaDescription,
  articleMetaTitle,
  articleSchema,
  faqSchema,
  relatedInsights,
} from "@/lib/insights/article"

import { LocalizedShell } from "../../_components/LocalizedShell"

export const revalidate = 60

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ preview?: string }>
}

async function canPreview() {
  const secret = process.env.PREVIEW_SECRET
  if (!secret) return false

  const cookieStore = await cookies()
  const headerStore = await headers()
  return cookieStore.get("aga_preview_secret")?.value === secret || headerStore.get("x-preview-secret") === secret
}

async function getPageData({ params, searchParams }: PageProps) {
  const { locale: localeParam, slug } = await params
  const { preview } = await searchParams

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const previewMode = preview === "true"
  const previewAllowed = previewMode ? await canPreview() : false

  if (previewMode && !previewAllowed) {
    notFound()
  }

  const cmsInsights = await listInsights({ activeOnly: !previewAllowed, locale })
  const insights = cmsInsights.length ? cmsInsights : getFallbackInsights(locale)
  const insight = insights.find((item) => item.slug === slug)

  if (!insight) {
    notFound()
  }

  return { locale, slug, insight, insights }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { insight, locale } = await getPageData(props)
  const title = articleMetaTitle(insight, locale)
  const description = articleMetaDescription(insight, locale)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: insight.coverImage ? [insight.coverImage] : undefined,
      type: "article",
      publishedTime: insight.publishedAt ?? undefined,
    },
    other: {
      "article:published_time": insight.publishedAt ?? "",
    },
  }
}

export default async function InsightDetailPage(props: PageProps) {
  const { locale, slug, insight, insights } = await getPageData(props)
  const articleJsonLd = articleSchema(insight, locale)
  const faqJsonLd = faqSchema(insight, locale)

  return (
    <LocalizedShell locale={locale} path={`/${locale}/insights/${slug}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
      <InsightArticle insight={insight} related={relatedInsights(insight, insights)} locale={locale} />
    </LocalizedShell>
  )
}
