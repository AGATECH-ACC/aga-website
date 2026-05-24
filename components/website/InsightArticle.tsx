"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import type { CmsInsight } from "@/lib/cms/types"
import { cn } from "@/lib/utils"
import { websiteClasses as wc } from "@/styles/tokens"

type InsightArticleProps = {
  insight: CmsInsight
  related: CmsInsight[]
  locale: "en" | "zh"
}

const fallbackImage = "/assets/aga-hero-1.png"
const brandOrange = "#E8521A"

function formatDate(value: string | null, locale: "en" | "zh") {
  if (!value) return "-"

  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en", {
    dateStyle: "medium",
  }).format(new Date(value))
}

function headingId(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u3400-\u9fff\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function extractToc(markdown: string) {
  return Array.from(markdown.matchAll(/^##\s+(.+)$/gm)).map((match) => {
    const title = match[1].trim()
    return { id: headingId(title), title }
  })
}

export function InsightArticle({ insight, related, locale }: InsightArticleProps) {
  const [activeId, setActiveId] = useState("")
  const body = insight.body || insight.summary
  const toc = useMemo(() => extractToc(body), [body])
  const labels =
    locale === "zh"
      ? {
          contents: "目录",
          authorBio: "作者简介",
          related: "相关文章",
          faq: "常见问题",
          ready: "准备系统化你的业务？",
          subheading: "预约一次免费的 30 分钟诊断，带走清晰的行动计划。",
          cta: "预约免费诊断",
          authorTitle: "创办人，AGA Ventures",
          authorDefaultTitle: "执行董事，AGA Ventures",
          authorBioText:
            "Tan Chi Shiong 是 AGA Ventures 的创办人，也是认证企业系统化架构师，拥有 10+ 年协助马来西亚 SME 扩张的经验。",
          read: "阅读",
        }
      : {
          contents: "Table of contents",
          authorBio: "Author",
          related: "Related articles",
          faq: "FAQ",
          ready: "Ready to systemize your business?",
          subheading: "Book a free 30-min diagnosis. Walk away with a clear action plan.",
          cta: "Book Free Diagnosis",
          authorTitle: "Founder, AGA Ventures",
          authorDefaultTitle: "Executive Director, AGA Ventures",
          authorBioText:
            "Tan Chi Shiong is the founder of AGA Ventures and a certified business systemization architect with 10+ years helping Malaysian SMEs scale.",
          read: "Read",
        }

  useEffect(() => {
    if (!toc.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible?.target.id) setActiveId(visible.target.id)
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0.1 }
    )

    toc.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [toc])

  return (
    <article className="bg-background text-foreground">
      <section className="w-full">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={insight.coverImage || fallbackImage}
            alt={insight.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className={cn(wc.container, "pb-12")}>
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            {insight.category ? (
              <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white" style={{ backgroundColor: brandOrange }}>
                {insight.category}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4" />
              {insight.readingTimeMinutes ?? 1} min read
            </span>
            <span className="text-sm text-muted-foreground">{formatDate(insight.publishedAt ?? insight.updatedAt, locale)}</span>
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-normal md:text-6xl">
            {insight.title}
          </h1>
          {insight.summary ? (
            <p className="mt-5 text-lg leading-8 text-muted-foreground md:text-xl">
              {insight.summary}
            </p>
          ) : null}
          <div className="mt-8 flex items-center gap-3 border-t pt-6">
            <div className="relative size-10 overflow-hidden rounded-full bg-muted">
              <Image src={insight.authorImage || fallbackImage} alt={insight.authorName || "AGA"} fill sizes="40px" className="object-cover" />
            </div>
            <div>
              <p className="font-semibold">{insight.authorName || "Tan Chi Shiong"}</p>
              <p className="text-sm text-muted-foreground">
                {locale === "zh" ? labels.authorDefaultTitle : insight.authorTitle || labels.authorDefaultTitle} · {formatDate(insight.publishedAt ?? insight.updatedAt, locale)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={cn(wc.container, "grid gap-10 pb-16 lg:grid-cols-[1fr_17rem]")}>
        <div className="mx-auto w-full max-w-[680px]">
          <MarkdownBody body={body} />
        </div>

        {toc.length ? (
          <aside className="hidden h-fit rounded-2xl border bg-muted/20 p-4 lg:sticky lg:top-24 lg:block">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {labels.contents}
            </p>
            <nav className="mt-4 grid gap-2">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-background hover:text-primary",
                    activeId === item.id && "bg-background text-primary shadow-sm"
                  )}
                  onClick={(event) => {
                    event.preventDefault()
                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </aside>
        ) : <div className="hidden lg:block" />}
      </section>

      {insight.faqEn.length || insight.faqZh.length ? (
        <section className={cn(wc.container, "pb-16")}>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-normal">{labels.faq}</h2>
            <div className="mt-5 grid gap-3">
              {(locale === "zh" ? insight.faqZh.length ? insight.faqZh : insight.faqEn : insight.faqEn).map((item, index) => (
                <details key={`${item.question}-${index}`} className="rounded-2xl border bg-background p-5 shadow-sm">
                  <summary className="cursor-pointer text-base font-semibold">{item.question}</summary>
                  <p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={cn(wc.container, "pb-16")}>
        <div className="mx-auto flex max-w-3xl gap-5 rounded-[28px] border bg-muted/20 p-6 shadow-sm">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-muted">
            <Image src={insight.authorImage || fallbackImage} alt={insight.authorName || "Tan Chi Shiong"} fill sizes="80px" className="object-cover" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">{labels.authorBio}</p>
            <h2 className="mt-2 text-xl font-bold">{insight.authorName || "Tan Chi Shiong"}</h2>
            <p className="text-sm text-muted-foreground">{locale === "zh" ? labels.authorTitle : insight.authorTitle || labels.authorTitle}</p>
            <p className="mt-3 line-clamp-2 leading-7 text-muted-foreground">
              {labels.authorBioText}
            </p>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className={cn(wc.container, "pb-16")}>
          <h2 className="text-3xl font-bold tracking-normal">{labels.related}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.id} href={`/${locale}/insights/${item.slug}`} className="group overflow-hidden rounded-2xl border bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-video bg-muted">
                  <Image src={item.coverImage || fallbackImage} alt={item.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                </div>
                <div className="grid gap-3 p-4">
                  {item.category ? <span className="w-fit rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{item.category}</span> : null}
                  <h3 className="line-clamp-2 text-lg font-semibold tracking-normal group-hover:text-primary">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.readingTimeMinutes ?? 1} min read</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className={cn(wc.container, "pb-20")}>
        <div className="rounded-[28px] bg-system p-8 text-system-foreground shadow-xl md:p-12">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-normal md:text-5xl">{labels.ready}</h2>
              <p className="mt-3 max-w-2xl text-base text-system-foreground/75 md:text-lg">{labels.subheading}</p>
            </div>
            <Button asChild size="lg" variant="primary" className="bg-primary text-primary-foreground">
              <Link href="https://client.agaventures.ai/enquiry">
                {labels.cta} <span aria-hidden="true">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </article>
  )
}

function MarkdownBody({ body }: { body: string }) {
  return (
    <div className="insight-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2({ children }) {
            const text = String(children)
            return (
              <h2 id={headingId(text)} className="mt-14 border-t pt-8 text-3xl font-bold leading-tight tracking-normal first:mt-0 first:border-t-0 first:pt-0">
                {children}
              </h2>
            )
          },
          h3({ children }) {
            return <h3 className="mt-8 text-2xl font-medium leading-snug tracking-normal">{children}</h3>
          },
          p({ children }) {
            return <p className="mt-5 text-base leading-8 text-muted-foreground">{children}</p>
          },
          blockquote({ children }) {
            return (
              <blockquote className="mt-7 border-l-[3px] pl-5 text-lg italic leading-8 text-foreground [&_p]:mt-0 [&_p]:text-lg [&_p]:text-foreground" style={{ borderColor: brandOrange }}>
                {children}
              </blockquote>
            )
          },
          table({ children }) {
            return (
              <div className="mt-7 overflow-x-auto rounded-2xl border">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            )
          },
          thead({ children }) {
            return <thead className="bg-[#1E2A3A] text-white">{children}</thead>
          },
          th({ children }) {
            return <th className="border border-[#1E2A3A]/20 px-4 py-3 text-left font-semibold">{children}</th>
          },
          td({ children }) {
            return <td className="border px-4 py-3 align-top">{children}</td>
          },
          tr({ children }) {
            return <tr className="even:bg-muted/30">{children}</tr>
          },
          pre({ children }) {
            return <pre className="mt-6 overflow-x-auto rounded-2xl bg-muted p-4 font-mono text-sm leading-7 text-foreground">{children}</pre>
          },
          img({ src, alt }) {
            if (!src || typeof src !== "string") return null
            return (
              <figure className="mt-8">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted">
                  <Image src={src} alt={alt ?? ""} fill sizes="680px" className="object-cover" />
                </div>
                {alt ? <figcaption className="mt-2 text-center text-sm text-muted-foreground">{alt}</figcaption> : null}
              </figure>
            )
          },
          code({ children }) {
            return <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">{children}</code>
          },
          strong({ children }) {
            return <strong className="font-medium text-foreground">{children}</strong>
          },
          a({ href, children }) {
            return <a href={href} className="font-medium text-primary no-underline hover:underline">{children}</a>
          },
          ul({ children }) {
            return <ul className="mt-5 list-disc space-y-2 pl-6 text-muted-foreground">{children}</ul>
          },
          ol({ children }) {
            return <ol className="mt-5 list-decimal space-y-2 pl-6 text-muted-foreground">{children}</ol>
          },
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  )
}
