import { createSupabaseAdminClient } from "@/lib/supabase/admin"

import { getAdminSessionEmail, hasAdminPasscodeConfig } from "./admin-session"
import type {
  CmsCollection,
  CmsEntry,
  CmsLocale,
  CmsLocalizedContent,
  CmsMediaAsset,
  CmsStatus,
} from "./types"

type DbEntry = {
  id: string
  collection: CmsCollection
  slug: string
  status: CmsStatus
  sort_order: number
  featured: boolean
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
    publishedAt: entry.published_at,
    locales: (entry.content_locales ?? []).map(mapLocale),
  }
}

function mapMedia(asset: DbMedia): CmsMediaAsset {
  return {
    id: asset.id,
    bucket: asset.bucket,
    path: asset.path,
    publicUrl: asset.public_url,
    altText: asset.alt_text,
    notes: asset.notes,
    collection: asset.collection,
  }
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

  return (data as DbMedia[]).map(mapMedia)
}
