import type { Dictionary } from "@/lib/i18n/dictionary"

import { getPublishedEntries, getPublishedEntry } from "./db"
import type { CmsEntry, CmsLocale } from "./types"

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback
}

function bool(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback
}

function textArray(value: unknown, fallback: string[] = []) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) : fallback
}

function moduleArray(value: unknown) {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const moduleField = item as { title?: unknown; description?: unknown }
      return {
        title: text(moduleField.title),
        description: text(moduleField.description),
      }
    })
    .filter((item): item is { title: string; description: string } => Boolean(item?.title || item?.description))
}

function localeContent(entry: CmsEntry, locale: CmsLocale) {
  return entry.locales.find((item) => item.locale === locale)
}

export async function getCmsProducts(
  locale: CmsLocale,
  fallback: Dictionary["productsSection"]["products"],
  options: { includeFallback?: boolean } = {}
) {
  const entries = await getPublishedEntries("products")

  if (!entries.length) return options.includeFallback === false ? [] : fallback

  return entries
    .map((entry) => {
      const content = localeContent(entry, locale)
      if (!content?.title) return null

      return {
        name: content.title,
        tagline: content.accent || text(content.fields.tagline),
        description: content.summary,
        href: `/${locale}/services/${entry.slug}`,
        visualKind: text(content.fields.visualKind, "workflow") as "workflow" | "operations" | "sales" | "finance" | "ai",
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
}

export async function getCmsProduct(locale: CmsLocale, slug: string) {
  const entry = await getPublishedEntry("products", slug)
  const content = entry ? localeContent(entry, locale) : null

  if (!entry || !content) return null

  return {
    slug: entry.slug,
    name: content.title,
    tagline: content.accent || text(content.fields.tagline),
    description: content.summary,
    details: Array.isArray(content.fields.details)
      ? (content.fields.details as Array<{ title: string; description: string }>)
      : [],
  }
}

export async function getCmsIndustries(
  locale: CmsLocale,
  fallback: Dictionary["industriesSection"]["industries"],
  options: { includeFallback?: boolean } = {}
) {
  const entries = await getPublishedEntries("industries")

  if (!entries.length) return options.includeFallback === false ? [] : fallback

  return entries
    .map((entry) => {
      const content = localeContent(entry, locale)
      if (!content?.title) return null

      return {
        title: content.title,
        description: content.summary,
        href: `/${locale}/solutions/${entry.slug}`,
        visualKind: text(content.fields.visualKind, "services") as "education" | "fnb" | "services" | "wholesale" | "professional",
        active: bool(content.fields.active),
        image: text(content.fields.imageUrl),
        inside: textArray(content.fields.inside),
        result: text(content.fields.result),
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
}

export async function getCmsIndustry(locale: CmsLocale, slug: string) {
  const entry = await getPublishedEntry("industries", slug)
  const content = entry ? localeContent(entry, locale) : null

  if (!entry || !content) return null

  return {
    slug: entry.slug,
    title: content.title,
    description: content.summary,
    image: text(content.fields.imageUrl),
    vertical: text(content.fields.vertical),
    audience: text(content.fields.audience),
    inside: textArray(content.fields.inside),
    result: text(content.fields.result),
    painPoints: textArray(content.fields.painPoints),
    trustAnchors: textArray(content.fields.trustAnchors),
    legacyToolsReplaced: textArray(content.fields.legacyToolsReplaced),
    questionHeadings: textArray(content.fields.questionHeadings),
    modules: moduleArray(content.fields.modules),
  }
}

export async function getCmsCaseStudies(
  locale: CmsLocale,
  fallback: Dictionary["caseStudyItems"],
  options: { includeFallback?: boolean } = {}
) {
  const entries = await getPublishedEntries("case_studies")

  if (!entries.length) return options.includeFallback === false ? [] : fallback

  return entries
    .map((entry) => {
      const content = localeContent(entry, locale)
      if (!content?.title) return null

      return {
        slug: entry.slug,
        title: content.title,
        industry: content.accent || text(content.fields.industry),
        metric: text(content.fields.metric),
        locationSignal: text(content.fields.locationSignal),
        workflowFocus: text(content.fields.workflowFocus),
        agaSystem: text(content.fields.agaSystem),
        legacyToolsReplaced: textArray(content.fields.legacyToolsReplaced),
        summary: content.summary,
        challenge: text(content.fields.challenge),
        solution: text(content.fields.solution),
        result: text(content.fields.result),
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
}

export async function getCmsEvent(locale: CmsLocale, slug: string, fallback: Dictionary["eventPage"]) {
  const entry = await getPublishedEntry("events", slug)
  const content = entry ? localeContent(entry, locale) : null

  if (!entry || !content) return fallback

  return {
    eyebrow: content.accent || fallback.eyebrow,
    title: content.title,
    accent: text(content.fields.accent, fallback.accent),
    description: content.summary,
    parentLabel: fallback.parentLabel,
    parentHref: fallback.parentHref,
    actionLabel: text(content.fields.ctaLabel, fallback.actionLabel),
    cards: Array.isArray(content.fields.cards)
      ? (content.fields.cards as Array<{ title: string; description: string }>)
      : fallback.cards,
  }
}

export async function getCmsAbout(locale: CmsLocale, fallback: Dictionary["pages"]["about"]) {
  const entry = await getPublishedEntry("about", "about")
  const content = entry ? localeContent(entry, locale) : null

  if (!entry || !content) return fallback

  return {
    eyebrow: content.accent || fallback.eyebrow,
    title: content.title,
    accent: text(content.fields.accent, fallback.accent),
    description: content.summary || fallback.description,
  }
}
