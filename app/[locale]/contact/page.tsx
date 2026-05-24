import { notFound } from "next/navigation"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  WebsiteContainer,
  WebsiteSection,
} from "@/components/website"
import { getDictionary, isLocale, type Locale } from "@/lib/i18n/dictionary"

import { InnerPage } from "../_components/InnerPage"
import { LocalizedShell } from "../_components/LocalizedShell"

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function ContactPage({ params }: PageProps) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)

  if (locale === "en") {
    return (
      <LocalizedShell locale={locale} path={`/${locale}/contact`}>
        <WebsiteSection>
          <WebsiteContainer className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-semibold tracking-normal md:text-6xl">
                Book Your Free 30-Min Business Diagnosis
              </h1>
              <p className="text-base leading-7 text-muted-foreground md:text-xl">
                Start with one conversation. Walk away with a clear picture of what to systemize first.
              </p>
            </div>

            <div className="flex w-full max-w-xl flex-col items-center gap-3">
              <Button asChild variant="primary" size="lg" className="w-full">
                <Link href="https://client.agaventures.ai/enquiry">Book a Session Now →</Link>
              </Button>
              <Link
                href="https://wa.me/60183576003"
                className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                or WhatsApp us directly: +60183576003
              </Link>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-3">
              <Badge variant="outline" className="h-auto w-full justify-center rounded-xl px-4 py-3">
                ✓ Free — No cost
              </Badge>
              <Badge variant="outline" className="h-auto w-full justify-center rounded-xl px-4 py-3">
                ✓ 24h Reply — Fast response
              </Badge>
              <Badge variant="outline" className="h-auto w-full justify-center rounded-xl px-4 py-3">
                ✓ No Obligation — No pressure
              </Badge>
            </div>
          </WebsiteContainer>
        </WebsiteSection>
      </LocalizedShell>
    )
  }

  return (
    <LocalizedShell locale={locale} path={`/${locale}/contact`}>
      <InnerPage
        locale={locale}
        eyebrow={dictionary.pages.contact.eyebrow}
        title={dictionary.pages.contact.title}
        accent={dictionary.pages.contact.accent}
        description={dictionary.pages.contact.description}
      />
    </LocalizedShell>
  )
}
