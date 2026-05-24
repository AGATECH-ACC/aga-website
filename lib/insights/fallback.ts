import type { CmsInsight } from "@/lib/cms/types"
import type { Locale } from "@/lib/i18n/dictionary"

type FallbackInsightBase = {
  slug: string
  categoryEn: string
  categoryZh: string
  readingTimeMinutes: number
  publishedAt: string
  coverImage: string
  titleEn: string
  titleZh: string
  summaryEn: string
  summaryZh: string
  bodyEn: string
  bodyZh: string
  faqEn?: Array<{ question: string; answer: string }>
  faqZh?: Array<{ question: string; answer: string }>
  isFeatured?: boolean
}

const authorImage = ""
const fallbackCreatedAt = "2026-05-01T00:00:00.000Z"

const fallbackInsights: FallbackInsightBase[] = [
  {
    slug: "sme-approval-bottleneck",
    categoryEn: "Systems",
    categoryZh: "系统化",
    readingTimeMinutes: 5,
    publishedAt: "2026-05-01T00:00:00.000Z",
    coverImage: "/assets/aga-hero-1.png",
    titleEn: "How SME owners stop becoming the approval bottleneck",
    titleZh: "老板如何不再成为审批瓶颈",
    summaryEn:
      "A practical look at mapping decisions, approvals, and handoffs before installing another tool.",
    summaryZh: "先梳理决策、审批与交接流程，再决定要导入什么工具。",
    bodyEn: `## Why owners become the bottleneck

Most SME owners do not become bottlenecks because they want control. They become bottlenecks because the company has no shared operating map. Decisions, approvals, and handoffs live in memory, chat messages, and verbal habits.

> Systemization is not about removing the owner. It is about removing unnecessary dependency on the owner.

## What to map first

Start with the repeated moments where the team asks the same questions. Who approves this? What happens after payment? When does operations get notified? Which customer promise needs follow-up?

## What owners can do this week

Create a simple Workflow Registry for one process. List the trigger, owner, approval point, handoff, document, and final output. Once the workflow is visible, OneSystem can turn it into tasks, dashboards, and reminders.`,
    bodyZh: `## 为什么老板会成为瓶颈

很多 SME 老板不是因为喜欢控制才变成瓶颈，而是因为公司没有一张共同的运营地图。决策、审批和交接都藏在记忆、聊天记录和口头习惯里。

> 系统化不是把老板拿掉，而是拿掉团队对老板的不必要依赖。

## 先梳理什么

从团队最常重复追问的问题开始。谁批准？付款后下一步是什么？运营什么时候收到通知？客户承诺由谁跟进？

## 本周可以做什么

先为一个流程建立 Workflow Registry。写下触发点、负责人、审批点、交接、文件和最终结果。流程看得见之后，OneSystem 才能把它变成任务、仪表盘和提醒。`,
    faqEn: [
      {
        question: "Should SMEs automate before documenting workflows?",
        answer:
          "No. Document the workflow first so automation supports the real operating logic instead of making confusion faster.",
      },
    ],
    faqZh: [
      {
        question: "SME 应该先自动化，还是先整理流程？",
        answer: "先整理流程。否则自动化只会把混乱变得更快。",
      },
    ],
    isFeatured: true,
  },
  {
    slug: "ai-automation-growing-business",
    categoryEn: "AI Automation",
    categoryZh: "AI 自动化",
    readingTimeMinutes: 6,
    publishedAt: "2026-04-18T00:00:00.000Z",
    coverImage: "/assets/aga-hero-2.png",
    titleEn: "Where AI automation actually helps a growing business",
    titleZh: "AI 自动化真正能帮上忙的地方",
    summaryEn:
      "Use AI for reminders, reporting, routing, and repetitive admin after the workflow is clear.",
    summaryZh: "当流程清楚后，AI 可以协助提醒、报表、分派与重复行政工作。",
    bodyEn: `## AI works best after the workflow is clear

AI should not be the first system. It should sit on top of a clear workflow, where it can read signals, prepare drafts, remind owners, summarize updates, and help teams act faster.

## Good first AI use cases

- Follow-up reminders for overdue sales or service tasks
- Daily summaries for owners
- Draft replies based on customer context
- Routing requests to the right person
- Turning messy updates into structured records

## The practical rule

If a human cannot explain the process clearly, AI will not fix it. Build the Business DNA first, then let OneIntelligence support the team.`,
    bodyZh: `## AI 最适合放在清楚流程之后

AI 不应该是第一套系统。它应该建立在清楚流程之上，用来读取信号、准备初稿、提醒负责人、总结更新，并帮助团队更快执行。

## 适合先做的 AI 场景

- 逾期销售或服务任务提醒
- 老板每日摘要
- 根据客户背景生成回复初稿
- 把请求分派给正确负责人
- 把零散更新整理成结构化记录

## 实用判断

如果人都讲不清楚流程，AI 不会自动修好它。先建立 Business DNA，再让 OneIntelligence 协助团队。`,
  },
  {
    slug: "first-system-to-document",
    categoryEn: "Operations",
    categoryZh: "运营",
    readingTimeMinutes: 4,
    publishedAt: "2026-04-03T00:00:00.000Z",
    coverImage: "/assets/aga-hero-3.png",
    titleEn: "The first system every operations-heavy SME should document",
    titleZh: "运营型 SME 最应该先整理的系统",
    summaryEn:
      "Start with the workflow that creates the most repeated questions, delays, and manual checking.",
    summaryZh: "从最常被追问、延误和重复检查的流程开始，让团队先有标准。",
    bodyEn: `## Start with the workflow that creates the most noise

The first system to document is rarely the most sophisticated one. It is usually the process that creates repeated checking, unclear ownership, and daily interruptions.

## How to choose the first workflow

Pick the workflow that has high frequency, visible delays, repeated questions, and direct customer or cash-flow impact.

## What the end result should look like

By the end, the team should know what triggers the workflow, who owns each step, what must be checked, where the status is visible, and when escalation happens.`,
    bodyZh: `## 从最吵的流程开始

最先整理的系统通常不是最复杂的，而是每天造成重复检查、责任不清和不断打断的流程。

## 如何选择第一个流程

选择频率高、延误明显、问题重复，并且会影响客户或现金流的流程。

## 最后应该长什么样

团队应该清楚知道流程如何触发、每一步由谁负责、要检查什么、状态在哪里看，以及什么时候需要升级处理。`,
  },
]

export function getFallbackInsights(locale: Locale): CmsInsight[] {
  return fallbackInsights.map((item, index) => {
    const title = locale === "zh" ? item.titleZh : item.titleEn
    const summary = locale === "zh" ? item.summaryZh : item.summaryEn
    const body = locale === "zh" ? item.bodyZh : item.bodyEn
    const category = locale === "zh" ? item.categoryZh : item.categoryEn

    return {
      id: `fallback-${item.slug}`,
      slug: item.slug,
      titleEn: item.titleEn,
      titleZh: item.titleZh,
      summaryEn: item.summaryEn,
      summaryZh: item.summaryZh,
      bodyEn: item.bodyEn,
      bodyZh: item.bodyZh,
      coverImage: item.coverImage,
      authorName: "Tan Chi Shiong",
      authorImage,
      authorTitle: "Founder, AGA Ventures",
      category,
      tags: [category],
      readingTimeMinutes: item.readingTimeMinutes,
      seoTitleEn: item.titleEn,
      seoTitleZh: item.titleZh,
      metaDescriptionEn: item.summaryEn,
      metaDescriptionZh: item.summaryZh,
      faqEn: item.faqEn ?? [],
      faqZh: item.faqZh ?? [],
      isFeatured: Boolean(item.isFeatured),
      publishedAt: item.publishedAt,
      createdAt: fallbackCreatedAt,
      title,
      summary,
      body,
      href: `/${locale}/insights/${item.slug}`,
      displayOrder: index,
      isActive: true,
      updatedAt: item.publishedAt,
    }
  })
}
