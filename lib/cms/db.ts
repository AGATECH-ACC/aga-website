import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { defaultLlmsMarkdown } from "@/lib/seo/llms"

import { getAdminSessionEmail, hasAdminPasscodeConfig } from "./admin-session"
import type {
  CmsCollection,
  CmsEntry,
  CmsLocale,
  CmsLocalizedContent,
  CmsLogoAsset,
  CmsMediaAsset,
  CmsSiteSettings,
  CmsSiteStats,
  CmsInsight,
  CmsStatus,
  CmsTestimonial,
} from "./types"

export const defaultSiteStats: CmsSiteStats = {
  statCounterAnalyses: { number: 20, suffix: "+" },
  statCounterAutomationPct: { number: 70, suffix: "%" },
  statCounterModules: { number: 53, suffix: "+" },
}

type DbEntry = {
  id: string
  collection: CmsCollection
  slug: string
  status: CmsStatus
  sort_order: number
  featured: boolean
  created_at: string
  updated_at: string
  published_at: string | null
  content_locales?: DbLocale[]
}

type DbLocale = {
  locale: CmsLocale
  title: string
  accent: string
  summary: string
  body: string
  fields: Record<string, unknown>
  seo: Record<string, unknown>
  draft_title: string
  draft_accent: string
  draft_summary: string
  draft_body: string
  draft_fields: Record<string, unknown>
  draft_seo: Record<string, unknown>
}

type DbMedia = {
  id: string
  bucket: string
  path: string
  public_url: string
  alt_text: string
  notes: string
  collection: string | null
}

type DbSiteSettings = {
  stat_counter_analyses_number: number | null
  stat_counter_analyses_suffix: string | null
  stat_counter_automation_pct_number: number | null
  stat_counter_automation_pct_suffix: string | null
  stat_counter_modules_number: number | null
  stat_counter_modules_suffix: string | null
  llms_markdown?: string | null
}

type DbTestimonial = {
  id: string
  quote_text: string
  client_name: string
  company_label: string
  star_rating: number | null
  display_order: number
  is_active: boolean
}

type DbInsight = {
  id: string
  slug: string
  display_order: number | null
  title_en: string
  title_zh: string | null
  summary_en: string | null
  summary_zh: string | null
  body_en: string | null
  body_zh: string | null
  cover_image: string | null
  author_name: string | null
  author_image: string | null
  author_title: string | null
  category: string | null
  tags: string[] | null
  reading_time_minutes: number | null
  seo_title_en: string | null
  seo_title_zh: string | null
  meta_description_en: string | null
  meta_description_zh: string | null
  faq_en: unknown
  faq_zh: unknown
  is_active: boolean | null
  is_featured: boolean | null
  published_at: string | null
  created_at: string
  updated_at: string
}

function mapLocale(locale: DbLocale): CmsLocalizedContent {
  return {
    locale: locale.locale,
    title: locale.title,
    accent: locale.accent,
    summary: locale.summary,
    body: locale.body,
    fields: locale.fields ?? {},
    seo: locale.seo ?? {},
    draftTitle: locale.draft_title,
    draftAccent: locale.draft_accent,
    draftSummary: locale.draft_summary,
    draftBody: locale.draft_body,
    draftFields: locale.draft_fields ?? {},
    draftSeo: locale.draft_seo ?? {},
  }
}

function mapEntry(entry: DbEntry): CmsEntry {
  return {
    id: entry.id,
    collection: entry.collection,
    slug: entry.slug,
    status: entry.status,
    sortOrder: entry.sort_order,
    featured: entry.featured,
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
    publishedAt: entry.published_at,
    locales: (entry.content_locales ?? []).map(mapLocale),
  }
}

function mapMedia(asset: DbMedia, sizeBytes: number | null = null): CmsMediaAsset {
  return {
    id: asset.id,
    bucket: asset.bucket,
    path: asset.path,
    publicUrl: asset.public_url,
    altText: asset.alt_text,
    notes: asset.notes,
    collection: asset.collection,
    sizeBytes,
  }
}

function normalizeFaq(value: unknown): Array<{ question: string; answer: string }> {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const record = item as Record<string, unknown>
      const question = typeof record.question === "string" ? record.question : ""
      const answer = typeof record.answer === "string" ? record.answer : ""
      return question || answer ? { question, answer } : null
    })
    .filter((item): item is { question: string; answer: string } => Boolean(item))
}

function mapInsight(insight: DbInsight, locale: CmsLocale = "en"): CmsInsight {
  const titleEn = insight.title_en ?? ""
  const titleZh = insight.title_zh ?? ""
  const summaryEn = insight.summary_en ?? ""
  const summaryZh = insight.summary_zh ?? ""
  const bodyEn = insight.body_en ?? ""
  const bodyZh = insight.body_zh ?? ""
  const title = locale === "zh" ? titleZh || titleEn : titleEn
  const summary = locale === "zh" ? summaryZh || summaryEn : summaryEn
  const body = locale === "zh" ? bodyZh || bodyEn : bodyEn

  return {
    id: insight.id,
    slug: insight.slug,
    titleEn,
    titleZh,
    summaryEn,
    summaryZh,
    bodyEn,
    bodyZh,
    coverImage: insight.cover_image ?? "",
    authorName: insight.author_name ?? "",
    authorImage: insight.author_image ?? "",
    authorTitle: insight.author_title ?? "",
    category: insight.category ?? "",
    tags: insight.tags ?? [],
    readingTimeMinutes: insight.reading_time_minutes,
    seoTitleEn: insight.seo_title_en ?? "",
    seoTitleZh: insight.seo_title_zh ?? "",
    metaDescriptionEn: insight.meta_description_en ?? "",
    metaDescriptionZh: insight.meta_description_zh ?? "",
    faqEn: normalizeFaq(insight.faq_en),
    faqZh: normalizeFaq(insight.faq_zh),
    isFeatured: Boolean(insight.is_featured),
    publishedAt: insight.published_at,
    createdAt: insight.created_at,
    title,
    summary,
    body,
    href: `/en/insights/${insight.slug}`,
    displayOrder: insight.display_order ?? 0,
    isActive: Boolean(insight.is_active),
    updatedAt: insight.updated_at,
  }
}

function isMissingCmsTable(error: { code?: string } | null) {
  return error?.code === "PGRST205"
}

async function getStorageObjectSize(path: string) {
  const supabase = createSupabaseAdminClient()
  if (!supabase) return null

  const slashIndex = path.lastIndexOf("/")
  const folder = slashIndex >= 0 ? path.slice(0, slashIndex) : ""
  const fileName = slashIndex >= 0 ? path.slice(slashIndex + 1) : path

  const { data, error } = await supabase.storage.from("aga-website-media").list(folder)

  if (error) {
    console.error(error)
    return null
  }

  const object = data?.find((item) => item.name === fileName)
  const size = object?.metadata?.size

  return typeof size === "number" ? size : null
}

export async function getCurrentAdmin() {
  const supabase = createSupabaseAdminClient()

  if (!supabase || !hasAdminPasscodeConfig()) {
    return { user: null, admin: null, configured: false }
  }

  const email = await getAdminSessionEmail()

  if (!email) {
    return { user: null, admin: null, configured: true }
  }

  const { data: admin } = await supabase
    .schema("cms")
    .from("admin_users")
    .select("email, role, active")
    .eq("email", email)
    .eq("active", true)
    .maybeSingle()

  return { user: admin ? { email } : null, admin, configured: true }
}

export async function listAdminEntries(collection: CmsCollection) {
  const supabase = createSupabaseAdminClient()

  if (!supabase) return []

  const { data, error } = await supabase
    .schema("cms")
    .from("content_entries")
    .select("*, content_locales(*)")
    .eq("collection", collection)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error(error)
    return []
  }

  return (data as DbEntry[]).map(mapEntry)
}

export async function listAllAdminEntries() {
  const supabase = createSupabaseAdminClient()

  if (!supabase) return []

  const { data, error } = await supabase
    .schema("cms")
    .from("content_entries")
    .select("*, content_locales(*)")
    .order("updated_at", { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return (data as DbEntry[]).map(mapEntry)
}

export async function getPublishedEntries(collection: CmsCollection) {
  const supabase = createSupabaseAdminClient()

  if (!supabase) return []

  const { data, error } = await supabase
    .schema("cms")
    .from("content_entries")
    .select("*, content_locales(*)")
    .eq("collection", collection)
    .eq("status", "published")
    .order("sort_order", { ascending: true })

  if (error) {
    console.error(error)
    return []
  }

  return (data as DbEntry[]).map(mapEntry)
}

export async function getPublishedEntry(collection: CmsCollection, slug: string) {
  const supabase = createSupabaseAdminClient()

  if (!supabase) return null

  const { data, error } = await supabase
    .schema("cms")
    .from("content_entries")
    .select("*, content_locales(*)")
    .eq("collection", collection)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (error) {
    console.error(error)
    return null
  }

  return data ? mapEntry(data as DbEntry) : null
}

export async function listMediaAssets() {
  const supabase = createSupabaseAdminClient()

  if (!supabase) return []

  const { data, error } = await supabase
    .schema("cms")
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  const assets = data as DbMedia[]
  const sizes = await Promise.all(assets.map((asset) => getStorageObjectSize(asset.path)))

  return assets.map((asset, index) => mapMedia(asset, sizes[index]))
}

export async function listInsights({
  activeOnly = false,
  locale = "en",
}: {
  activeOnly?: boolean
  locale?: CmsLocale
} = {}) {
  const supabase = createSupabaseAdminClient()

  if (!supabase) return []

  const { data, error } = await supabase
    .schema("cms")
    .from("insights")
    .select("*")
    .order("display_order", { ascending: true })
    .order("title_en", { ascending: true })

  if (error) {
    if (!isMissingCmsTable(error)) console.error(error)
    return []
  }

  return (data as DbInsight[])
    .map((insight) => mapInsight(insight, locale))
    .filter((insight) => !activeOnly || insight.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title))
}

export async function getInsightById(id: string) {
  const supabase = createSupabaseAdminClient()

  if (!supabase) return null

  const { data, error } = await supabase
    .schema("cms")
    .from("insights")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    if (!isMissingCmsTable(error)) console.error(error)
    return null
  }

  return data ? mapInsight(data as DbInsight) : null
}

export async function getSiteStats(): Promise<CmsSiteStats> {
  return (await getSiteSettings()).stats
}

export async function getLlmsMarkdown(): Promise<string> {
  return (await getSiteSettings()).llmsMarkdown
}

export async function getSiteSettings(): Promise<CmsSiteSettings> {
  const supabase = createSupabaseAdminClient()

  if (!supabase) return { stats: defaultSiteStats, llmsMarkdown: defaultLlmsMarkdown }

  const { data, error } = await supabase
    .schema("cms")
    .from("site_settings")
    .select(
      "stat_counter_analyses_number, stat_counter_analyses_suffix, stat_counter_automation_pct_number, stat_counter_automation_pct_suffix, stat_counter_modules_number, stat_counter_modules_suffix, llms_markdown"
    )
    .eq("id", "site")
    .maybeSingle()

  if (error || !data) {
    if (error && !isMissingCmsTable(error)) console.error(error)

    const { data: fallbackData, error: fallbackError } = await supabase
      .schema("cms")
      .from("media_assets")
      .select("notes")
      .eq("collection", "site-settings")
      .eq("path", "site-settings/homepage-counters")
      .maybeSingle()

    if (fallbackError || !fallbackData?.notes) {
      if (fallbackError) console.error(fallbackError)
      return { stats: defaultSiteStats, llmsMarkdown: defaultLlmsMarkdown }
    }

    try {
      const parsed = JSON.parse(fallbackData.notes) as DbSiteSettings
      return { stats: mapSiteStats(parsed), llmsMarkdown: parsed.llms_markdown || defaultLlmsMarkdown }
    } catch {
      return { stats: defaultSiteStats, llmsMarkdown: defaultLlmsMarkdown }
    }
  }

  const settings = data as DbSiteSettings
  return {
    stats: mapSiteStats(settings),
    llmsMarkdown: settings.llms_markdown || defaultLlmsMarkdown,
  }
}

function mapSiteStats(settings: DbSiteSettings): CmsSiteStats {
  return {
    statCounterAnalyses: {
      number: settings.stat_counter_analyses_number ?? defaultSiteStats.statCounterAnalyses.number,
      suffix: settings.stat_counter_analyses_suffix ?? defaultSiteStats.statCounterAnalyses.suffix,
    },
    statCounterAutomationPct: {
      number: settings.stat_counter_automation_pct_number ?? defaultSiteStats.statCounterAutomationPct.number,
      suffix: settings.stat_counter_automation_pct_suffix ?? defaultSiteStats.statCounterAutomationPct.suffix,
    },
    statCounterModules: {
      number: settings.stat_counter_modules_number ?? defaultSiteStats.statCounterModules.number,
      suffix: settings.stat_counter_modules_suffix ?? defaultSiteStats.statCounterModules.suffix,
    },
  }
}

function parseLogoNotes(notes: string | null | undefined) {
  if (!notes) return { linkUrl: "", displayOrder: 0, isActive: true }

  try {
    const parsed = JSON.parse(notes) as {
      linkUrl?: unknown
      displayOrder?: unknown
      isActive?: unknown
    }

    return {
      linkUrl: typeof parsed.linkUrl === "string" ? parsed.linkUrl : "",
      displayOrder: typeof parsed.displayOrder === "number" ? parsed.displayOrder : 0,
      isActive: typeof parsed.isActive === "boolean" ? parsed.isActive : true,
    }
  } catch {
    return { linkUrl: "", displayOrder: 0, isActive: true }
  }
}

function mapLogo(asset: DbMedia): CmsLogoAsset {
  const meta = parseLogoNotes(asset.notes)

  return {
    id: asset.id,
    name: asset.alt_text || asset.path,
    imageUrl: asset.public_url,
    storagePath: asset.path,
    linkUrl: meta.linkUrl,
    displayOrder: meta.displayOrder,
    isActive: meta.isActive,
  }
}

export async function listLogoAssets({ activeOnly = false }: { activeOnly?: boolean } = {}) {
  const supabase = createSupabaseAdminClient()

  if (!supabase) return []

  const { data, error } = await supabase
    .schema("cms")
    .from("media_assets")
    .select("*")
    .eq("collection", "logos")
    .order("created_at", { ascending: false })

  if (error) {
    if (!isMissingCmsTable(error)) console.error(error)
    return []
  }

  return (data as DbMedia[])
    .map(mapLogo)
    .filter((logo) => !activeOnly || logo.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name))
}

function mapTestimonial(item: DbTestimonial): CmsTestimonial {
  return {
    id: item.id,
    quoteText: item.quote_text,
    clientName: item.client_name,
    companyLabel: item.company_label,
    starRating: item.star_rating,
    displayOrder: item.display_order,
    isActive: item.is_active,
  }
}

export async function listTestimonials({ activeOnly = false }: { activeOnly?: boolean } = {}) {
  const supabase = createSupabaseAdminClient()

  if (!supabase) return []

  let query = supabase
    .schema("cms")
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })

  if (activeOnly) {
    query = query.eq("is_active", true)
  }

  const { data, error } = await query

  if (error) {
    if (!isMissingCmsTable(error)) console.error(error)
    return []
  }

  return (data as DbTestimonial[]).map(mapTestimonial)
}
