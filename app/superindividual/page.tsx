import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import type { CSSProperties } from "react"
import {
  ArrowRight,
  BriefcaseBusiness,
  Camera,
  Check,
  Mail,
  MessageCircle,
} from "lucide-react"

import {
  ScrollProgress,
  ScrollReveal,
  SuperindividualSignupForm,
} from "@/components/superindividual"
import { superindividualWhatsAppLink } from "@/lib/superindividual/constants"

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

const colors = {
  navy: "#1E2A3A",
  orange: "#E8521A",
  white: "#FFFFFF",
  card: "#0F1923",
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
  {
    icon: "📋",
    title: "5个底层原则卡片",
    description: "把判断标准放在手边，每次使用AI前快速校准。",
  },
  {
    icon: "⚡",
    title: "Prompt模板包",
    description: "直接套用高频场景模板，让输出更快进入状态。",
  },
  {
    icon: "🛠️",
    title: "AI工具入门指南",
    description: "知道每个工具适合做什么，少走试错弯路。",
  },
  {
    icon: "✅",
    title: "超级个体每日清单",
    description: "每天用一张清单，把想到的事推进到做到。",
  },
]

const communityBenefits = [
  "每周AI工具和技巧分享",
  "独家Prompt模板和资源",
  "真实案例和学员故事",
]

export default function SuperindividualPage() {
  return (
    <main
      className="superindividual-page min-h-screen overflow-hidden text-white"
      style={
        {
          "--si-navy": colors.navy,
          "--si-orange": colors.orange,
          "--si-white": colors.white,
          "--si-card": colors.card,
        } as CSSProperties
      }
    >
      <ScrollProgress />
      <SuperindividualNav />
      <HeroSection />
      <QuoteSection />
      <PrinciplesSection />
      <ToolkitSection />
      <AboutSection />
      <CommunitySection />
      <SimpleFooter />
      <FloatingWhatsApp />
    </main>
  )
}

function SuperindividualNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#1E2A3A]/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="text-2xl font-black tracking-normal text-white transition hover:text-[#E8521A]"
          aria-label="AGA Ventures home"
        >
          AGA
        </Link>
        <div className="flex items-center gap-3 text-xs font-bold text-white/76 md:gap-8 md:text-sm">
          <a className="transition hover:text-[#E8521A]" href="#principles">
            原则
          </a>
          <a className="transition hover:text-[#E8521A]" href="#toolkit">
            工具包
          </a>
          <a className="transition hover:text-[#E8521A]" href="#community">
            社群
          </a>
        </div>
        <a
          href="#toolkit"
          className="hidden rounded-full border border-[#E8521A]/50 px-5 py-2.5 text-sm font-extrabold text-white transition hover:scale-105 hover:bg-[#E8521A] md:inline-flex"
        >
          获取工具包
        </a>
      </nav>
    </header>
  )
}

function HeroSection() {
  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden bg-[#1E2A3A] px-4 pb-24 pt-28 md:px-8">
      <HeroBackground />
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#223247] via-[#1E2A3A]/82 to-transparent" />
      <ScrollReveal className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        <h1 className="max-w-6xl text-5xl font-extrabold leading-[0.98] tracking-normal text-white md:text-7xl lg:text-8xl">
          成为超级个体的第一步
        </h1>
        <p className="mt-8 text-3xl font-extrabold leading-tight text-[#E8521A] md:text-5xl">
          想到，做到，一瞬间
        </p>
        <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-white md:text-xl">
          有对的思维 + 对的工具 = 无所不能
        </p>
        <a
          href="#toolkit"
          className="mt-10 inline-flex min-h-16 items-center justify-center gap-3 rounded-full bg-[#E8521A] px-9 text-lg font-extrabold text-white shadow-[0_22px_70px_rgba(232,82,26,0.38)] transition duration-200 hover:scale-105 hover:bg-[#ff6a2a] hover:shadow-[0_28px_86px_rgba(232,82,26,0.5)]"
        >
          加入超级个体社群
          <ArrowRight className="size-5" />
        </a>
      </ScrollReveal>
    </section>
  )
}

function QuoteSection() {
  return (
    <section className="relative bg-[#223247] px-4 py-20 md:px-8 md:py-28">
      <ScrollReveal className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-extrabold tracking-normal text-white md:text-4xl">
          什么是超级个体？
        </h2>
        <div className="relative mt-12 overflow-hidden rounded-[34px] border border-white/12 border-l-4 border-l-[#E8521A] bg-[#1E2A3A]/76 p-7 shadow-[0_26px_90px_rgba(0,0,0,0.24)] md:p-12">
          <span className="absolute left-6 top-2 text-8xl font-black leading-none text-[#E8521A]/35 md:left-10 md:top-4">
            “
          </span>
          <blockquote className="relative z-10 text-2xl font-extrabold leading-relaxed text-white md:text-4xl md:leading-relaxed">
            超级个体只有一个标准——
            <br />
            想到，做到，一瞬间。
          </blockquote>
          <p className="relative z-10 mt-8 max-w-3xl whitespace-pre-line text-base leading-8 text-white/68 md:text-lg">
            {`不是因为有钱，有团队，有资源。
是因为有正确的思维 + 正确的工具。`}
          </p>
          <span className="absolute bottom-0 right-8 text-8xl font-black leading-none text-[#E8521A]/25 md:right-12">
            ”
          </span>
        </div>
      </ScrollReveal>
    </section>
  )
}

function PrinciplesSection() {
  return (
    <section
      id="principles"
      className="relative scroll-mt-24 bg-[#1E2A3A] px-4 py-20 md:px-8 md:py-28"
    >
      <SectionDivider />
      <ScrollReveal className="mx-auto flex max-w-6xl flex-col gap-12">
        <SectionHeading
          title="我用AI的5个底层原则"
          subtitle="先成为一个清晰的人，AI才能帮你做清晰的事"
        />
        <div className="grid gap-6 md:grid-cols-2">
          {principles.map((principle) => (
            <article
              key={principle.number}
              className="group relative overflow-hidden rounded-[28px] border border-white/10 border-l-4 border-l-[#E8521A] bg-[#0F1923] p-7 shadow-[0_22px_70px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-2 hover:border-[#E8521A]/70 hover:shadow-[0_30px_90px_rgba(0,0,0,0.3),0_0_42px_rgba(232,82,26,0.22)]"
            >
              <div className="absolute right-0 top-0 size-32 rounded-bl-full bg-[#E8521A]/[0.06] transition group-hover:bg-[#E8521A]/[0.11]" />
              <div className="relative text-6xl font-black leading-none text-[#E8521A]">
                {principle.number}
              </div>
              <h3 className="relative mt-7 text-2xl font-extrabold tracking-normal text-white">
                {principle.title}
              </h3>
              <p className="relative mt-4 text-base leading-8 text-white/58 md:text-lg">
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
    <section
      id="toolkit"
      className="relative scroll-mt-24 bg-[#223247] px-4 py-20 md:px-8 md:py-28"
    >
      <ScrollReveal className="mx-auto flex max-w-6xl flex-col gap-12">
        <SectionHeading
          title="免费AI工具包"
          subtitle="加入社群，马上获得以下资源"
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {toolkit.map((item) => (
            <article
              key={item.title}
              className="group min-h-56 rounded-[28px] border border-white/12 bg-[#0F1923]/86 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-2 hover:border-[#E8521A]/60 hover:bg-[#0F1923] hover:shadow-[0_26px_80px_rgba(0,0,0,0.28),0_0_36px_rgba(232,82,26,0.18)]"
            >
              <div className="grid size-14 place-items-center rounded-2xl border border-[#E8521A]/25 bg-[#E8521A]/10 text-3xl transition group-hover:scale-110 group-hover:border-[#E8521A]/60">
                {item.icon}
              </div>
              <h3 className="mt-7 text-xl font-extrabold leading-snug text-white">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/58">
                {item.description}
              </p>
            </article>
          ))}
        </div>
        <SuperindividualSignupForm />
      </ScrollReveal>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="bg-white px-4 py-20 text-[#1E2A3A] md:px-8 md:py-28">
      <ScrollReveal className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div className="flex justify-center lg:justify-start">
          <div className="relative h-[25rem] w-72 md:h-[34rem] md:w-96">
            <Image
              src="/assets/tan-chi-shiong-profile-transparent.png"
              alt="Tan Chi Shiong, AGA Ventures 创办人"
              fill
              sizes="(min-width: 768px) 384px, 288px"
              className="object-contain object-bottom"
              priority={false}
            />
          </div>
        </div>
        <div className="relative text-left">
          <div className="mb-6 h-1 w-20 rounded-full bg-[#E8521A] lg:absolute lg:-left-5 lg:top-2 lg:mb-0 lg:h-28 lg:w-1" />
          <h2 className="text-3xl font-extrabold tracking-normal md:text-4xl">
            为什么是我？
          </h2>
          <div className="mt-8 space-y-5 text-base leading-8 text-[#1E2A3A]/76 md:text-lg md:leading-9">
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
            <p className="font-extrabold text-[#1E2A3A]">
              这就是超级个体的力量。
            </p>
          </div>
          <Link
            href="/about"
            className="mt-9 inline-flex min-h-14 items-center justify-center gap-2 rounded-full border-2 border-[#E8521A] bg-transparent px-7 text-base font-extrabold text-[#E8521A] transition hover:scale-[1.025] hover:bg-[#E8521A] hover:text-white"
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
    <section
      id="community"
      className="relative scroll-mt-24 overflow-hidden bg-[#0F1923] px-4 py-20 md:px-8 md:py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,82,26,0.16),transparent_36%)]" />
      <ScrollReveal className="relative mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-extrabold tracking-normal text-white md:text-5xl">
          加入超级个体实验室
        </h2>
        <p className="mt-5 text-base leading-8 text-white/64 md:text-lg">
          和一群想要突破的人一起成长
        </p>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 text-left md:grid-cols-3">
          {communityBenefits.map((benefit) => (
            <div
              key={benefit}
              className="flex items-start gap-3 rounded-[24px] border border-white/10 bg-white/[0.055] p-5"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#E8521A] text-white">
                <Check className="size-4" strokeWidth={3} />
              </span>
              <p className="text-base font-bold leading-7 text-white">
                {benefit}
              </p>
            </div>
          ))}
        </div>
        <a
          href={superindividualWhatsAppLink}
          className="mx-auto mt-10 inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 text-lg font-extrabold text-[#0F1923] shadow-[0_24px_70px_rgba(37,211,102,0.25)] transition hover:scale-[1.025] hover:bg-[#33e879] md:w-auto md:min-w-96"
        >
          <MessageCircle className="size-6" />
          加入WhatsApp社群
          <ArrowRight className="size-5" />
        </a>
        <p className="mt-5 text-sm font-bold text-white/56">
          已有 XX 位超级个体加入
        </p>
      </ScrollReveal>
    </section>
  )
}

function SimpleFooter() {
  const socialLinks = [
    { label: "Email", icon: Mail, href: "mailto:enquiry@agaventures.ai" },
    { label: "LinkedIn", icon: BriefcaseBusiness, href: "#" },
    { label: "Instagram", icon: Camera, href: "#" },
  ]

  return (
    <footer className="border-t border-white/10 bg-[#1E2A3A] px-4 py-12 text-white md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-7 text-center">
        <Link
          href="/"
          className="text-3xl font-black tracking-normal text-white transition hover:text-[#E8521A]"
          aria-label="AGA Ventures home"
        >
          AGA
        </Link>
        <div>
          <p className="text-lg font-extrabold">超级个体实验室</p>
          <p className="mt-1 text-sm text-white/58">agaventures.ai</p>
        </div>
        <div className="flex gap-3">
          {socialLinks.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className="grid size-11 place-items-center rounded-full border border-white/14 text-white/70 transition hover:border-[#E8521A] hover:bg-[#E8521A] hover:text-white"
              >
                <Icon className="size-5" />
              </a>
            )
          })}
        </div>
        <p className="text-sm text-white/52">© 2025 AGA Ventures Sdn. Bhd.</p>
      </div>
    </footer>
  )
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-3xl font-extrabold tracking-normal text-white md:text-4xl">
        {title}
      </h2>
      <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-[#E8521A] to-transparent" />
      <p className="mt-5 text-base leading-8 text-white/62 md:text-lg">
        {subtitle}
      </p>
    </div>
  )
}

function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E8521A]/70 to-transparent"
    />
  )
}

function FloatingWhatsApp() {
  return (
    <a
      href={superindividualWhatsAppLink}
      aria-label="加入WhatsApp社群"
      className="fixed bottom-4 right-4 z-40 grid size-12 place-items-center rounded-full bg-[#25D366] text-[#0F1923] shadow-[0_18px_50px_rgba(37,211,102,0.35)] transition hover:scale-110 hover:bg-[#33e879] md:bottom-7 md:right-7 md:size-16"
    >
      <MessageCircle className="size-6 md:size-7" />
    </a>
  )
}

function HeroBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="superindividual-grid absolute inset-0 opacity-60" />
      <div className="superindividual-particles absolute inset-0" />
      <div className="absolute left-1/2 top-1/2 size-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#E8521A]/18" />
      <div className="absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8" />
      <div className="absolute right-[-90px] top-28 size-[360px] rotate-45 border border-white/10" />
      <div className="absolute bottom-20 left-[-110px] size-[310px] rounded-full border border-[#E8521A]/12" />
      <div className="absolute left-[8%] top-[24%] size-2 rounded-full bg-[#E8521A] shadow-[0_0_22px_rgba(232,82,26,0.8)]" />
      <div className="absolute right-[18%] top-[32%] size-1.5 rounded-full bg-white/55" />
      <div className="absolute bottom-[27%] right-[12%] size-2 rounded-full bg-[#E8521A]/75 shadow-[0_0_22px_rgba(232,82,26,0.7)]" />
    </div>
  )
}
