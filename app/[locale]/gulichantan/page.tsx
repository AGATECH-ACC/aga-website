import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { GulichanTanContactCard } from "@/components/gulichantan/GulichanTanContactCard"
import { isLocale, locales, type Locale } from "@/lib/i18n/dictionary"

type GulichanTanPageProps = {
  params: Promise<{ locale: string }>
}

const metadataByLocale: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Tan Chi Shiong | AGA Ventures",
    description:
      "Connect with Tan Chi Shiong, founder of AGA Ventures and business systemization architect.",
  },
  zh: {
    title: "陈起祥 | AGA Ventures",
    description:
      "联系 AGA Ventures 创办人兼企业系统化架构师陈起祥。",
  },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: GulichanTanPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    return {}
  }

  const locale: Locale = localeParam
  const pageMetadata = metadataByLocale[locale]

  return {
    title: pageMetadata.title,
    description: pageMetadata.description,
    alternates: {
      canonical: `/${locale}/gulichantan`,
      languages: {
        en: "/en/gulichantan",
        zh: "/zh/gulichantan",
      },
    },
    openGraph: {
      title: pageMetadata.title,
      description: pageMetadata.description,
      type: "profile",
      locale: locale === "en" ? "en_US" : "zh_CN",
      alternateLocale: locale === "en" ? ["zh_CN"] : ["en_US"],
      url: `/${locale}/gulichantan`,
    },
  }
}

export default async function LocalizedGulichanTanPage({
  params,
}: GulichanTanPageProps) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  return <GulichanTanContactCard locale={localeParam} />
}
