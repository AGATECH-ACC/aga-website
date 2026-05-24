import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SectionHeader,
  WebsiteContainer,
  WebsiteSection,
} from "@/components/website"

type InnerPageProps = {
  locale?: "en" | "zh"
  eyebrow: string
  title: string
  accent: string
  description: string
  actionLabel?: string
  parentHref?: string
  parentLabel?: string
  cards?: Array<{
    title: string
    description: string
    href?: string
  }>
}

export function InnerPage({
  locale = "en",
  eyebrow,
  title,
  accent,
  description,
  actionLabel = "View page",
  parentHref,
  parentLabel,
  cards = [],
}: InnerPageProps) {
  return (
    <WebsiteSection>
      <WebsiteContainer className="flex flex-col gap-10">
        {parentHref && parentLabel ? (
          <Link
            href={parentHref}
            className="inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            {parentLabel}
          </Link>
        ) : null}
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          accent={accent}
          description={description}
        />
        {cards.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {cards.map((card) => {
              const body = (
                <Card className="h-full transition-transform hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  {card.href ? (
                    <CardContent>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        {actionLabel}
                        <ArrowUpRight className="size-4" />
                      </span>
                    </CardContent>
                  ) : null}
                </Card>
              )

              return card.href ? (
                <Link key={card.title} href={card.href}>
                  {body}
                </Link>
              ) : (
                <div key={card.title}>{body}</div>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-muted-foreground">
              {locale === "zh"
                ? "内容基础已准备好。详细内容可以从后台继续补充。"
                : "Content foundation is ready. Detailed content can be expanded from the website brain docs."}
            </CardContent>
          </Card>
        )}
      </WebsiteContainer>
    </WebsiteSection>
  )
}
