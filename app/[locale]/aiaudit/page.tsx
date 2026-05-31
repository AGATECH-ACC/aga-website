import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AiAuditApp } from "@/components/website/AiAuditApp"
import { isLocale, type Locale } from "@/lib/i18n/dictionary"

type PageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = localeParam === "zh" ? "zh" : "en"

  return {
    title: locale === "zh" ? "AGA AI 审计 | AGA 系统掌柜" : "AGA AI Audit | AGA OneSystem",
    description:
      locale === "zh"
        ? "在线评估你的企业 AI 准备度，获得 OneSystem 与 OneIntelligence 落地路线图。"
        : "Assess your company's AI readiness online and get a practical OneSystem and OneIntelligence roadmap.",
  }
}

export default async function AiAuditPage({ params }: PageProps) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam

  return <AiAuditApp locale={locale} />
}
