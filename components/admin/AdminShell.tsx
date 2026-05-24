import Link from "next/link"
import { Database, FileText, ImageIcon, LayoutDashboard, LogOut, Settings, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { signOutAdmin } from "@/lib/cms/actions"

const navSections = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { label: "Services", href: "/admin/products", icon: Database },
      { label: "Industries", href: "/admin/industries", icon: Database },
      { label: "Insights", href: "/admin/insights", icon: FileText },
      { label: "Case Studies", href: "/admin/case-studies", icon: FileText },
      { label: "Events", href: "/admin/events", icon: Sparkles },
      { label: "About", href: "/admin/pages/about", icon: FileText },
    ],
  },
  {
    label: "Assets",
    items: [{ label: "Media", href: "/admin/media", icon: ImageIcon }],
  },
  {
    label: "System",
    items: [
      { label: "Site Settings", href: "/admin/site-settings", icon: Settings },
      { label: "Design System", href: "/admin/design-system", icon: Sparkles },
    ],
  },
]

export function AdminShell({
  email,
  children,
}: {
  email?: string | null
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-muted/30 text-foreground">
      <div className="grid min-h-screen md:grid-cols-[17rem_1fr]">
        <aside className="border-r bg-background p-5">
          <Link href="/admin" className="text-3xl font-black tracking-normal text-primary">
            AGA LeadEngine™
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">Website Admin</p>
          <Separator className="my-5" />
          <nav className="flex flex-col gap-5">
            {navSections.map((section) => (
              <div key={section.label} className="grid gap-1">
                <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-widest text-muted-foreground">
                  {section.label}
                </p>
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted"
                    >
                      <Icon data-icon="inline-start" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            ))}
          </nav>
        </aside>
        <section className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b bg-background/90 px-5 backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Draft / Publish CMS
              </p>
              <p className="text-sm font-medium">{email ?? "Not signed in"}</p>
            </div>
            <form action={signOutAdmin}>
              <Button variant="secondary" size="sm">
                <LogOut data-icon="inline-start" />
                Sign out
              </Button>
            </form>
          </header>
          <div className="p-5 md:p-8">{children}</div>
        </section>
      </div>
    </main>
  )
}
