export const cmsCollections = [
  "products",
  "industries",
  "case_studies",
  "events",
  "about",
] as const

export type CmsCollection = (typeof cmsCollections)[number]
export type CmsLocale = "en" | "zh"
export type CmsStatus = "draft" | "published" | "archived"

export type CmsLocalizedContent = {
  locale: CmsLocale
  title: string
  accent: string
  summary: string
  body: string
  fields: Record<string, unknown>
  seo: Record<string, unknown>
  draftTitle: string
  draftAccent: string
  draftSummary: string
  draftBody: string
  draftFields: Record<string, unknown>
  draftSeo: Record<string, unknown>
}

export type CmsEntry = {
  id: string
  collection: CmsCollection
  slug: string
  status: CmsStatus
  sortOrder: number
  featured: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locales: CmsLocalizedContent[]
}

export type CmsMediaAsset = {
  id: string
  bucket: string
  path: string
  publicUrl: string
  altText: string
  notes: string
  collection: string | null
  sizeBytes: number | null
}

export type CmsStatCounter = {
  number: number
  suffix: string
}

export type CmsSiteStats = {
  statCounterAnalyses: CmsStatCounter
  statCounterAutomationPct: CmsStatCounter
  statCounterModules: CmsStatCounter
}

export type CmsLogoAsset = {
  id: string
  name: string
  imageUrl: string
  storagePath: string
  linkUrl: string
  displayOrder: number
  isActive: boolean
}

export type CmsTestimonial = {
  id: string
  quoteText: string
  clientName: string
  companyLabel: string
  starRating: number | null
  displayOrder: number
  isActive: boolean
}

export type CmsInsight = {
  id: string
  slug: string
  titleEn: string
  titleZh: string
  summaryEn: string
  summaryZh: string
  bodyEn: string
  bodyZh: string
  coverImage: string
  authorName: string
  authorImage: string
  authorTitle: string
  category: string
  tags: string[]
  readingTimeMinutes: number | null
  seoTitleEn: string
  seoTitleZh: string
  metaDescriptionEn: string
  metaDescriptionZh: string
  faqEn: Array<{ question: string; answer: string }>
  faqZh: Array<{ question: string; answer: string }>
  isFeatured: boolean
  publishedAt: string | null
  createdAt: string
  title: string
  summary: string
  body: string
  href: string
  displayOrder: number
  isActive: boolean
  updatedAt: string | null
}
