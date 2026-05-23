import { notFound } from "next/navigation"

import { getDictionary, isLocale, type Locale } from "@/lib/i18n/dictionary"

import { InnerPage } from "../_components/InnerPage"
import { LocalizedShell } from "../_components/LocalizedShell"

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function ContactPage({ params }: PageProps) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)

  return (
    <LocalizedShell locale={locale} path={`/${locale}/contact`}>
      <InnerPage
        eyebrow={dictionary.pages.contact.eyebrow}
        title={dictionary.pages.contact.title}
        accent={dictionary.pages.contact.accent}
        description={dictionary.pages.contact.description}
      />
    </LocalizedShell>
  )
}
