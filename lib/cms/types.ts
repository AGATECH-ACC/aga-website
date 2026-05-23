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
}
