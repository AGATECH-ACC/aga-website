import { notFound } from "next/navigation"

import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n/dictionary"
import { getCmsProduct } from "@/lib/cms/public-content"

import { InnerPage } from "../../_components/InnerPage"
import { LocalizedShell } from "../../_components/LocalizedShell"

export const revalidate = 60

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

function getSlugFromHref(href: string) {
  return href.split("/").filter(Boolean).at(-1) ?? ""
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getDictionary(locale).productsSection.products.map((product) => ({
      locale,
      slug: getSlugFromHref(product.href),
    }))
  )
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)
  const cmsProduct = await getCmsProduct(locale, slug)
  const fallbackProduct = dictionary.productsSection.products.find(
    (p) => getSlugFromHref(p.href) === slug
  )
  const product = cmsProduct ?? fallbackProduct

  if (!product) {
    notFound()
  }

  return (
    <LocalizedShell locale={locale} path={`/${locale}/services/${slug}`}>
      <InnerPage
        eyebrow={dictionary.pages.services.eyebrow}
        title={product.name}
        accent={product.tagline}
        description={product.description}
        parentHref={`/${locale}/services`}
        parentLabel={dictionary.pages.services.backLabel}
        cards={dictionary.processSection.steps.slice(0, 3).map((step) => ({
          title: step.title,
          description: step.description,
        }))}
      />
    </LocalizedShell>
  )
}
