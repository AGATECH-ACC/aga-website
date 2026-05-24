import { notFound } from "next/navigation"

import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n/dictionary"
import { getCmsIndustry, getCmsProducts } from "@/lib/cms/public-content"
import { getSolutionBlueprint } from "@/lib/solutions/blueprints"

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
    getDictionary(locale).industriesSection.industries.map((industry) => ({
      locale,
      slug: getSlugFromHref(industry.href),
    }))
  )
}

export default async function SolutionDetailPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)
  const cmsIndustry = await getCmsIndustry(locale, slug)
  const fallbackIndustry = dictionary.industriesSection.industries.find(
    (item) => getSlugFromHref(item.href) === slug
  )
  const industry = cmsIndustry ?? fallbackIndustry
  const products = await getCmsProducts(locale, dictionary.productsSection.products)
  const blueprint = getSolutionBlueprint(locale, slug)

  if (!industry) {
    notFound()
  }

  return (
    <LocalizedShell locale={locale} path={`/${locale}/solutions/${slug}`}>
      <InnerPage
        eyebrow={dictionary.pages.solutions.eyebrow}
        title={industry.title}
        accent={dictionary.pages.solutions.accent}
        description={industry.description}
        parentHref={`/${locale}/solutions`}
        parentLabel={dictionary.pages.solutions.backLabel}
        cards={
          blueprint?.modules.length
            ? blueprint.modules
            : products.slice(0, 3).map((product) => ({
                title: product.name + " — " + product.tagline,
                description: product.description,
                href: product.href,
              }))
        }
      />
    </LocalizedShell>
  )
}
