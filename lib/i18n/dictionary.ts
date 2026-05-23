import { en } from "./en"
import { zh } from "./zh"

export const locales = ["en", "zh"] as const

export type Locale = (typeof locales)[number]

export const dictionaries = {
  en,
  zh,
} as const

export type Dictionary = (typeof dictionaries)[Locale]

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale]
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "en" ? "zh" : "en"
}
