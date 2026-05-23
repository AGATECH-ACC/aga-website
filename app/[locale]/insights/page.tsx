import { notFound } from "next/navigation"

import { getDictionary, isLocale, type Locale } from "@/lib/i18n/dictionary"

import { InnerPage } from "../_components/InnerPage"
import { LocalizedShell } from "../_components/LocalizedShell"

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function InsightsPage({ params }: PageProps) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)

  return (
    <LocalizedShell locale={locale} path={`/${locale}/insights`}>
      <InnerPage
        eyebrow={dictionary.pages.insights.eyebrow}
        title={dictionary.pages.insights.title}
        accent={dictionary.pages.insights.accent}
        description={dictionary.pages.insights.description}
      />
    </LocalizedShell>
  )
}
