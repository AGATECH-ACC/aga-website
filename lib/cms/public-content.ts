import type { Dictionary } from "@/lib/i18n/dictionary"

import { getPublishedEntries, getPublishedEntry } from "./db"
import type { CmsEntry, CmsLocale } from "./types"

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback
}

function bool(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback
}

function localeContent(entry: CmsEntry, locale: CmsLocale) {
  return entry.locales.find((item) => item.locale === locale)
}

export async function getCmsProducts(locale: CmsLocale, fallback: Dictionary["productsSection"]["products"]) {
  const entries = await getPublishedEntries("products")

  if (!entries.length) return fallback

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

export async function getCmsIndustries(locale: CmsLocale, fallback: Dictionary["industriesSection"]["industries"]) {
  const entries = await getPublishedEntries("industries")

  if (!entries.length) return fallback

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
    modules: Array.isArray(content.fields.modules)
      ? (content.fields.modules as Array<{ title: string; description: string }>)
      : [],
  }
}

export async function getCmsCaseStudies(locale: CmsLocale, fallback: Dictionary["caseStudyItems"]) {
  const entries = await getPublishedEntries("case_studies")

  if (!entries.length) return fallback

  return entries
    .map((entry) => {
      const content = localeContent(entry, locale)
      if (!content?.title) return null

      return {
        slug: entry.slug,
        title: content.title,
        industry: content.accent || text(content.fields.industry),
        metric: text(content.fields.metric),
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
