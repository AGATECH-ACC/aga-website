import type { ReactNode } from "react"

import { SiteFooter, SiteNavbar } from "@/components/website"
import { getAlternateLocale, getDictionary, type Locale } from "@/lib/i18n/dictionary"

type LocalizedShellProps = {
  locale: Locale
  path: string
  children: ReactNode
}

export function LocalizedShell({ locale, path, children }: LocalizedShellProps) {
  const dictionary = getDictionary(locale)
  const alternateLocale = getAlternateLocale(locale)
  const languageHref = path.replace(`/${locale}`, `/${alternateLocale}`)

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteNavbar
        logoLabel={dictionary.nav.logoLabel}
        logoHref={dictionary.nav.logoHref}
        navGroups={dictionary.nav.groups.map((group) => ({
          label: group.label,
          href: "href" in group ? group.href : undefined,
          children: "children" in group
            ? group.children.map((child) => ({
                label: child.label,
                description: "description" in child ? child.description : undefined,
                href: child.href,
              }))
            : undefined,
        }))}
        cta={dictionary.nav.cta}
        ctaHref={dictionary.nav.ctaHref}
        languageHref={languageHref}
        languageLabel={dictionary.nav.languageLabel}
        variant="solid"
      />
      <div className="flex-1">
        {children}
      </div>
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
