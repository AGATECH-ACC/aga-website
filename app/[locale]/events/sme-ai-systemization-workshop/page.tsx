import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getDictionary, isLocale, type Locale } from "@/lib/i18n/dictionary"
import { getCmsEvent } from "@/lib/cms/public-content"

import { InnerPage } from "../../_components/InnerPage"
import { LocalizedShell } from "../../_components/LocalizedShell"

export const revalidate = 60

type PageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    return {}
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)
  const eventPage = await getCmsEvent(locale, "sme-ai-systemization-workshop", dictionary.eventPage)
  const title = `${eventPage.title} ${eventPage.accent} | AGA`

  return {
    title,
    description: eventPage.description,
    alternates: {
      canonical: `/${locale}/events/sme-ai-systemization-workshop`,
      languages: {
        en: "/en/events/sme-ai-systemization-workshop",
        zh: "/zh/events/sme-ai-systemization-workshop",
      },
    },
    openGraph: {
      title,
      description: eventPage.description,
      type: "article",
      locale: locale === "en" ? "en_US" : "zh_CN",
      alternateLocale: locale === "en" ? ["zh_CN"] : ["en_US"],
      url: `/${locale}/events/sme-ai-systemization-workshop`,
    },
  }
}

export default async function EventPage({ params }: PageProps) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)
  const eventPage = await getCmsEvent(locale, "sme-ai-systemization-workshop", dictionary.eventPage)

  return (
    <LocalizedShell
      locale={locale}
      path={`/${locale}/events/sme-ai-systemization-workshop`}
    >
      <InnerPage
        eyebrow={eventPage.eyebrow}
        title={eventPage.title}
        accent={eventPage.accent}
        description={eventPage.description}
        actionLabel={eventPage.actionLabel}
        parentHref={eventPage.parentHref}
        parentLabel={eventPage.parentLabel}
        cards={eventPage.cards.map((card) => ({
          title: card.title,
          description: card.description,
        }))}
      />
    </LocalizedShell>
  )
}
