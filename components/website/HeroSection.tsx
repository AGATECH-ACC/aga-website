import {
  ArrowRight,
  MessageCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motionClasses } from "@/styles/motion"
import { websiteClasses } from "@/styles/tokens"

import { BilingualText, WebsiteContainer, type WebsiteText } from "./shared"

type HeroSectionProps = {
  title: WebsiteText
  accent: WebsiteText
  description: WebsiteText
  primaryAction?: WebsiteText
  secondaryAction?: WebsiteText
  visualNote?: string
  primaryActionHref?: string
  secondaryActionHref?: string
}

export function HeroSection({
  title,
  accent,
  description,
  primaryAction = { en: "Book demo" },
  secondaryAction = { en: "Contact on WhatsApp" },
  visualNote = "Premium system foundation for scalable business workflows.",
  primaryActionHref = "https://client.agaventures.ai/enquiry",
  secondaryActionHref = "https://wa.me/60183576003",
}: HeroSectionProps) {
  const locale = textContainsChinese(title) || textContainsChinese(accent) ? "zh" : "en"

  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      <WebsiteContainer className="relative grid min-h-[640px] items-stretch gap-8 py-10 min-[720px]:grid-cols-2 md:py-16">
        <div
          className={cn(
            "relative flex h-full flex-col justify-center gap-6 overflow-hidden rounded-[28px] border border-primary/40 bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/25 md:p-8",
            motionClasses.fadeUp
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(255,255,255,0.32),transparent_32%),linear-gradient(145deg,rgba(255,255,255,0.18),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-background/55 to-transparent" />
          <div className="relative inline-flex w-fit rounded-full border border-background/25 bg-background/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-sm">
            {locale === "zh" ? "AGA系统掌柜" : "AGA ONESYSTEM"}
          </div>
          <h1 className={cn(websiteClasses.h1, "max-w-3xl text-primary-foreground min-[720px]:text-5xl lg:text-6xl")}>
            <BilingualText text={title} />
            <span className="block text-background">
              <BilingualText text={accent} />
            </span>
          </h1>
          <p className="relative max-w-2xl text-base leading-7 text-primary-foreground/88 md:text-lg">
            <BilingualText text={description} />
          </p>
          <div className="relative flex flex-col items-start gap-3">
            <Button
              asChild
              size="lg"
              variant="primary"
              className="w-full bg-background text-foreground shadow-lg shadow-foreground/15 hover:bg-background/90 sm:w-fit"
            >
              <Link href={primaryActionHref}>
                <BilingualText text={primaryAction} />
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Link
              href={secondaryActionHref}
              className="inline-flex items-center gap-2 rounded-full border border-background/25 bg-background/15 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-background/25"
            >
              <BilingualText text={secondaryAction} />
              <span className="grid size-6 place-items-center rounded-full bg-background text-primary">
                <MessageCircle className="size-3.5" />
              </span>
            </Link>
          </div>
        </div>

        <HeroVisualScroller locale={locale} visualNote={visualNote} />
      </WebsiteContainer>
    </section>
  )
}

function textContainsChinese(text: WebsiteText) {
  const value = typeof text === "string" ? text : `${text.en} ${text.zh ?? ""}`
  return /[\u3400-\u9fff]/.test(value)
}

function HeroVisualScroller({
  locale,
}: {
  locale: "en" | "zh"
  visualNote: string
}) {
  const slides = testimonialSlides[locale]

  return (
    <div className="relative h-full overflow-hidden rounded-[28px]">
      <div className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {slides.map((slide, index) => (
            <div
              key={slide.name}
              className="min-h-[32rem] min-w-full snap-center overflow-hidden rounded-[28px] bg-foreground text-background shadow-xl min-[720px]:min-h-full"
            >
              <div className="relative flex h-full min-h-[32rem] flex-col justify-end overflow-hidden p-6 md:p-9">
                <Image
                  src={slide.image}
                  alt={slide.name}
                  fill
                  sizes="(min-width: 720px) 50vw, 100vw"
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,8,58,0.04)_0%,rgba(20,8,58,0.28)_45%,rgba(20,8,58,0.88)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_0%,rgba(232,82,26,0.24),transparent_26%),radial-gradient(circle_at_8%_100%,rgba(24,70,229,0.3),transparent_34%)] mix-blend-overlay" />

                <div className="relative z-10 max-w-2xl">
                  <div className="mb-7 inline-flex items-center gap-3 rounded-xl bg-background px-3 py-2 text-foreground shadow-lg">
                    <span className="grid size-10 place-items-center rounded-lg bg-primary text-sm font-black text-primary-foreground">
                      A
                    </span>
                    <span className="text-sm font-semibold">AGA</span>
                  </div>
                  <p className="text-3xl font-semibold italic leading-tight tracking-normal text-background drop-shadow-lg md:text-5xl">
                    &ldquo;{slide.quote}&rdquo;
                  </p>
                  <p className="mt-7 text-lg font-semibold text-background md:text-2xl">
                    — {slide.name}
                  </p>
                  <p className="mt-2 text-sm font-medium text-background/75 md:text-base">
                    {slide.meta}
                  </p>
                </div>

                <div className="relative z-10 mt-8 flex justify-center gap-4">
                  {slides.map((item, dotIndex) => (
                    <span
                      key={item.name}
                      className={cn(
                        "size-2.5 rounded-full bg-background/45",
                        dotIndex === index && "size-4 bg-background"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>
  )
}

const testimonialSlides = {
  en: [
    {
      kind: "testimonial",
      image: "/assets/aga-hero-1.png",
      quote: "5 days of closing. Now done before lunch.",
      name: "Rachel Tan",
      meta: "Primeway Trading · KL",
    },
    {
      kind: "testimonial",
      image: "/assets/aga-hero-2.png",
      quote: "Leads don't fall through anymore. The system chases for me.",
      name: "Danny Chong",
      meta: "Sales Director · F&B · 8 Outlets",
    },
    {
      kind: "testimonial",
      image: "/assets/aga-hero-3.png",
      quote: "I stopped being the bottleneck. Finally.",
      name: "Alan Wong",
      meta: "Founder · Vivo Retail · PJ",
    },
    {
      kind: "testimonial",
      image: "/assets/aga-hero-4.png",
      quote: "Staff stopped asking. The answer is already in the system.",
      name: "Mei Lim",
      meta: "Brightstar Learning · 3 Campuses",
    },
    {
      kind: "testimonial",
      image: "/assets/aga-hero-5.png",
      quote: "I was at KLIA. Business ran itself. That was new.",
      name: "Jason Lee",
      meta: "MD · SwiftMove Logistics · Shah Alam",
    },
  ],
  zh: [
    {
      kind: "testimonial",
      image: "/assets/aga-hero-1.png",
      quote: "结账以前要5天。现在午饭前就搞定了。",
      name: "陈慧玲",
      meta: "Primeway Trading · 吉隆坡",
    },
    {
      kind: "testimonial",
      image: "/assets/aga-hero-2.png",
      quote: "客户不再漏掉了。系统自动跟进，我不用再追。",
      name: "钟伟明",
      meta: "销售总监 · 餐饮集团 · 8家分店",
    },
    {
      kind: "testimonial",
      image: "/assets/aga-hero-3.png",
      quote: "我不再是那个卡住所有事情的人了。终于。",
      name: "黄建文",
      meta: "创办人 · Vivo Retail · 八打灵再也",
    },
    {
      kind: "testimonial",
      image: "/assets/aga-hero-4.png",
      quote: "员工不再来问我同样的问题了。答案已经在系统里。",
      name: "林美玲",
      meta: "Brightstar Learning · 3个校区",
    },
    {
      kind: "testimonial",
      image: "/assets/aga-hero-5.png",
      quote: "我在吉隆坡国际机场。生意自己在跑。这是第一次。",
      name: "李俊豪",
      meta: "董事总经理 · SwiftMove Logistics · 莎阿南",
    },
  ],
} as const
