import type { ReactNode } from "react"

import type { Locale } from "@/lib/i18n/dictionary"
import type { SolutionBlueprint } from "@/lib/solutions/blueprints"

const siteUrl = "https://agaventures.ai"

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>
}

type CaseStudySchemaInput = {
  locale: Locale
  slug: string
  title: string
  summary: string
  industry: string
  metric: string
  challenge: string
  solution: string
  result: string
}

type SolutionSchemaInput = {
  locale: Locale
  slug: string
  title: string
  description: string
  blueprint?: SolutionBlueprint
}

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AGA Ventures",
    url: siteUrl,
    email: "enquiry@agaventures.ai",
    areaServed: ["Malaysia", "Kuala Lumpur", "Petaling Jaya", "Shah Alam", "Selangor"],
    knowsAbout: [
      "SME systemization",
      "Lark workflow automation",
      "AI automation for Malaysian SMEs",
      "Business process automation",
      "WhatsApp and Excel workflow replacement",
    ],
  }
}

export function breadcrumbSchema(items: Array<{ name: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  }
}

export function solutionServiceSchema({ locale, slug, title, description, blueprint }: SolutionSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    serviceType: "SME business systemization and AI workflow automation",
    description,
    url: absoluteUrl(`/${locale}/solutions/${slug}`),
    provider: {
      "@type": "Organization",
      name: "AGA Ventures",
      url: siteUrl,
    },
    areaServed: blueprint?.trustAnchors ?? ["Malaysia", "Kuala Lumpur", "Petaling Jaya", "Shah Alam"],
    audience: {
      "@type": "BusinessAudience",
      audienceType: blueprint?.audience ?? "Malaysian SME owners and operators",
    },
    category: blueprint?.vertical ?? title,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/${locale}/contact`),
      priceCurrency: "MYR",
    },
    termsOfService: absoluteUrl(`/${locale}/terms-of-service`),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${title} workflow modules`,
      itemListElement: (blueprint?.modules ?? []).map((module, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: module.title,
          description: module.description,
        },
      })),
    },
    serviceOutput: blueprint?.result,
    additionalProperty: [
      ...(blueprint?.painPoints ?? []).map((value) => ({
        "@type": "PropertyValue",
        name: "Pain point",
        value,
      })),
      ...(blueprint?.legacyToolsReplaced ?? []).map((value) => ({
        "@type": "PropertyValue",
        name: "Legacy tool replaced",
        value,
      })),
    ],
  }
}

export function caseStudyReportSchema(input: CaseStudySchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Report",
    headline: input.title,
    name: input.title,
    description: input.summary,
    url: absoluteUrl(`/${input.locale}/case-studies/${input.slug}`),
    inLanguage: input.locale === "zh" ? "zh-CN" : "en",
    publisher: {
      "@type": "Organization",
      name: "AGA Ventures",
      url: siteUrl,
    },
    about: [
      input.industry,
      "SME systemization",
      "Workflow automation",
      "Malaysia business operations",
    ],
    abstract: input.summary,
    mainEntity: {
      "@type": "CaseStudy",
      name: input.title,
      description: input.summary,
      result: input.result,
      studySubject: {
        "@type": "Organization",
        name: input.industry,
      },
    },
    variableMeasured: {
      "@type": "PropertyValue",
      name: "Impact metric",
      value: input.metric,
    },
    mentions: [
      { "@type": "Thing", name: input.challenge },
      { "@type": "Thing", name: input.solution },
      { "@type": "Thing", name: input.result },
    ],
  }
}

export function techArticleSchema({
  headline,
  description,
  url,
  image,
  locale,
  publishedAt,
  modifiedAt,
  authorName,
  authorTitle,
  keywords,
}: {
  headline: string
  description: string
  url: string
  image?: string
  locale: Locale
  publishedAt?: string | null
  modifiedAt?: string | null
  authorName?: string
  authorTitle?: string
  keywords?: string[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline,
    description,
    image: image ? absoluteUrl(image) : absoluteUrl("/assets/aga-hero-1.png"),
    url: absoluteUrl(url),
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    datePublished: publishedAt ?? undefined,
    dateModified: modifiedAt ?? publishedAt ?? undefined,
    keywords,
    author: {
      "@type": "Person",
      name: authorName || "Tan Chi Shiong",
      jobTitle: authorTitle || "Founder, AGA Ventures",
    },
    publisher: {
      "@type": "Organization",
      name: "AGA Ventures",
      url: siteUrl,
    },
    about: ["SME systemization", "AI automation", "Lark workflow automation", "Malaysia SME operations"],
  }
}

export function QuestionHeading({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-bold tracking-normal md:text-3xl">{children}</h2>
}
