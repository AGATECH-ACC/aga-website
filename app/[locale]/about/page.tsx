import { notFound } from "next/navigation"

import { getDictionary, isLocale, type Locale } from "@/lib/i18n/dictionary"
import { getCmsAbout } from "@/lib/cms/public-content"

import { InnerPage } from "../_components/InnerPage"
import { LocalizedShell } from "../_components/LocalizedShell"

export const revalidate = 60

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: PageProps) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)
  const aboutPage = await getCmsAbout(locale, dictionary.pages.about)

  return (
    <LocalizedShell locale={locale} path={`/${locale}/about`}>
      <InnerPage
        eyebrow={aboutPage.eyebrow}
        title={aboutPage.title}
        accent={aboutPage.accent}
        description={aboutPage.description}
      />
    </LocalizedShell>
  )
}
