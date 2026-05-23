"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { websiteClasses } from "@/styles/tokens"

export type NavChild = {
  label: string
  description?: string
  href: string
}

export type NavGroup = {
  label: string
  href?: string
  children?: NavChild[]
}

type SiteNavbarProps = {
  logoLabel?: string
  logoHref?: string
  navGroups?: NavGroup[]
  cta?: string
  ctaHref?: string
  languageHref?: string
  languageLabel?: string
  variant?: "transparent" | "solid"
}

export function SiteNavbar({
  logoLabel = "AGA",
  logoHref = "/",
  navGroups = [],
  cta = "Book demo",
  ctaHref,
  languageHref,
  languageLabel = "中文 / EN",
  variant = "solid",
}: SiteNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const isTransparent = variant === "transparent"

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b",
        isTransparent
          ? "border-white/10 bg-foreground/80 text-background backdrop-blur-md"
          : "border-border bg-background/95 text-foreground backdrop-blur-md"
      )}
    >
      <div
        className={cn(
          websiteClasses.container,
          "flex min-h-16 items-center justify-between gap-4"
        )}
      >
        {/* Logo */}
        <Link
          href={logoHref}
          className="flex shrink-0 items-center gap-2 text-primary"
          aria-label={`${logoLabel} home`}
        >
          <span className="text-2xl font-black tracking-normal md:text-3xl">
            {logoLabel}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {navGroups.map((group) =>
            group.children ? (
              <div
                key={group.label}
                className="group relative"
                onMouseEnter={() => setOpenGroup(group.label)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenGroup(openGroup === group.label ? null : group.label)
                  }
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-2 transition-colors",
                    isTransparent
                      ? "hover:bg-white/10"
                      : "hover:bg-muted"
                  )}
                >
                  {group.label}
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform duration-200",
                      openGroup === group.label && "rotate-180"
                    )}
                  />
                </button>

                {/* Dropdown panel */}
                <div
                  className={cn(
                    "fixed left-1/2 top-16 z-50 mt-1 w-[80vw] max-w-5xl -translate-x-1/2 rounded-2xl border border-border bg-background p-4 shadow-lg",
                    "transition-all duration-200",
                    openGroup === group.label
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0"
                  )}
                >
                  <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                        {group.label}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Explore AGA modules, industries, and implementation directions.
                      </p>
                    </div>
                    {group.href ? (
                      <Link
                        href={group.href}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                      >
                        View all
                        <ArrowUpRight className="size-4" />
                      </Link>
                    ) : null}
                  </div>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {group.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex min-h-24 flex-col gap-1 rounded-xl border bg-muted/20 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-primary/10"
                      >
                        <span className="text-sm font-semibold text-foreground">
                          {child.label}
                        </span>
                        {child.description && (
                          <span className="text-xs leading-5 text-muted-foreground">
                            {child.description}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                  {group.href ? (
                    <Link
                      href={group.href}
                      className="mt-3 flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                    >
                      View all {group.label}
                      <ChevronDown className="-rotate-90 size-3.5" />
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : (
              <Link
                key={group.label}
                href={group.href ?? "#"}
                className={cn(
                  "rounded-lg px-3 py-2 transition-colors",
                  isTransparent
                    ? "hover:bg-white/10"
                    : "hover:bg-muted hover:text-foreground"
                )}
              >
                {group.label}
              </Link>
            )
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {languageHref && (
            <Button asChild size="sm" variant="ghost" className={cn("hidden md:inline-flex", isTransparent && "text-background hover:bg-white/10 hover:text-background")}>
              <Link href={languageHref}>{languageLabel}</Link>
            </Button>
          )}
          {ctaHref ? (
            <Button asChild variant="primary" size="sm">
              <Link href={ctaHref} target={ctaHref.startsWith("http") ? "_blank" : undefined}>
                {cta}
              </Link>
            </Button>
          ) : (
            <Button variant="primary" size="sm">{cta}</Button>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden rounded-lg p-2 transition-colors hover:bg-muted"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 text-foreground md:hidden">
          <div className="flex flex-col gap-1">
            {navGroups.map((group) =>
              group.children ? (
                <div key={group.label}>
                  <button
                    onClick={() =>
                      setOpenGroup(openGroup === group.label ? null : group.label)
                    }
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-muted"
                  >
                    {group.label}
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform",
                        openGroup === group.label && "rotate-180"
                      )}
                    />
                  </button>
                  {openGroup === group.label && (
                    <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
                      {group.href ? (
                        <Link
                          href={group.href}
                          onClick={() => setMobileOpen(false)}
                          className="mb-1 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-muted"
                        >
                          View all {group.label}
                          <ArrowUpRight className="size-3.5" />
                        </Link>
                      ) : null}
                      {group.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
                        >
                          <span className="font-medium">{child.label}</span>
                          {child.description && (
                            <span className="block text-xs text-muted-foreground">
                              {child.description}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={group.label}
                  href={group.href ?? "#"}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  {group.label}
                </Link>
              )
            )}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              {languageHref ? (
                <Button asChild variant="secondary" className="w-full">
                  <Link href={languageHref} onClick={() => setMobileOpen(false)}>
                    {languageLabel}
                  </Link>
                </Button>
              ) : null}
              {ctaHref ? (
                <Button asChild variant="primary" className="w-full">
                  <Link
                    href={ctaHref}
                    onClick={() => setMobileOpen(false)}
                    target={ctaHref.startsWith("http") ? "_blank" : undefined}
                  >
                    {cta}
                  </Link>
                </Button>
              ) : (
                <Button variant="primary" className="w-full">{cta}</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
