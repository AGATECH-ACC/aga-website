import { notFound } from "next/navigation"

import { getDictionary, isLocale, type Locale } from "@/lib/i18n/dictionary"
import { getCmsIndustries } from "@/lib/cms/public-content"

import { InnerPage } from "../_components/InnerPage"
import { LocalizedShell } from "../_components/LocalizedShell"

export const revalidate = 60

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function SolutionsPage({ params }: PageProps) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)
  const industries = await getCmsIndustries(locale, dictionary.industriesSection.industries)

  return (
    <LocalizedShell locale={locale} path={`/${locale}/solutions`}>
      <InnerPage
        eyebrow={dictionary.industriesSection.eyebrow}
        title={dictionary.pages.solutions.title}
        accent={dictionary.pages.solutions.accent}
        description={dictionary.pages.solutions.description}
        actionLabel={dictionary.industriesSection.ctaLabel}
        cards={industries.map((industry) => ({
          title: industry.title,
          description: industry.description,
          href: industry.href,
        }))}
      />
    </LocalizedShell>
  )
}
