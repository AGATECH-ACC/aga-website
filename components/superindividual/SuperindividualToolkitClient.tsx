"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  Lock,
  RotateCcw,
  Sparkles,
} from "lucide-react"

import { superindividualWhatsAppLink } from "@/lib/superindividual/constants"
import { promptTemplates } from "@/lib/superindividual/toolkit-content"

type VerifyState =
  | { status: "loading" }
  | { status: "valid"; user: ToolkitUser }
  | { status: "invalid" }

type ToolkitUser = {
  name: string
  email: string
  tier: string
}

type VerifyResponse = {
  valid: boolean
  user?: ToolkitUser
}

const principles = [
  {
    number: "①",
    title: "迭代优先于完美",
    description: "先出再调，用结果引导方向",
    prompt:
      "帮我写[你的任务]的初稿。不需要完美，\n先给我一个可以修改的版本。",
  },
  {
    number: "②",
    title: "先问\"我要什么\"",
    description: "输入模糊，输出一定模糊",
    prompt:
      "我要达到的目标是[目标]。\n目标受众是[受众]。\n语气是[语气]。\n帮我写[内容]。",
  },
  {
    number: "③",
    title: "拆步骤，不要一步登天",
    description: "流程化，才知道哪里出问题",
    prompt:
      "我想要[大目标]。\n请帮我把这个目标拆成5个具体步骤。\n每个步骤给我一个可以马上执行的行动。",
  },
  {
    number: "④",
    title: "知道何时不能出错",
    description: "探索用AI，执行用Workflow",
    prompt:
      "以下是我的工作流程：[描述流程]。\n请帮我找出哪些步骤可以用AI自动化，\n哪些步骤需要人工检查。",
  },
  {
    number: "⑤",
    title: "了解你的伙伴",
    description: "用对工具，比一直叫它改更有效",
    prompt:
      "我需要完成[任务]。\n请告诉我ChatGPT、Claude、NotebookLM\n哪一个最适合这个任务，以及为什么。",
  },
]

const aiTools = [
  {
    category: "核心聊天助手",
    name: "ChatGPT",
    logoSrc: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128",
    strength: "什么都能做",
    bestFor: ["写作和内容创作", "翻译", "头脑风暴", "日常问答"],
    free: "免费版可用，功能和次数有限",
    paid: "Plus / Pro 提供更高额度和高级模型",
    href: "https://chat.openai.com",
    badge: "最推荐新手",
  },
  {
    category: "核心聊天助手",
    name: "Claude",
    logoSrc: "https://www.google.com/s2/favicons?domain=claude.ai&sz=128",
    strength: "逻辑分析，长文处理",
    bestFor: ["商业分析", "长文档整理", "复杂推理", "专业写作"],
    free: "免费版可用 Sonnet，额度有限",
    paid: "Pro / Max 提供更高使用额度",
    href: "https://claude.ai",
    badge: "长文首选",
  },
  {
    category: "核心聊天助手",
    name: "Gemini",
    logoSrc: "https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128",
    strength: "Google生态，搜索和多模态",
    bestFor: ["Google资料整理", "多模态问答", "快速研究", "日常工作"],
    free: "免费版可用，额度有限",
    paid: "Google AI Pro / Ultra 提供更高额度",
    href: "https://gemini.google.com",
  },
  {
    category: "核心聊天助手",
    name: "Grok",
    logoSrc: "https://www.google.com/s2/favicons?domain=grok.com&sz=128",
    strength: "实时话题，社媒语境",
    bestFor: ["趋势观察", "社媒内容角度", "快速问答", "热点分析"],
    free: "可免费试用，额度和地区可能不同",
    paid: "X Premium / SuperGrok 提供更高额度",
    href: "https://grok.com",
  },
  {
    category: "研究与知识整理",
    name: "NotebookLM",
    logoSrc: "https://cdn.simpleicons.org/notebooklm/111827",
    strength: "知识整理",
    bestFor: ["会议记录", "文件分析", "知识库建立", "PDF整理"],
    free: "标准版可免费使用",
    paid: "Plus / Pro 提供更高额度和功能",
    href: "https://notebooklm.google.com",
    badge: "知识库首选",
  },
  {
    category: "研究与知识整理",
    name: "Perplexity",
    logoSrc: "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128",
    strength: "带来源的搜索型问答",
    bestFor: ["快速资料搜集", "市场研究", "竞品资料", "带出处答案"],
    free: "免费版可用，Pro 搜索额度有限",
    paid: "Pro 提供更高搜索额度和模型选择",
    href: "https://www.perplexity.ai",
    badge: "研究首选",
  },
  {
    category: "研究与知识整理",
    name: "Elicit",
    logoSrc: "https://www.google.com/s2/favicons?domain=elicit.com&sz=128",
    strength: "学术论文和研究摘要",
    bestFor: ["论文搜索", "文献综述", "研究问题整理", "证据比较"],
    free: "免费版可试用基础研究流程",
    paid: "Plus / Pro 提供更高额度",
    href: "https://elicit.com",
  },
  {
    category: "图像与设计",
    name: "Midjourney",
    logoSrc: "https://www.google.com/s2/favicons?domain=midjourney.com&sz=128",
    strength: "高质感图像生成",
    bestFor: ["品牌视觉", "海报概念", "产品氛围图", "创意探索"],
    free: "付费为主，偶尔开放试用",
    paid: "订阅制，适合稳定出图",
    href: "https://www.midjourney.com",
    badge: "视觉质感强",
  },
  {
    category: "图像与设计",
    name: "DALL·E 3",
    logoSrc: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    strength: "文字理解强，适合快速出图",
    bestFor: ["社媒配图", "概念草图", "广告视觉", "图像修改想法"],
    free: "ChatGPT 免费版通常有有限图像额度",
    paid: "Plus / Pro 提供更高额度",
    href: "https://chat.openai.com",
  },
  {
    category: "视频与内容制作",
    name: "RunwayML",
    logoSrc: "https://www.google.com/s2/favicons?domain=runwayml.com&sz=128",
    strength: "AI视频生成和视频编辑",
    bestFor: ["短片概念", "产品视频", "动态素材", "创意广告"],
    free: "免费额度有限",
    paid: "订阅制，适合持续视频制作",
    href: "https://runwayml.com",
    badge: "视频生成推荐",
  },
  {
    category: "视频与内容制作",
    name: "CapCut AI",
    logoSrc: "https://www.google.com/s2/favicons?domain=capcut.com&sz=128",
    strength: "短视频剪辑和字幕",
    bestFor: ["Reels/TikTok", "自动字幕", "快速剪辑", "模板化内容"],
    free: "基础功能可免费使用",
    paid: "Pro 提供更多模板、素材和高级功能",
    href: "https://www.capcut.com",
    badge: "短视频首选",
  },
  {
    category: "效率与工作流",
    name: "Notion AI",
    logoSrc: "https://www.google.com/s2/favicons?domain=notion.so&sz=128",
    strength: "笔记、文档和团队知识整理",
    bestFor: ["会议总结", "项目文档", "知识库", "团队协作"],
    free: "通常提供有限 AI 试用",
    paid: "付费工作区提供更完整 AI 功能",
    href: "https://www.notion.so/product/ai",
  },
  {
    category: "效率与工作流",
    name: "Otter.ai",
    logoSrc: "https://www.google.com/s2/favicons?domain=otter.ai&sz=128",
    strength: "会议录音、转写和摘要",
    bestFor: ["会议纪要", "访谈记录", "销售通话", "行动事项整理"],
    free: "免费版可用，转写分钟数有限",
    paid: "Pro / Business 提供更高额度",
    href: "https://otter.ai",
  },
  {
    category: "效率与工作流",
    name: "Gamma",
    logoSrc: "https://www.google.com/s2/favicons?domain=gamma.app&sz=128",
    strength: "AI简报和页面生成",
    bestFor: ["Pitch deck", "课程简报", "提案", "报告可视化"],
    free: "免费版有生成额度",
    paid: "付费版提供更多额度和导出能力",
    href: "https://gamma.app",
    badge: "简报推荐",
  },
  {
    category: "效率与工作流",
    name: "GitHub Copilot",
    logoSrc: "https://cdn.simpleicons.org/githubcopilot/111827",
    strength: "代码补全和开发助手",
    bestFor: ["写代码", "解释代码", "修Bug", "学习开发"],
    free: "免费版有每月请求和补全额度",
    paid: "Pro / Pro+ 提供更高额度和高级功能",
    href: "https://github.com/features/copilot",
  },
  {
    category: "效率与工作流",
    name: "Cursor",
    logoSrc: "https://cdn.simpleicons.org/cursor/111827",
    strength: "AI原生代码编辑器",
    bestFor: ["改网站", "理解代码库", "快速原型", "AI协作开发"],
    free: "Hobby 免费版可试用，额度有限",
    paid: "Pro / Teams 提供更高额度",
    href: "https://cursor.com",
    badge: "开发者推荐",
  },
]

const checklistGroups = [
  {
    title: "早上",
    icon: "☀️",
    focus: "定方向",
    items: [
      "今天最重要的3件事是什么？（用AI帮你排优先级）",
      "有没有昨天没完成的事？（用AI帮你重新规划）",
    ],
  },
  {
    title: "工作中",
    icon: "⚡",
    focus: "提效率",
    items: [
      "遇到不会的问题先问AI，再问人",
      "重复做的事情，想想能不能用AI模板化",
      "每次用AI之前，先想清楚\"我要什么\"",
    ],
  },
  {
    title: "晚上",
    icon: "🌙",
    focus: "做复盘",
    items: [
      "今天用AI完成了什么？（记录下来）",
      "有没有发现更好的Prompt？（保存起来）",
    ],
  },
  {
    title: "每周",
    icon: "🔁",
    focus: "建系统",
    items: [
      "找出一件重复的工作，建立AI模板",
      "分享一个AI技巧给身边的人",
      "更新你的超级个体宣言",
    ],
  },
]

export function SuperindividualToolkitClient({
  accessToken,
}: {
  accessToken: string
}) {
  const router = useRouter()
  const [verifyState, setVerifyState] = useState<VerifyState>({
    status: "loading",
  })

  useEffect(() => {
    let active = true

    async function verifyAccess() {
      try {
        const response = await fetch(
          `/api/superindividual-verify?id=${encodeURIComponent(accessToken)}`
        )
        const payload = (await response.json()) as VerifyResponse

        if (!active) {
          return
        }

        if (response.ok && payload.valid && payload.user) {
          setVerifyState({ status: "valid", user: payload.user })
          return
        }

        setVerifyState({ status: "invalid" })
        router.replace("/superindividual")
      } catch {
        if (active) {
          setVerifyState({ status: "invalid" })
          router.replace("/superindividual")
        }
      }
    }

    verifyAccess()

    return () => {
      active = false
    }
  }, [accessToken, router])

  if (verifyState.status !== "valid") {
    return <ToolkitLoading />
  }

  return <ToolkitContent user={verifyState.user} />
}

function ToolkitLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#1E2A3A] px-4 text-white">
      <div className="text-center">
        <Loader2 className="mx-auto size-12 animate-spin text-[#E8521A]" />
        <p className="mt-5 text-lg font-bold">验证中...</p>
      </div>
    </main>
  )
}

function ToolkitContent({ user }: { user: ToolkitUser }) {
  return (
    <main className="min-h-screen bg-[#1E2A3A] text-white">
      <section className="relative overflow-hidden px-4 py-16 md:px-8 md:py-20">
        <ToolkitBackground />
        <div className="relative mx-auto max-w-6xl">
          <Link
            href="/superindividual"
            className="inline-flex items-center gap-2 text-sm font-bold text-white/68 transition hover:text-[#E8521A]"
          >
            <ArrowLeft className="size-4" />
            回到超级个体页面
          </Link>
          <div className="mt-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h1 className="text-4xl font-extrabold tracking-normal md:text-6xl">
                欢迎回来，{user.name}！
              </h1>
              <p className="mt-4 text-lg font-semibold text-white/68">
                你的专属工具包
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E8521A]/40 bg-[#E8521A]/12 px-5 py-3 text-sm font-extrabold text-[#ff8a42]">
              <Lock className="size-4" />
              免费会员
            </div>
          </div>
        </div>
      </section>

      <ToolkitSection>
        <PrinciplesFramework />
      </ToolkitSection>

      <ToolkitSection alternate>
        <ToolkitHeading
          title="⚡ Prompt模板包"
          subtitle={`${promptTemplates.length}个中文Prompt模板，按主题复制使用`}
        />
        <PromptTemplatesSection />
      </ToolkitSection>

      <ToolkitSection>
        <ToolkitHeading
          title="🛠️ AI工具入门指南"
          subtitle={`${aiTools.length}个工具，分成5类，新手可以按需求选择`}
        />
        <AiToolGuide />
      </ToolkitSection>

      <ToolkitSection alternate>
        <ToolkitHeading
          title="✅ 超级个体每日清单"
          subtitle="每天5个习惯，30天变超级个体"
        />
        <DailyChecklist />
      </ToolkitSection>

      <section className="bg-[#E8521A] px-4 py-16 text-white md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-extrabold md:text-5xl">
            还没加入WhatsApp社群？
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-8 text-white/86 md:text-lg">
            每周AI工具分享、独家Prompt、真实案例
          </p>
          <a
            href={superindividualWhatsAppLink}
            className="mx-auto mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 text-base font-extrabold text-[#0F1923] transition hover:scale-[1.02] hover:bg-[#33e879] md:w-auto"
          >
            加入「超级个体实验室」
            <ArrowRight className="size-5" />
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#0F1923] px-4 py-10 text-center md:px-8">
        <p className="text-sm font-semibold text-white/58">
          这是你的专属链接，请勿分享
        </p>
        <Link
          href="/superindividual"
          className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[#ff8a42] transition hover:text-white"
        >
          <ArrowLeft className="size-4" />
          回到超级个体页面
        </Link>
      </footer>
    </main>
  )
}

function PromptTemplatesSection() {
  const categories = useMemo(
    () => Array.from(new Set(promptTemplates.map((template) => template.category))),
    []
  )
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "")
  const activeTemplates = promptTemplates.filter(
    (template) => template.category === activeCategory
  )

  return (
    <div className="mt-8">
      <div
        aria-label="Prompt模板主题"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7"
        role="tablist"
      >
        {categories.map((category) => {
          const isActive = category === activeCategory
          const templateCount = promptTemplates.filter(
            (template) => template.category === category
          ).length

          return (
            <button
              key={category}
              aria-selected={isActive}
              className={[
                "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border px-4 text-sm font-extrabold transition",
                isActive
                  ? "border-[#E8521A] bg-[#E8521A] text-white shadow-[0_16px_45px_rgba(232,82,26,0.24)]"
                  : "border-white/12 bg-[#0F1923] text-white/68 hover:border-[#E8521A]/70 hover:text-white",
              ].join(" ")}
              role="tab"
              type="button"
              onClick={() => setActiveCategory(category)}
            >
              {category}
              <span
                className={[
                  "grid min-w-6 place-items-center rounded-full px-2 py-0.5 text-xs",
                  isActive ? "bg-white/18" : "bg-white/8 text-white/50",
                ].join(" ")}
              >
                {templateCount}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 rounded-[30px] border border-white/10 bg-[#0F1923]/62 p-4 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ff8a42]">
              当前主题
            </p>
            <h3 className="mt-2 text-2xl font-extrabold md:text-3xl">
              {activeCategory}
            </h3>
          </div>
          <p className="text-sm font-bold text-white/52">
            {activeTemplates.length} 个模板
          </p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {activeTemplates.map((template) => (
            <PromptTemplateCard
              key={`${template.category}-${template.title}`}
              template={template}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function PrinciplesFramework() {
  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <ToolkitHeading
          title="📋 5个底层原则"
          subtitle="先把使用AI的判断标准放对，再让工具帮你加速"
        />
        <div className="rounded-full border border-[#E8521A]/30 bg-[#E8521A]/10 px-5 py-3 text-sm font-extrabold text-[#ff8a42]">
          从想清楚，到做出来
        </div>
      </div>

      <div className="relative mt-8">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-gradient-to-b from-[#E8521A]/0 via-[#E8521A]/40 to-[#E8521A]/0 md:block"
        />
        <div className="grid gap-5 md:grid-cols-2">
          {principles.map((principle, index) => (
            <PrincipleCard
              key={principle.number}
              featured={index === principles.length - 1}
              principle={principle}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function PrincipleCard({
  principle,
  featured,
}: {
  principle: (typeof principles)[number]
  featured?: boolean
}) {
  return (
    <article
      className={[
        "group relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0F1923] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-[#E8521A]/45 hover:shadow-[0_28px_90px_rgba(232,82,26,0.13)] md:p-7",
        featured ? "md:col-span-2" : "",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#E8521A] via-[#ff8a42] to-[#E8521A]/30"
      />
      <div
        aria-hidden="true"
        className="absolute right-[-70px] top-[-70px] size-44 rounded-full border border-[#E8521A]/16 transition group-hover:scale-110"
      />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-stretch">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="grid size-16 place-items-center rounded-2xl border border-[#E8521A]/35 bg-[#E8521A]/12 text-4xl font-black text-[#E8521A] shadow-[0_18px_44px_rgba(232,82,26,0.14)]">
              {principle.number}
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-extrabold text-white/52">
              原则
            </span>
          </div>
          <h3 className="mt-6 text-2xl font-extrabold md:text-3xl">
            {principle.title}
          </h3>
          <p className="mt-3 text-base leading-7 text-white/62">
            {principle.description}
          </p>
        </div>

        <div className="rounded-[24px] border border-[#E8521A]/24 bg-[#E8521A]/10 p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#ff8a42]">
            立刻试这个 Prompt
          </p>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/84">
            “{principle.prompt}”
          </p>
        </div>
      </div>
    </article>
  )
}

function PromptTemplateCard({
  template,
}: {
  template: (typeof promptTemplates)[number]
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(template.prompt)
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = template.prompt
      textArea.setAttribute("readonly", "")
      textArea.style.position = "fixed"
      textArea.style.left = "-9999px"
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }

    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <article
      className="rounded-[28px] border border-white/10 bg-[#0F1923] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.2)]"
      data-prompt-card
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="rounded-full bg-[#E8521A]/14 px-4 py-2 text-xs font-extrabold text-[#ff8a42]">
          {template.category}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-xs font-extrabold text-white transition hover:border-[#E8521A] hover:bg-[#E8521A]"
        >
          {copied ? (
            <>
              <Check className="size-4" />
              已复制 ✓
            </>
          ) : (
            <>
              <Copy className="size-4" />
              复制
            </>
          )}
        </button>
      </div>
      <h3 className="mt-5 text-2xl font-extrabold">{template.title}</h3>
      <pre className="mt-5 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-[#1E2A3A] p-4 text-sm leading-7 text-white/76">
        {template.prompt}
      </pre>
    </article>
  )
}

function AiToolGuide() {
  const categories = useMemo(
    () => Array.from(new Set(aiTools.map((tool) => tool.category))),
    []
  )

  return (
    <div className="mt-8 space-y-8">
      {categories.map((category) => {
        const tools = aiTools.filter((tool) => tool.category === category)

        return (
          <section
            key={category}
            className="rounded-[30px] border border-white/10 bg-[#0F1923]/54 p-4 md:p-6"
          >
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ff8a42]">
                  工具分类
                </p>
                <h3 className="mt-2 text-2xl font-extrabold md:text-3xl">
                  {category}
                </h3>
              </div>
              <p className="text-sm font-bold text-white/52">
                {tools.length} 个工具
              </p>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {tools.map((tool) => (
                <AiToolCard key={tool.name} tool={tool} />
              ))}
            </div>
          </section>
        )
      })}

      <div className="rounded-[30px] border border-[#E8521A]/35 bg-[#E8521A]/10 p-6 shadow-[0_22px_70px_rgba(232,82,26,0.12)]">
        <div className="flex items-start gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#E8521A] text-white shadow-[0_18px_46px_rgba(232,82,26,0.28)]">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-white">新手从这里开始</p>
            <p className="mt-3 text-sm leading-7 text-white/72">
              第一天用 ChatGPT 练习提问；第二天用 Perplexity 做资料搜集；
              第三天把资料放进 NotebookLM 整理；第四天试一个图像工具；
              第五天再选择 Notion AI、Gamma 或 Cursor 来连接你的真实工作流程。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AiToolCard({ tool }: { tool: (typeof aiTools)[number] }) {
  return (
    <article className="relative rounded-[28px] border border-white/10 bg-[#0F1923] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.2)]">
      {tool.badge ? (
        <div className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full border border-[#E8521A]/35 bg-[#E8521A]/14 px-3 py-1 text-[11px] font-extrabold text-[#ff8a42]">
          <Sparkles className="size-3" />
          {tool.badge}
        </div>
      ) : null}
      <div className="relative grid size-16 place-items-center overflow-hidden rounded-2xl border border-white/12 bg-white text-xl font-black text-[#E8521A] shadow-[0_18px_42px_rgba(0,0,0,0.25)]">
        <span aria-hidden="true">{tool.name.slice(0, 2)}</span>
        <Image
          alt={`${tool.name} logo`}
          className="absolute inset-0 size-full object-contain p-3"
          height={64}
          onError={(event) => {
            event.currentTarget.style.display = "none"
          }}
          src={tool.logoSrc}
          unoptimized
          width={64}
        />
      </div>
      <h4 className="mt-6 text-2xl font-extrabold">{tool.name}</h4>
      <p className="mt-3 text-base font-bold text-[#ff8a42]">
        强项：{tool.strength}
      </p>
      <div className="mt-5">
        <p className="text-sm font-extrabold text-white">最适合：</p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-white/64">
          {tool.bestFor.map((item) => (
            <li key={item} className="flex gap-2">
              <Check className="mt-1 size-4 shrink-0 text-[#E8521A]" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5 space-y-2 text-sm text-white/70">
        <p>免费版：{tool.free}</p>
        <p>付费版：{tool.paid}</p>
      </div>
      <a
        href={tool.href}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#E8521A]/45 px-5 text-sm font-extrabold text-white transition hover:bg-[#E8521A]"
      >
        注册链接
        <ExternalLink className="size-4" />
      </a>
    </article>
  )
}

function DailyChecklist() {
  const allItems = useMemo(
    () => checklistGroups.flatMap((group) => group.items),
    []
  )
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => new Set())
  const completedCount = checkedItems.size
  const progress = Math.round((completedCount / allItems.length) * 100)

  function toggleItem(item: string) {
    setCheckedItems((current) => {
      const next = new Set(current)
      if (next.has(item)) {
        next.delete(item)
      } else {
        next.add(item)
      }
      return next
    })
  }

  return (
    <div className="mt-8 overflow-hidden rounded-[34px] border border-white/10 bg-[#0F1923] shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(232,82,26,0.22),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ff8a42]">
              今日进度
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <p className="text-5xl font-black text-white md:text-6xl">
                {progress}%
              </p>
              <p className="pb-2 text-sm font-bold text-white/62">
                已完成 {completedCount} / {allItems.length}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCheckedItems(new Set())}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/12 px-5 text-sm font-extrabold text-white transition hover:border-[#E8521A] hover:bg-[#E8521A] md:w-auto"
          >
            <RotateCcw className="size-4" />
            重置今日清单
          </button>
        </div>
        <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#E8521A] to-[#ff9a4a] transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-2 md:p-8">
        {checklistGroups.map((group) => (
          <section
            key={group.title}
            className="rounded-[26px] border border-white/10 bg-[#162334] p-5"
          >
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-[#E8521A]/14 text-xl">
                {group.icon}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {group.title}
                </h3>
                <p className="mt-1 text-xs font-bold text-[#ff8a42]">
                  {group.focus}
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {group.items.map((item) => {
                const checked = checkedItems.has(item)
                return (
                  <label
                    key={item}
                    className={[
                      "group flex cursor-pointer gap-3 rounded-2xl border p-4 text-sm leading-6 transition",
                      checked
                        ? "border-[#E8521A]/45 bg-[#E8521A]/10 text-white/52"
                        : "border-white/10 bg-white/[0.045] text-white/76 hover:border-[#E8521A]/50 hover:bg-white/[0.065]",
                    ].join(" ")}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleItem(item)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={[
                        "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition",
                        checked
                          ? "border-[#E8521A] bg-[#E8521A] text-white"
                          : "border-white/22 bg-white/8 group-hover:border-[#E8521A]",
                      ].join(" ")}
                    >
                      {checked ? <Check className="size-3.5" strokeWidth={4} /> : null}
                    </span>
                    <span className={checked ? "line-through opacity-65" : ""}>
                      {item}
                    </span>
                  </label>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function ToolkitSection({
  children,
  alternate = false,
}: {
  children: ReactNode
  alternate?: boolean
}) {
  return (
    <section
      className={
        alternate
          ? "bg-[#223247] px-4 py-16 md:px-8 md:py-24"
          : "bg-[#1E2A3A] px-4 py-16 md:px-8 md:py-24"
      }
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

function ToolkitHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div>
      <h2 className="text-3xl font-extrabold tracking-normal text-white md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-base leading-7 text-white/60 md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}

function ToolkitBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="superindividual-grid absolute inset-0 opacity-45" />
      <div className="absolute right-[-120px] top-[-140px] size-[420px] rounded-full border border-[#E8521A]/20" />
      <div className="absolute bottom-[-160px] left-[-120px] size-[360px] rounded-full border border-white/10" />
    </div>
  )
}
