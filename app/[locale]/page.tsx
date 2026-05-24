import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Bot, BrainCircuit, ClipboardCheck } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CTASection,
  DiagnosisBreakdownSection,
  EventSpotlight,
  HeroSection,
  IndustrySolutionCards,
  ProcessTimeline,
  ProductGrid,
  SectionHeader,
  SiteFooter,
  SiteNavbar,
  SocialProofStrip,
  StatsGrid,
  TestimonialsSection,
  WebsiteContainer,
  WebsiteSection,
} from "@/components/website"
import {
  getAlternateLocale,
  getDictionary,
  isLocale,
  locales,
  type Locale,
} from "@/lib/i18n/dictionary"
import { buildLocalizedNavGroups } from "@/lib/i18n/nav-groups"
import { getSiteStats, listLogoAssets, listTestimonials } from "@/lib/cms/db"
import { getCmsEvent, getCmsIndustries, getCmsProducts } from "@/lib/cms/public-content"

export const revalidate = 60

type LocalePageProps = {
  params: Promise<{
    locale: string
  }>
}

const trustIcons = {
  clipboard: ClipboardCheck,
  brain: BrainCircuit,
  bot: Bot,
} as const

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    return {}
  }

  const locale = localeParam
  const dictionary = getDictionary(locale)

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        zh: "/zh",
      },
    },
    openGraph: {
      title: dictionary.metadata.openGraph.title,
      description: dictionary.metadata.openGraph.description,
      type: "website",
      locale: locale === "en" ? "en_US" : "zh_CN",
      alternateLocale: locale === "en" ? ["zh_CN"] : ["en_US"],
      url: `/${locale}`,
    },
  }
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale: Locale = localeParam
  const dictionary = getDictionary(locale)
  const [products, industries, navProducts, navIndustries, eventPage, siteStats, logos, testimonials] = await Promise.all([
    getCmsProducts(locale, dictionary.productsSection.products),
    getCmsIndustries(locale, dictionary.industriesSection.industries),
    getCmsProducts(locale, dictionary.productsSection.products, { includeFallback: false }),
    getCmsIndustries(locale, dictionary.industriesSection.industries, { includeFallback: false }),
    getCmsEvent(locale, "sme-ai-systemization-workshop", dictionary.eventPage),
    getSiteStats(),
    listLogoAssets({ activeOnly: true }),
    listTestimonials({ activeOnly: true }),
  ])
  const alternateLocale = getAlternateLocale(locale)
  const languageHref = `/${alternateLocale}`
  const navGroups = buildLocalizedNavGroups({ dictionary, services: navProducts, industries: navIndustries })

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">

      <EventSpotlight
        eyebrow={eventPage.eyebrow}
        title={eventPage.title}
        description={eventPage.description}
        href={dictionary.eventSpotlight.href}
        action={eventPage.actionLabel}
      />

      {/* ── Navbar ── */}
      <SiteNavbar
        logoLabel={dictionary.nav.logoLabel}
        logoHref={dictionary.nav.logoHref}
        navGroups={navGroups}
        cta={dictionary.nav.cta}
        ctaHref={dictionary.nav.ctaHref}
        languageHref={languageHref}
        languageLabel={dictionary.nav.languageLabel}
        variant="transparent"
      />

      {/* ── Hero ── */}
      <HeroSection
        title={dictionary.hero.title}
        accent={dictionary.hero.accent}
        description={dictionary.hero.description}
        primaryAction={dictionary.hero.primaryAction}
        secondaryAction={dictionary.hero.secondaryAction}
        primaryActionHref={dictionary.nav.ctaHref}
        secondaryActionHref={dictionary.hero.whatsappHref}
        visualNote={dictionary.hero.visualNote}
      />

      {/* ── Social proof strip ── */}
      <SocialProofStrip
        label={dictionary.socialProof.label}
        logos={logos.map((logo) => ({
          id: logo.id,
          name: logo.name,
          imageUrl: logo.imageUrl,
          linkUrl: logo.linkUrl,
        }))}
      />

      {/* ── Why AGA trust cards ── */}
      <WebsiteSection className="py-20 md:py-24">
        <WebsiteContainer className="flex flex-col gap-8">
          <SectionHeader
            eyebrow={dictionary.trustSection.eyebrow}
            title={dictionary.trustSection.title}
            accent={dictionary.trustSection.accent}
            description={dictionary.trustSection.description}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {dictionary.trustSection.cards.map((item) => {
              const Icon = trustIcons[item.icon]
              return (
                <Card key={item.title}>
                  <CardHeader>
                    <div className="grid size-12 place-items-center rounded-2xl bg-system/10 text-system">
                      <Icon data-icon="inline-start" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </WebsiteContainer>
      </WebsiteSection>

      {/* ── AGA Products (Deel-style platform section) ── */}
      <WebsiteSection id="products" className="bg-muted/30">
        <WebsiteContainer className="flex flex-col gap-10">
          <SectionHeader
            eyebrow={dictionary.productsSection.eyebrow}
            title={dictionary.productsSection.title}
            accent={dictionary.productsSection.accent}
            description={dictionary.productsSection.description}
          />
          <ProductGrid
            products={products.map((p) => ({
              name: p.name,
              tagline: p.tagline,
              description: p.description,
              href: p.href,
              visualKind: p.visualKind as "workflow" | "operations" | "sales" | "finance" | "ai",
            }))}
            cta={dictionary.productsSection.cta}
            ctaHref={`/${locale}/services`}
          />
        </WebsiteContainer>
      </WebsiteSection>

      {/* ── Industry solutions ── */}
      <WebsiteSection id="solutions">
        <WebsiteContainer className="flex flex-col gap-10">
          <SectionHeader
            eyebrow={dictionary.industriesSection.eyebrow}
            title={dictionary.industriesSection.title}
            accent={dictionary.industriesSection.accent}
            description={dictionary.industriesSection.description}
          />
          <IndustrySolutionCards
            industries={industries.map((industry) => ({
              title: industry.title,
              description: industry.description,
              href: industry.href,
              visualKind: industry.visualKind,
              active: "active" in industry ? industry.active : undefined,
            }))}
            ctaLabel={dictionary.industriesSection.ctaLabel}
          />
        </WebsiteContainer>
      </WebsiteSection>

      <TestimonialsSection locale={locale} testimonials={testimonials} />

      {/* ── How it works ── */}
      <WebsiteSection className="bg-muted/30">
        <WebsiteContainer className="flex flex-col gap-10">
          <SectionHeader
            eyebrow={dictionary.processSection.eyebrow}
            title={dictionary.processSection.title}
            accent={dictionary.processSection.accent}
          />
          <ProcessTimeline
            steps={dictionary.processSection.steps.map((step) => ({
              step: step.step,
              title: step.title,
              description: step.description,
            }))}
            tabs={dictionary.processSection.tabs.map((tab) => ({
              label: tab.label,
              steps: tab.steps.map((step) => ({
                step: step.step,
                title: step.title,
                description: step.description,
              })),
            }))}
            productLabel={dictionary.processSection.productLabel}
            visualLabel={dictionary.processSection.visualLabel}
          />
        </WebsiteContainer>
      </WebsiteSection>

      {/* ── Stats ── */}
      <WebsiteSection>
        <WebsiteContainer className="flex flex-col gap-10">
          <SectionHeader
            eyebrow={dictionary.statsSection.eyebrow}
            title={dictionary.statsSection.title}
            description={dictionary.statsSection.description}
            align="center"
          />
          <StatsGrid
            stats={dictionary.statsSection.stats.map((stat, index) => ({
              value: stat.value,
              target: [
                siteStats.statCounterAnalyses.number,
                siteStats.statCounterAutomationPct.number,
                siteStats.statCounterModules.number,
              ][index],
              suffix: [
                siteStats.statCounterAnalyses.suffix,
                siteStats.statCounterAutomationPct.suffix,
                siteStats.statCounterModules.suffix,
              ][index],
              label: stat.label,
            }))}
          />
        </WebsiteContainer>
      </WebsiteSection>

      {/* ── CTA ── */}
      <DiagnosisBreakdownSection locale={locale} />

      {/* ── CTA ── */}
      <WebsiteSection>
        <CTASection
          title={dictionary.ctaSection.title}
          description={dictionary.ctaSection.description}
          trustLine={dictionary.ctaSection.trustLine}
          action={dictionary.ctaSection.action}
        />
      </WebsiteSection>

      {/* ── Footer ── */}
      <SiteFooter
        brand={dictionary.footer.brand}
        homeHref={dictionary.nav.logoHref}
        tagline={dictionary.footer.tagline}
        email={dictionary.footer.email}
        navItems={dictionary.footer.navItems.map((item) => ({
          label: item.label,
          href: item.href,
        }))}
      />
    </main>
  )
}
