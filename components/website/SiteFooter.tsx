import Link from "next/link"
import { Camera, Mail, MapPin, MessageCircle, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import {
  BilingualText,
  getWebsiteTextKey,
  WebsiteContainer,
  type BilingualText as BilingualTextType,
  type WebsiteText,
} from "./shared"

type FooterNavItem = BilingualTextType | { label: WebsiteText; href?: string }

type SiteFooterProps = {
  navItems?: FooterNavItem[]
  brand?: string
  homeHref?: string
  tagline?: string
  email?: string
}

export function SiteFooter({
  navItems = [
    { en: "Home", zh: "首页" },
    { en: "Services", zh: "服务" },
    { en: "Solutions", zh: "方案" },
    { en: "Insights", zh: "观点" },
    { en: "About", zh: "关于我们" },
  ],
  brand = "AGA",
  homeHref = "/",
  tagline = "Also want to learn more?\n也许还想了解更多",
  email = "enquiry@agaventures.ai",
}: SiteFooterProps) {
  return (
    <footer className="mt-auto bg-foreground py-12 text-background">
      <WebsiteContainer className="flex flex-col gap-10">
        <div className="grid gap-8 md:grid-cols-[1fr_0.9fr]">
          <div className="flex flex-col gap-5">
            <Link
              href={homeHref}
              className="flex w-fit items-center gap-2 text-primary"
              aria-label={`${brand} home`}
            >
              <span className="text-2xl font-black tracking-normal md:text-3xl">
                AGA
              </span>
            </Link>
            <p className="whitespace-pre-line text-lg text-background/80">
              {tagline}
            </p>
          </div>

          <div className="flex flex-col gap-5 md:items-end">
            <nav className="flex flex-wrap gap-3 text-sm">
              {navItems.map((item) => {
                const label = "label" in item ? item.label : item
                const href = "label" in item ? item.href : undefined

                return href ? (
                  <Button
                    key={getWebsiteTextKey(label)}
                    asChild
                    className="text-background"
                    variant="ghost"
                  >
                    <Link href={href}>
                      <BilingualText text={label} />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    key={getWebsiteTextKey(label)}
                    className="text-background"
                    variant="ghost"
                  >
                    <BilingualText text={label} />
                  </Button>
                )
              })}
            </nav>
            <div className="flex gap-2">
              <Button className="bg-background/10 text-background hover:bg-background/20" size="icon-sm" aria-label="LinkedIn">
                <Send className="size-4" />
              </Button>
              <Button className="bg-background/10 text-background hover:bg-background/20" size="icon-sm" aria-label="WhatsApp">
                <MessageCircle className="size-4" />
              </Button>
              <Button className="bg-background/10 text-background hover:bg-background/20" size="icon-sm" aria-label="Instagram">
                <Camera className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-background/10" />

        <div className="grid gap-4 text-sm text-background/70 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <Mail data-icon="inline-start" />
            {email}
          </div>
          <div className="flex items-center gap-2">
            <MapPin data-icon="inline-start" />
            Damansara Utama, Petaling Jaya, Selangor
          </div>
        </div>
      </WebsiteContainer>
    </footer>
  )
}
