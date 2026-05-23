import { notFound } from "next/navigation"

import { getDictionary, isLocale, type Locale } from "@/lib/i18n/dictionary"
import { getCmsProducts } from "@/lib/cms/public-content"

import { InnerPage } from "../_components/InnerPage"
import { LocalizedShell } from "../_components/LocalizedShell"

export const revalidate = 60

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)
  const products = await getCmsProducts(locale, dictionary.productsSection.products)

  return (
    <LocalizedShell locale={locale} path={`/${locale}/services`}>
      <InnerPage
        eyebrow={dictionary.pages.services.eyebrow}
        title={dictionary.pages.services.title}
        accent={dictionary.pages.services.accent}
        description={dictionary.pages.services.description}
        actionLabel={dictionary.industriesSection.ctaLabel}
        cards={products.map((product) => ({
          title: product.name + " — " + product.tagline,
          description: product.description,
          href: product.href,
        }))}
      />
    </LocalizedShell>
  )
}
