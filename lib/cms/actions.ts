"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"

import { clearAdminSession, createAdminSession, hasAdminPasscodeConfig } from "./admin-session"
import { getCurrentAdmin } from "./db"
import type { CmsCollection, CmsLocale } from "./types"

async function requireAdminClient() {
  const supabase = createSupabaseAdminClient()
  const { admin } = await getCurrentAdmin()

  if (!supabase || !admin) {
    throw new Error("Unauthorized admin request")
  }

  return supabase
}

function adminCollectionPath(collection: string) {
  if (collection === "case_studies") return "/admin/case-studies"
  if (collection === "about") return "/admin/pages/about"
  return `/admin/${collection}`
}

function parseJson(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") return {}

  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}

function withImageUrl(fields: Record<string, unknown>, imageUrl: string) {
  const nextFields = { ...fields }

  if (imageUrl) {
    nextFields.imageUrl = imageUrl
  } else {
    delete nextFields.imageUrl
  }

  return nextFields
}

export async function signInAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const passcode = String(formData.get("passcode") ?? "")
  const supabase = createSupabaseAdminClient()

  if (!supabase || !hasAdminPasscodeConfig()) {
    redirect("/admin/login?status=missing-config")
  }

  if (!email || passcode !== process.env.ADMIN_PASSCODE) {
    redirect("/admin/login?status=invalid")
  }

  const { data: admin } = await supabase
    .schema("cms")
    .from("admin_users")
    .select("email, role, active")
    .eq("email", email)
    .eq("active", true)
    .maybeSingle()

  if (!admin) {
    redirect("/admin/login?status=unauthorized")
  }

  await createAdminSession(email)
  redirect("/admin")
}

export async function signOutAdmin() {
  await clearAdminSession()
  redirect("/admin/login")
}

export async function saveCmsEntry(formData: FormData) {
  const supabase = await requireAdminClient()
  const collection = String(formData.get("collection") ?? "") as CmsCollection
  const id = String(formData.get("id") ?? "")
  const slug = String(formData.get("slug") ?? "").trim()
  const status = String(formData.get("status") ?? "draft")
  const sortOrder = Number(formData.get("sortOrder") ?? 0)
  const featured = formData.get("featured") === "on"
  const imageUrl = String(formData.get("imageUrl") ?? "").trim()

  if (!collection || !slug) {
    throw new Error("Collection and slug are required")
  }

  const entryPayload = {
    collection,
    slug,
    status,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    featured,
  }

  const { data: entry, error: entryError } = id
    ? await supabase
        .schema("cms")
        .from("content_entries")
        .update(entryPayload)
        .eq("id", id)
        .select("id")
        .single()
    : await supabase
        .schema("cms")
        .from("content_entries")
        .insert(entryPayload)
        .select("id")
        .single()

  if (entryError || !entry) {
    throw entryError ?? new Error("Unable to save entry")
  }

  for (const locale of ["en", "zh"] as CmsLocale[]) {
    const title = String(formData.get(`${locale}.title`) ?? "")
    const accent = String(formData.get(`${locale}.accent`) ?? "")
    const summary = String(formData.get(`${locale}.summary`) ?? "")
    const body = String(formData.get(`${locale}.body`) ?? "")
    const fields = withImageUrl(parseJson(formData.get(`${locale}.fields`)), imageUrl)
    const seo = parseJson(formData.get(`${locale}.seo`))

    const localePayload = {
      entry_id: entry.id,
      locale,
      draft_title: title,
      draft_accent: accent,
      draft_summary: summary,
      draft_body: body,
      draft_fields: fields,
      draft_seo: seo,
    }

    const { error } = await supabase
      .schema("cms")
      .from("content_locales")
      .upsert(localePayload, { onConflict: "entry_id,locale" })

    if (error) throw error
  }

  revalidatePath("/admin")
  revalidatePath(adminCollectionPath(collection))
  revalidatePath("/en")
  revalidatePath("/zh")
}

export async function publishCmsEntry(formData: FormData) {
  const supabase = await requireAdminClient()
  const id = String(formData.get("id") ?? "")
  const collection = String(formData.get("collection") ?? "")

  if (!id) {
    throw new Error("Entry id is required")
  }

  const { data: locales, error: localeError } = await supabase
    .schema("cms")
    .from("content_locales")
    .select("*")
    .eq("entry_id", id)

  if (localeError) throw localeError

  for (const locale of locales ?? []) {
    const { error } = await supabase
      .schema("cms")
      .from("content_locales")
      .update({
        title: locale.draft_title,
        accent: locale.draft_accent,
        summary: locale.draft_summary,
        body: locale.draft_body,
        fields: locale.draft_fields,
        seo: locale.draft_seo,
      })
      .eq("id", locale.id)

    if (error) throw error
  }

  const { error: entryError } = await supabase
    .schema("cms")
    .from("content_entries")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (entryError) throw entryError

  revalidatePath("/admin")
  revalidatePath(adminCollectionPath(collection))
  revalidatePath("/en")
  revalidatePath("/zh")
}

export async function setCmsEntryStatus(formData: FormData) {
  const supabase = await requireAdminClient()
  const id = String(formData.get("id") ?? "")
  const collection = String(formData.get("collection") ?? "")
  const status = String(formData.get("status") ?? "draft")

  if (!id || !["draft", "published", "archived"].includes(status)) {
    throw new Error("Entry id and valid status are required")
  }

  if (status === "published") {
    const { data: locales, error: localeError } = await supabase
      .schema("cms")
      .from("content_locales")
      .select("*")
      .eq("entry_id", id)

    if (localeError) throw localeError

    for (const locale of locales ?? []) {
      const { error } = await supabase
        .schema("cms")
        .from("content_locales")
        .update({
          title: locale.draft_title,
          accent: locale.draft_accent,
          summary: locale.draft_summary,
          body: locale.draft_body,
          fields: locale.draft_fields,
          seo: locale.draft_seo,
        })
        .eq("id", locale.id)

      if (error) throw error
    }
  }

  const { error } = await supabase
    .schema("cms")
    .from("content_entries")
    .update({
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .eq("id", id)

  if (error) throw error

  revalidatePath("/admin")
  revalidatePath(adminCollectionPath(collection))
  revalidatePath("/en")
  revalidatePath("/zh")
}

export async function deleteCmsEntry(formData: FormData) {
  const supabase = await requireAdminClient()
  const id = String(formData.get("id") ?? "")
  const collection = String(formData.get("collection") ?? "")

  if (!id) {
    throw new Error("Entry id is required")
  }

  const { error } = await supabase.schema("cms").from("content_entries").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin")
  revalidatePath(adminCollectionPath(collection))
  revalidatePath("/en")
  revalidatePath("/zh")
}

export async function uploadCmsMedia(formData: FormData) {
  const supabase = await requireAdminClient()
  const file = formData.get("file")
  const collection = String(formData.get("collection") ?? "brand")
  const altText = String(formData.get("altText") ?? "")
  const notes = String(formData.get("notes") ?? "")

  if (!(file instanceof File) || !file.size) {
    throw new Error("A file is required")
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase()
  const path = `${collection}/${Date.now()}-${safeName}`

  const { error: uploadError } = await supabase.storage
    .from("aga-website-media")
    .upload(path, file, {
      upsert: true,
    })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from("aga-website-media").getPublicUrl(path)

  const { error: insertError } = await supabase.schema("cms").from("media_assets").insert({
    bucket: "aga-website-media",
    path,
    public_url: data.publicUrl,
    alt_text: altText,
    notes,
    collection,
  })

  if (insertError) throw insertError

  revalidatePath("/admin/media")
  revalidatePath("/admin")
}

export async function deleteCmsMedia(formData: FormData) {
  const supabase = await requireAdminClient()
  const id = String(formData.get("id") ?? "")
  const path = String(formData.get("path") ?? "")

  if (!id || !path) {
    throw new Error("Media id and path are required")
  }

  const { error: storageError } = await supabase.storage.from("aga-website-media").remove([path])

  if (storageError) throw storageError

  const { error: dbError } = await supabase.schema("cms").from("media_assets").delete().eq("id", id)

  if (dbError) throw dbError

  revalidatePath("/admin/media")
  revalidatePath("/admin")
}

function numberValue(formData: FormData, key: string, fallback: number) {
  const value = Number(formData.get(key) ?? fallback)
  return Number.isFinite(value) ? value : fallback
}

function isMissingCmsTable(error: { code?: string } | null) {
  return error?.code === "PGRST205"
}

export async function saveSiteStats(formData: FormData) {
  const supabase = await requireAdminClient()

  const payload = {
    id: "site",
    stat_counter_analyses_number: numberValue(formData, "stat_counter_analyses_number", 20),
    stat_counter_analyses_suffix: String(formData.get("stat_counter_analyses_suffix") ?? "+"),
    stat_counter_automation_pct_number: numberValue(formData, "stat_counter_automation_pct_number", 70),
    stat_counter_automation_pct_suffix: String(formData.get("stat_counter_automation_pct_suffix") ?? "%"),
    stat_counter_modules_number: numberValue(formData, "stat_counter_modules_number", 53),
    stat_counter_modules_suffix: String(formData.get("stat_counter_modules_suffix") ?? "+"),
  }

  const { error } = await supabase.schema("cms").from("site_settings").upsert(payload, { onConflict: "id" })

  if (isMissingCmsTable(error)) {
    const { error: fallbackError } = await supabase.schema("cms").from("media_assets").upsert(
      {
        bucket: "aga-website-media",
        path: "site-settings/homepage-counters",
        public_url: "",
        alt_text: "Homepage stat counters",
        collection: "site-settings",
        notes: JSON.stringify(payload),
      },
      { onConflict: "path" }
    )

    if (fallbackError) throw fallbackError

    revalidatePath("/admin/site-settings")
    revalidatePath("/admin")
    revalidatePath("/en")
    return
  }

  if (error) throw error

  revalidatePath("/admin/site-settings")
  revalidatePath("/admin")
  revalidatePath("/en")
}

export async function uploadLogoAsset(formData: FormData) {
  const supabase = await requireAdminClient()
  const file = formData.get("file")
  const name = String(formData.get("name") ?? "").trim()
  const linkUrl = String(formData.get("linkUrl") ?? "").trim()
  const displayOrder = numberValue(formData, "displayOrder", 0)
  const isActive = formData.get("isActive") === "on"

  if (!(file instanceof File) || !file.size || !name) {
    throw new Error("Logo name and image file are required")
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase()
  const path = `logos/${Date.now()}-${safeName}`

  const { error: uploadError } = await supabase.storage.from("aga-website-media").upload(path, file, {
    upsert: true,
  })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from("aga-website-media").getPublicUrl(path)

  const { error } = await supabase.schema("cms").from("media_assets").insert({
    bucket: "aga-website-media",
    path,
    public_url: data.publicUrl,
    alt_text: name,
    collection: "logos",
    notes: JSON.stringify({
      linkUrl,
      displayOrder,
      isActive,
    }),
  })

  if (error) throw error

  revalidatePath("/admin/site-settings")
  revalidatePath("/en")
}

export async function deleteLogoAsset(formData: FormData) {
  const supabase = await requireAdminClient()
  const id = String(formData.get("id") ?? "")
  const storagePath = String(formData.get("storagePath") ?? "")

  if (!id) throw new Error("Logo id is required")

  if (storagePath) {
    const { error: storageError } = await supabase.storage.from("aga-website-media").remove([storagePath])
    if (storageError) throw storageError
  }

  const { error } = await supabase.schema("cms").from("media_assets").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/site-settings")
  revalidatePath("/en")
}

export async function setLogoAssetStatus(formData: FormData) {
  const supabase = await requireAdminClient()
  const id = String(formData.get("id") ?? "")
  const isActive = String(formData.get("isActive") ?? "") === "true"

  if (!id) throw new Error("Logo id is required")

  const { data, error: readError } = await supabase
    .schema("cms")
    .from("media_assets")
    .select("notes")
    .eq("id", id)
    .maybeSingle()

  if (readError) throw readError

  let notes: Record<string, unknown> = {}
  try {
    notes = data?.notes ? JSON.parse(data.notes) : {}
  } catch {
    notes = {}
  }

  const { error } = await supabase
    .schema("cms")
    .from("media_assets")
    .update({
      notes: JSON.stringify({
        ...notes,
        isActive,
      }),
    })
    .eq("id", id)

  if (error) throw error

  revalidatePath("/admin/site-settings")
  revalidatePath("/en")
}

export async function saveTestimonial(formData: FormData) {
  const supabase = await requireAdminClient()
  const id = String(formData.get("id") ?? "")
  const quoteText = String(formData.get("quoteText") ?? "").trim().slice(0, 200)
  const clientName = String(formData.get("clientName") ?? "").trim()
  const companyLabel = String(formData.get("companyLabel") ?? "").trim()
  const rawStarRating = String(formData.get("starRating") ?? "").trim()
  const starRating = rawStarRating ? numberValue(formData, "starRating", 0) : null
  const displayOrder = numberValue(formData, "displayOrder", 0)
  const isActive = formData.get("isActive") === "on"

  if (!quoteText || !clientName) {
    throw new Error("Quote text and client name are required")
  }

  const payload = {
    quote_text: quoteText,
    client_name: clientName,
    company_label: companyLabel,
    star_rating: starRating && starRating >= 1 && starRating <= 5 ? starRating : null,
    display_order: displayOrder,
    is_active: isActive,
  }

  const { error } = id
    ? await supabase.schema("cms").from("testimonials").update(payload).eq("id", id)
    : await supabase.schema("cms").from("testimonials").insert(payload)

  if (error) throw error

  revalidatePath("/admin/site-settings")
  revalidatePath("/en")
}

export async function deleteTestimonial(formData: FormData) {
  const supabase = await requireAdminClient()
  const id = String(formData.get("id") ?? "")

  if (!id) throw new Error("Testimonial id is required")

  const { error } = await supabase.schema("cms").from("testimonials").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/site-settings")
  revalidatePath("/en")
}

export async function setTestimonialStatus(formData: FormData) {
  const supabase = await requireAdminClient()
  const id = String(formData.get("id") ?? "")
  const isActive = String(formData.get("isActive") ?? "") === "true"

  if (!id) throw new Error("Testimonial id is required")

  const { error } = await supabase
    .schema("cms")
    .from("testimonials")
    .update({ is_active: isActive })
    .eq("id", id)

  if (error) throw error

  revalidatePath("/admin/site-settings")
  revalidatePath("/en")
}

export async function saveInsight(formData: FormData) {
  const supabase = await requireAdminClient()
  const id = String(formData.get("id") ?? "")
  const slug = String(formData.get("slug") ?? "").trim()
  const titleEn = String(formData.get("titleEn") ?? "").trim()
  const titleZh = String(formData.get("titleZh") ?? "").trim()
  const summaryEn = String(formData.get("summaryEn") ?? "").trim()
  const summaryZh = String(formData.get("summaryZh") ?? "").trim()
  const bodyEn = String(formData.get("bodyEn") ?? "").trim()
  const bodyZh = String(formData.get("bodyZh") ?? "").trim()
  const coverImage = String(formData.get("coverImage") ?? "").trim()
  const authorName = String(formData.get("authorName") ?? "").trim()
  const authorImage = String(formData.get("authorImage") ?? "").trim()
  const authorTitle = String(formData.get("authorTitle") ?? "").trim()
  const category = String(formData.get("category") ?? "").trim()
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
  const seoTitleEn = String(formData.get("seoTitleEn") ?? "").trim()
  const seoTitleZh = String(formData.get("seoTitleZh") ?? "").trim()
  const metaDescriptionEn = String(formData.get("metaDescriptionEn") ?? "").trim()
  const metaDescriptionZh = String(formData.get("metaDescriptionZh") ?? "").trim()
  const displayOrder = numberValue(formData, "displayOrder", 0)
  const isActive = formData.get("isActive") === "on"
  const isFeatured = formData.get("isFeatured") === "on"
  const publishedAtValue = String(formData.get("publishedAt") ?? "").trim()
  const readingTimeMinutes = numberValue(formData, "readingTimeMinutes", 0)
  const publishedAt = isActive
    ? publishedAtValue
      ? new Date(publishedAtValue).toISOString()
      : new Date().toISOString()
    : null

  if (!id || !slug || !titleEn) {
    throw new Error("Insight id, slug, and English title are required")
  }

  const payload = {
    slug,
    display_order: displayOrder,
    title_en: titleEn,
    title_zh: titleZh || null,
    summary_en: summaryEn || null,
    summary_zh: summaryZh || null,
    body_en: bodyEn || null,
    body_zh: bodyZh || null,
    cover_image: coverImage || null,
    author_name: authorName || null,
    author_image: authorImage || null,
    author_title: authorTitle || null,
    category: category || null,
    tags,
    reading_time_minutes: readingTimeMinutes || Math.max(1, Math.ceil(bodyEn.split(/\s+/).filter(Boolean).length / 200)),
    seo_title_en: seoTitleEn || null,
    seo_title_zh: seoTitleZh || null,
    meta_description_en: metaDescriptionEn || null,
    meta_description_zh: metaDescriptionZh || null,
    faq_en: faqPairs(formData, "en"),
    faq_zh: faqPairs(formData, "zh"),
    is_active: isActive,
    is_featured: isFeatured,
    published_at: publishedAt,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.schema("cms").from("insights").update(payload).eq("id", id)

  if (error) throw error

  revalidatePath("/admin/insights")
  revalidatePath(`/admin/insights/${id}`)
  revalidatePath("/en/insights")
  revalidatePath("/zh/insights")
  revalidatePath(`/en/insights/${slug}`)
  revalidatePath(`/zh/insights/${slug}`)
  revalidatePath("/en")
  revalidatePath("/zh")
}

function faqPairs(formData: FormData, locale: "en" | "zh") {
  const questions = formData.getAll(`faq_${locale}_question`).map((value) => String(value).trim())
  const answers = formData.getAll(`faq_${locale}_answer`).map((value) => String(value).trim())

  return questions
    .map((question, index) => ({ question, answer: answers[index] ?? "" }))
    .filter((pair) => pair.question || pair.answer)
}

export async function createInsightDraft() {
  const supabase = await requireAdminClient()
  const now = Date.now()
  const slug = `draft-${now}`

  const { data, error } = await supabase
    .schema("cms")
    .from("insights")
    .insert({
      slug,
      title_en: "Untitled insight",
      display_order: 0,
      is_active: false,
      is_featured: false,
    })
    .select("id")
    .single()

  if (error) throw error
  if (!data?.id) throw new Error("Unable to create insight draft")

  revalidatePath("/admin/insights")
  redirect(`/admin/insights/${data.id}`)
}

export async function deleteInsight(formData: FormData) {
  const supabase = await requireAdminClient()
  const id = String(formData.get("id") ?? "")

  if (!id) throw new Error("Insight id is required")

  const { error } = await supabase.schema("cms").from("insights").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/insights")
  revalidatePath("/en/insights")
  revalidatePath("/zh/insights")
  revalidatePath("/en")
  revalidatePath("/zh")
  redirect("/admin/insights")
}

export async function setInsightStatus(formData: FormData) {
  const supabase = await requireAdminClient()
  const id = String(formData.get("id") ?? "")
  const isActive = String(formData.get("isActive") ?? "") === "true"

  if (!id) throw new Error("Insight id is required")

  const { error } = await supabase
    .schema("cms")
    .from("insights")
    .update({
      is_active: isActive,
      published_at: isActive ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) throw error

  revalidatePath("/admin/insights")
  revalidatePath("/en/insights")
  revalidatePath("/zh/insights")
  revalidatePath("/en")
  revalidatePath("/zh")
}

export async function setInsightFeatured(formData: FormData) {
  const supabase = await requireAdminClient()
  const id = String(formData.get("id") ?? "")
  const isFeatured = String(formData.get("isFeatured") ?? "") === "true"

  if (!id) throw new Error("Insight id is required")

  const { error } = await supabase
    .schema("cms")
    .from("insights")
    .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) throw error

  revalidatePath("/admin/insights")
  revalidatePath("/en")
  revalidatePath("/zh")
}

export async function publishInsightNow(formData: FormData) {
  formData.set("isActive", "on")
  await saveInsight(formData)
}

export async function uploadInsightImage(formData: FormData) {
  const supabase = await requireAdminClient()
  const id = String(formData.get("id") ?? "")
  const file = formData.get("file")

  if (!id || !(file instanceof File)) {
    throw new Error("Insight id and image file are required")
  }

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, "-")
  const path = `${id}/${Date.now()}-${safeName || "image"}`
  const { error } = await supabase.storage.from("insight-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "application/octet-stream",
  })

  if (error) throw error

  const { data } = supabase.storage.from("insight-images").getPublicUrl(path)
  return { url: data.publicUrl, path }
}
