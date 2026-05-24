import { Mail, MapPin } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

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

type FooterColumn = {
  title: string
  links: { label: string; href: string }[]
}

const enquiryHref = "https://client.agaventures.ai/enquiry"
const whatsappHref = "https://wa.me/60183576003"
const linkedinHref = "https://www.linkedin.com/company/aga-ventures-ai/"
const instagramHref = "https://www.instagram.com/agaventures.ai/"

export function SiteFooter({
  navItems = [
    { en: "Home" },
    { en: "Services" },
    { en: "Solutions" },
    { en: "Insights" },
    { en: "About" },
  ],
  brand = "AGA",
  homeHref = "/",
  tagline = "Also want to learn more?",
  email = "enquiry@agaventures.ai",
}: SiteFooterProps) {
  const isZh = homeHref.startsWith("/zh")
  const columns = getFooterColumns(isZh)
  const legalLinks = isZh
    ? [
        { label: "隐私政策", href: "/zh/privacy-policy" },
        { label: "服务条款", href: "/zh/terms-of-service" },
        { label: "Cookie 政策", href: "/zh/cookie-policy" },
        { label: "信任中心", href: "/zh/trust-center" },
        { label: "联系支持", href: "/zh/support" },
      ]
    : [
        { label: "Privacy policy", href: "/en/privacy-policy" },
        { label: "Terms of service", href: "/en/terms-of-service" },
        { label: "Cookie policy", href: "/en/cookie-policy" },
        { label: "Trust center", href: "/en/trust-center" },
        { label: "Support", href: "/en/support" },
      ]

  return (
    <footer className="mt-auto bg-[#1b1a18] text-background">
      <WebsiteContainer className="py-12 md:py-16">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-sm">
              <Link
                href={homeHref}
                className="inline-flex items-center gap-3 text-background"
                aria-label={`${brand} home`}
              >
                <span className="grid size-11 place-items-center rounded-full bg-primary text-lg font-black text-primary-foreground">
                  A
                </span>
                <span className="text-3xl font-black tracking-normal">AGA</span>
              </Link>
              <p className="mt-6 whitespace-pre-line text-lg leading-8 text-background/72">
                {tagline}
              </p>
            </div>

            <div className="flex gap-3">
              <SocialLink href="mailto:enquiry@agaventures.ai" label="Email">
                <Mail className="size-5" />
              </SocialLink>
              <SocialLink href={whatsappHref} label="WhatsApp">
                <WhatsAppIcon className="size-5" />
              </SocialLink>
              <SocialLink href={linkedinHref} label="LinkedIn">
                <LinkedInIcon className="size-5" />
              </SocialLink>
              <SocialLink href={instagramHref} label="Instagram">
                <InstagramIcon className="size-5" />
              </SocialLink>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-4">
                <h2 className="text-base font-bold text-background">{column.title}</h2>
                <nav className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <Link
                      key={`${column.title}-${link.label}`}
                      href={link.href}
                      className="text-base leading-6 text-background/55 transition hover:text-background"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>

          <div className="grid gap-5 border-t border-background/12 pt-8 text-sm text-background/62 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {legalLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="transition hover:text-background">
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                <span className="inline-flex items-center gap-2">
                  <Mail className="size-4" />
                  {email}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4" />
                  Damansara Utama, Petaling Jaya, Selangor
                </span>
              </div>
            </div>
            <p className="text-background/55">© AGA Ventures Sdn Bhd {new Date().getFullYear()}</p>
          </div>

          <div hidden>
            {navItems.map((item) => {
              const label = "label" in item ? item.label : item
              return <BilingualText key={getWebsiteTextKey(label)} text={label} />
            })}
          </div>
        </div>
      </WebsiteContainer>
    </footer>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
    >
      <path d="M5.3 18.7 6.2 15A7.2 7.2 0 1 1 9 17.7z" />
      <path d="M9.1 8.9c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.2.7l-.3.4c-.1.1-.2.3-.1.5.4.8 1.1 1.5 2 2 .2.1.3 0 .5-.1l.5-.6c.2-.2.4-.3.7-.2l1.6.7c.3.1.4.3.4.6 0 .7-.4 1.5-1.1 1.7-.8.3-2.5 0-4.2-1.1-1.8-1.1-3.1-2.9-3.5-4.4-.2-.8.1-1.4.3-1.7z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M6.8 8.9H3.6v10.2h3.2zM5.2 4a1.8 1.8 0 1 0 0 3.6A1.8 1.8 0 0 0 5.2 4m5.4 4.9H7.5v10.2h3.1v-5c0-1.3.2-2.6 1.9-2.6s1.7 1.5 1.7 2.7v4.9h3.1v-5.6c0-2.8-.6-4.9-3.8-4.9-1.5 0-2.5.8-2.9 1.6z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
    >
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="16.8" cy="7.2" r=".7" fill="currentColor" stroke="none" />
    </svg>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid size-12 place-items-center rounded-full border border-background/22 text-background/75 transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
    >
      {children}
    </a>
  )
}

function getFooterColumns(isZh: boolean): FooterColumn[] {
  if (isZh) {
    return [
      {
        title: "平台",
        links: [
          { label: "OneSystem™", href: "/zh/services/one-system" },
          { label: "OneIntelligence™", href: "/zh/services/one-intelligence" },
          { label: "Workflow Registry", href: "/zh/services/workflow-registry" },
          { label: "Business DNA™", href: "/zh/services/business-dna" },
          { label: "Cortex", href: "/zh/services/cortex" },
        ],
      },
      {
        title: "行业方案",
        links: [
          { label: "教育培训", href: "/zh/solutions" },
          { label: "F&B 餐饮", href: "/zh/solutions" },
          { label: "服务业", href: "/zh/solutions" },
          { label: "批发贸易", href: "/zh/solutions" },
          { label: "专业服务公司", href: "/zh/solutions" },
        ],
      },
      {
        title: "学习",
        links: [
          { label: "观点文章", href: "/zh/insights" },
          { label: "案例研究", href: "/zh/case-studies" },
          { label: "活动", href: "/zh/events/sme-ai" },
          { label: "关于 AGA", href: "/zh/about" },
        ],
      },
      {
        title: "使用 AGA",
        links: [
          { label: "预约免费诊断", href: enquiryHref },
          { label: "WhatsApp 联系", href: whatsappHref },
          { label: "联系团队", href: "/zh/contact" },
        ],
      },
      {
        title: "公司",
        links: [
          { label: "关于我们", href: "/zh/about" },
          { label: "案例", href: "/zh/case-studies" },
          { label: "观点文章", href: "/zh/insights" },
          { label: "联系", href: "/zh/contact" },
        ],
      },
    ]
  }

  return [
    {
      title: "Platform",
      links: [
        { label: "OneSystem™", href: "/en/services/one-system" },
        { label: "OneIntelligence™", href: "/en/services/one-intelligence" },
        { label: "Workflow Registry", href: "/en/services/workflow-registry" },
        { label: "Business DNA™", href: "/en/services/business-dna" },
        { label: "Cortex", href: "/en/services/cortex" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "Education & training", href: "/en/solutions" },
        { label: "F&B", href: "/en/solutions" },
        { label: "Services", href: "/en/solutions" },
        { label: "Wholesale trade", href: "/en/solutions" },
        { label: "Professional services", href: "/en/solutions" },
      ],
    },
    {
      title: "Learn",
      links: [
        { label: "Insights", href: "/en/insights" },
        { label: "Case studies", href: "/en/case-studies" },
        { label: "Events", href: "/en/events/sme-ai" },
        { label: "About AGA", href: "/en/about" },
      ],
    },
    {
      title: "Use AGA",
      links: [
        { label: "Book a free diagnosis", href: enquiryHref },
        { label: "WhatsApp us", href: whatsappHref },
        { label: "Contact team", href: "/en/contact" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/en/about" },
        { label: "Case studies", href: "/en/case-studies" },
        { label: "Insights", href: "/en/insights" },
        { label: "Contact", href: "/en/contact" },
      ],
    },
  ]
}
