import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { GulichanTanContactCard } from "@/components/gulichantan/GulichanTanContactCard"
import { isLocale, locales, type Locale } from "@/lib/i18n/dictionary"
import { profile } from "@/src/config/profile"

type GulichanTanPageProps = {
  params: Promise<{ locale: string }>
}

const metadataByLocale: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "GULICHAN — Founder & Business Architect",
    description:
      "Meet GULICHAN and ask his AI about business systems, automation, AGA Ventures and AI.",
  },
  zh: {
    title: "GULICHAN — 创办人兼企业架构师",
    description:
      "认识 GULICHAN，并向他的 AI 了解企业系统、自动化、AGA Ventures 与 AI。",
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
  const pageUrl = new URL(`/${locale}/gulichantan`, profile.websiteUrl).toString()
  const iconUrl = new URL("/icon.png", profile.websiteUrl).toString()

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
      url: pageUrl,
      siteName: profile.company,
      images: [
        {
          url: iconUrl,
          width: 820,
          height: 820,
          alt: "AGA Ventures",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: pageMetadata.title,
      description: pageMetadata.description,
      images: [iconUrl],
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
