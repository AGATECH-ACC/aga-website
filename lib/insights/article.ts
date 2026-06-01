import type { CmsInsight } from "@/lib/cms/types"
import { techArticleSchema } from "@/lib/seo/json-ld"

const fallbackImage = "/assets/aga-hero-1.png"

export function articleSchema(insight: CmsInsight, locale: "en" | "zh") {
  return techArticleSchema({
    headline: insight.title,
    description: articleMetaDescription(insight, locale),
    url: `/${locale}/insights/${insight.slug}`,
    image: insight.coverImage || fallbackImage,
    locale,
    publishedAt: insight.publishedAt ?? insight.createdAt,
    modifiedAt: insight.updatedAt,
    authorName: insight.authorName,
    authorTitle: insight.authorTitle,
    keywords: insight.tags,
  })
}

export function faqSchema(insight: CmsInsight, locale: "en" | "zh") {
  const faqs = locale === "zh" ? insight.faqZh.length ? insight.faqZh : insight.faqEn : insight.faqEn
  if (!faqs.length) return null

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function relatedInsights(current: CmsInsight, all: CmsInsight[]) {
  const sameCategory = all.filter((item) => item.id !== current.id && item.category && item.category === current.category)
  const latest = all.filter((item) => item.id !== current.id && !sameCategory.some((same) => same.id === item.id))
  return [...sameCategory, ...latest].slice(0, 3)
}

export function articleMetaDescription(insight: CmsInsight, locale: "en" | "zh") {
  if (locale === "zh") return insight.metaDescriptionZh || insight.metaDescriptionEn || insight.summary
  return insight.metaDescriptionEn || insight.summary
}

export function articleMetaTitle(insight: CmsInsight, locale: "en" | "zh") {
  if (locale === "zh") return insight.seoTitleZh || insight.seoTitleEn || insight.title
  return insight.seoTitleEn || insight.title
}
