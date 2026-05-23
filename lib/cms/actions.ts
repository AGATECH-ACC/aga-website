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

function parseJson(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") return {}

  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
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
    const fields = parseJson(formData.get(`${locale}.fields`))
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
  revalidatePath(`/admin/${collection.replace("_", "-")}`)
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
  revalidatePath(`/admin/${collection.replace("_", "-")}`)
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
}
