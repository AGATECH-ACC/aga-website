import { notFound } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeader, WebsiteContainer, WebsiteSection } from "@/components/website"
import { getDictionary, isLocale, type Locale } from "@/lib/i18n/dictionary"
import { getCmsAbout } from "@/lib/cms/public-content"

import { LocalizedShell } from "../_components/LocalizedShell"

export const revalidate = 60

type PageProps = {
  params: Promise<{ locale: string }>
}

const aboutSections = {
  en: [
    {
      title: "Overview",
      body: "AGA is a Malaysia-focused business systemization and AI automation partner for growth-stage SMEs. The company helps owners turn scattered sales, operations, finance, approvals, and team communication into clear digital workflows that can be managed, measured, and improved.",
    },
    {
      title: "What AGA Builds",
      body: "AGA plans and implements service modules such as business process diagnosis, Lark and ERP workflows, sales CRM, finance visibility dashboards, AI agents, automation rules, and industry-specific operating systems.",
    },
    {
      title: "Method",
      body: "The work starts with understanding how the business actually runs. AGA maps the current workflow, identifies bottlenecks, prioritizes systemization opportunities, then builds practical modules that teams can adopt without losing daily momentum.",
    },
    {
      title: "Who It Serves",
      body: "AGA is built for SME owners and operators who still rely on Excel, WhatsApp, verbal approvals, and manual follow-up, and who want the company to run with clearer responsibility, faster execution, and better visibility.",
    },
  ],
  zh: [
    {
      title: "概览",
      body: "AGA 是面向马来西亚成长型 SME 的企业系统化与 AI 自动化服务品牌，协助老板把分散在销售、运营、财务、审批和团队沟通里的日常工作，整理成清楚、可追踪、可持续优化的数字工作流。",
    },
    {
      title: "服务范围",
      body: "AGA 规划并搭建的服务模块包括业务流程诊断、Lark 与 ERP 工作流、销售 CRM、财务可视化仪表盘、AI Agent、自动化规则，以及按行业场景设计的运营系统。",
    },
    {
      title: "方法",
      body: "AGA 的方法不是先卖工具，而是先理解业务实际如何运作。团队会梳理当前流程、找出卡点、排列系统化优先级，再搭建团队真正能落地使用的模块。",
    },
    {
      title: "适合对象",
      body: "AGA 适合仍依赖 Excel、WhatsApp、口头审批和人工跟进的 SME 老板与管理团队，目标是让企业责任更清楚、执行更快、老板视野更完整。",
    },
  ],
} as const

export default async function AboutPage({ params }: PageProps) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)
  const aboutPage = await getCmsAbout(locale, dictionary.pages.about)
  const sections = aboutSections[locale]

  return (
    <LocalizedShell locale={locale} path={`/${locale}/about`}>
      <WebsiteSection>
        <WebsiteContainer className="flex flex-col gap-10">
          <SectionHeader
            eyebrow={aboutPage.eyebrow}
            title={aboutPage.title}
            accent={aboutPage.accent}
            description={aboutPage.description}
          />

          <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
            <div className="grid gap-4">
              {sections.map((section) => (
                <Card key={section.title}>
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-8 text-muted-foreground">
                      {section.body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="h-fit lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle>{locale === "zh" ? "AGA 资料" : "AGA Facts"}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm">
                <div>
                  <p className="font-semibold">{locale === "zh" ? "领域" : "Focus"}</p>
                  <p className="text-muted-foreground">
                    {locale === "zh" ? "业务系统化、AI 自动化、SME 数字化" : "Business systemization, AI automation, SME digitalization"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">{locale === "zh" ? "服务区域" : "Market"}</p>
                  <p className="text-muted-foreground">
                    {locale === "zh" ? "马来西亚成长型中小企业" : "Growth-stage SMEs in Malaysia"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">{locale === "zh" ? "核心结果" : "Core Result"}</p>
                  <p className="text-muted-foreground">
                    {locale === "zh" ? "让老板看清流程、数据、责任和下一步自动化机会" : "Clear workflows, data, ownership, and automation priorities for owners"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </WebsiteContainer>
      </WebsiteSection>
    </LocalizedShell>
  )
}
