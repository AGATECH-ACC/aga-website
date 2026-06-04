import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Hammer,
  Lightbulb,
  MessageSquareText,
  Zap,
} from "lucide-react"

import { ScrollReveal, SuperindividualSignupForm } from "@/components/superindividual"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "成为超级个体的第一步 | AGA Ventures",
  description:
    "想到，做到，一瞬间。加入超级个体实验室，获得免费AI工具包和Prompt模板。",
  alternates: {
    canonical: "/superindividual",
  },
  openGraph: {
    title: "成为超级个体的第一步 | AGA Ventures",
    description:
      "想到，做到，一瞬间。加入超级个体实验室，获得免费AI工具包和Prompt模板。",
    url: "/superindividual",
    type: "website",
  },
}

const principles = [
  {
    number: "①",
    title: "迭代优先于完美",
    description: "先出再调，用结果引导方向",
  },
  {
    number: "②",
    title: "先问\"我要什么\"",
    description: "输入模糊，输出一定模糊",
  },
  {
    number: "③",
    title: "拆步骤，不要一步登天",
    description: "流程化，才知道哪里出问题",
  },
  {
    number: "④",
    title: "知道何时不能出错",
    description: "探索用AI，执行用Workflow",
  },
  {
    number: "⑤",
    title: "了解你的伙伴",
    description: "用对工具，比一直叫它改更有效",
  },
]

const toolkit = [
  { icon: ClipboardList, title: "5个底层原则卡片" },
  { icon: Zap, title: "Prompt模板包" },
  { icon: Hammer, title: "AI工具入门指南" },
  { icon: CheckCircle2, title: "超级个体每日清单" },
]

const communityBenefits = [
  "每周AI工具和技巧分享",
  "独家Prompt模板和资源",
  "真实案例和学员故事",
]

export default function SuperindividualPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#071421] text-white">
      <HeroSection />
      <QuoteSection />
      <PrinciplesSection />
      <ToolkitSection />
      <AboutSection />
      <CommunitySection />
      <SimpleFooter />
    </main>
  )
}

function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[76svh] items-center overflow-hidden border-b border-white/10 bg-[#071421] px-4 py-12 md:px-8 md:py-20">
      <GeometricPattern />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#071421] to-transparent" />
      <ScrollReveal className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        <Link
          href="/"
          className="mb-14 inline-flex items-center gap-3 text-[#f59a23] transition hover:text-[#ffbd63]"
          aria-label="AGA Ventures home"
        >
          <span className="grid size-11 place-items-center rounded-full bg-[#f59a23] text-lg font-black text-[#071421]">
            A
          </span>
          <span className="text-3xl font-black tracking-normal">AGA</span>
        </Link>
        <h1 className="max-w-5xl text-5xl font-semibold leading-[1.05] tracking-normal text-white md:text-7xl">
          成为超级个体的第一步
        </h1>
        <p className="mt-7 text-2xl font-semibold leading-tight text-[#f7c36d] md:text-4xl">
          想到，做到，一瞬间
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
          有对的思维 + 对的工具 = 无所不能
        </p>
        <a
          href="#toolkit"
          className="mt-10 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#f59a23] px-7 text-base font-bold text-[#071421] transition hover:-translate-y-0.5 hover:bg-[#ffb24a] hover:shadow-2xl hover:shadow-[#f59a23]/20"
        >
          加入超级个体社群
          <ArrowRight className="size-4" />
        </a>
      </ScrollReveal>
    </section>
  )
}

function QuoteSection() {
  return (
    <section className="bg-[#071421] px-4 py-12 md:px-8 md:py-16">
      <ScrollReveal className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-semibold tracking-normal text-white md:text-5xl">
          什么是超级个体？
        </h2>
        <blockquote className="mt-10 text-2xl font-semibold leading-relaxed text-white md:text-4xl md:leading-relaxed">
          超级个体只有一个标准——
          <br />
          想到，做到，一瞬间。
        </blockquote>
        <p className="mx-auto mt-8 max-w-3xl whitespace-pre-line text-lg leading-9 text-white/68 md:text-xl">
          {`不是因为有钱，有团队，有资源。
是因为有正确的思维 + 正确的工具。`}
        </p>
      </ScrollReveal>
    </section>
  )
}

function PrinciplesSection() {
  return (
    <section className="bg-[#0a1928] px-4 py-20 md:px-8 md:py-28">
      <ScrollReveal className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-normal text-white md:text-5xl">
            我用AI的5个底层原则
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/62">
            先成为一个清晰的人，AI才能帮你做清晰的事
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {principles.map((principle, index) => (
            <article
              key={principle.number}
              className={cn(
                "rounded-[24px] border border-white/10 border-l-[#f59a23] border-l-4 bg-[#071421] p-7 shadow-xl shadow-black/15 transition hover:-translate-y-1 hover:border-[#f59a23]/50",
                index === 4 && "md:col-span-2 md:mx-auto md:w-[calc(50%-0.625rem)]"
              )}
            >
              <div className="text-4xl font-black leading-none text-[#f59a23]">
                {principle.number}
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-normal text-white">
                {principle.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-white/58">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </ScrollReveal>
    </section>
  )
}

function ToolkitSection() {
  return (
    <section id="toolkit" className="bg-[#071421] px-4 py-20 md:px-8 md:py-28">
      <ScrollReveal className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-normal text-white md:text-5xl">
            免费AI工具包
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/62">
            加入社群，马上获得以下资源
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {toolkit.map((item) => {
            const Icon = item.icon
            return (
              <article
                key={item.title}
                className="flex min-h-36 flex-col justify-between rounded-[22px] border border-white/10 bg-white/[0.055] p-5 transition hover:-translate-y-1 hover:border-[#f59a23]/50 hover:bg-[#f59a23]/10"
              >
                <Icon className="size-7 text-[#f59a23]" />
                <h3 className="mt-8 text-lg font-semibold leading-snug text-white">
                  {item.title}
                </h3>
              </article>
            )
          })}
        </div>
        <SuperindividualSignupForm />
      </ScrollReveal>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="bg-[#f7f5ef] px-4 py-20 text-[#071421] md:px-8 md:py-28">
      <ScrollReveal className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="relative min-h-[360px] overflow-hidden rounded-[28px] bg-[#071421] p-6 shadow-2xl shadow-[#071421]/15">
          <div className="absolute inset-0 opacity-70">
            <GeometricPattern />
          </div>
          <div className="relative flex h-full min-h-[312px] flex-col justify-end rounded-[22px] border border-white/12 bg-gradient-to-br from-white/10 to-transparent p-7">
            <div className="grid size-24 place-items-center rounded-full bg-[#f59a23] text-4xl font-black text-[#071421]">
              TC
            </div>
            <p className="mt-6 text-xl font-semibold text-white">
              Tan Chi Shiong
            </p>
            <p className="mt-2 text-sm text-white/58">Founder, AGA Ventures</p>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-semibold tracking-normal md:text-5xl">
            为什么是我？
          </h2>
          <div className="mt-7 space-y-5 text-lg leading-9 text-[#071421]/72">
            <p>我是 Tan Chi Shiong，AGA Ventures 创办人。</p>
            <p>我相信每一个人都可以成为超级个体。</p>
            <p>
              不是因为天赋，不是因为资源。
              <br />
              是因为思维 + 工具 + 系统。
            </p>
            <p>
              我用这套方法，在一个星期内从一个想法，
              <br />
              到站上台分享，拿到满分，
              <br />
              再到创办这个社群。
            </p>
            <p>这就是超级个体的力量。</p>
          </div>
          <Link
            href="/about"
            className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#f59a23] px-7 text-base font-bold text-[#071421] transition hover:-translate-y-0.5 hover:bg-[#ffb24a]"
          >
            了解AGA Ventures
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </ScrollReveal>
    </section>
  )
}

function CommunitySection() {
  return (
    <section className="bg-[#0a1928] px-4 py-20 md:px-8 md:py-28">
      <ScrollReveal className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-semibold tracking-normal text-white md:text-5xl">
          加入超级个体实验室
        </h2>
        <p className="mt-5 text-lg leading-8 text-white/62">
          和一群想要突破的人一起成长
        </p>
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 text-left md:grid-cols-3">
          {communityBenefits.map((benefit) => (
            <div
              key={benefit}
              className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/[0.055] p-5"
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#f59a23]" />
              <p className="text-base font-medium leading-7 text-white/78">
                {benefit}
              </p>
            </div>
          ))}
        </div>
        <a
          href="#"
          className="mt-10 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#f59a23] px-7 text-base font-bold text-[#071421] transition hover:-translate-y-0.5 hover:bg-[#ffb24a] md:w-auto md:min-w-80"
        >
          加入WhatsApp社群
          <ArrowRight className="size-4" />
        </a>
      </ScrollReveal>
    </section>
  )
}

function SimpleFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#071421] px-4 py-10 text-white md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 text-sm text-white/58 md:flex-row md:items-center md:justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-[#f59a23] transition hover:text-[#ffbd63]"
          aria-label="AGA Ventures home"
        >
          <span className="grid size-10 place-items-center rounded-full bg-[#f59a23] font-black text-[#071421]">
            A
          </span>
          <span className="text-2xl font-black tracking-normal">AGA Ventures</span>
        </Link>
        <p>agaventures.ai</p>
        <p>© 2025 AGA Ventures Sdn. Bhd.</p>
      </div>
    </footer>
  )
}

function GeometricPattern() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(245,154,35,0.08)_1px,transparent_1px),linear-gradient(30deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute left-1/2 top-16 size-[520px] -translate-x-1/2 rounded-full border border-[#f59a23]/12" />
      <div className="absolute right-[-120px] top-24 size-[340px] rotate-45 border border-white/10" />
      <div className="absolute bottom-[-120px] left-[-80px] size-[300px] rounded-full border border-[#f59a23]/10" />
      <Lightbulb className="absolute bottom-28 right-[12%] size-10 text-[#f59a23]/20" />
      <MessageSquareText className="absolute left-[10%] top-32 size-10 text-white/12" />
    </div>
  )
}
