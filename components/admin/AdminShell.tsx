import Link from "next/link"
import { Database, FileText, ImageIcon, LayoutDashboard, LogOut, Menu, Settings, Sparkles } from "lucide-react"

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

function AdminNavGroups({ onMobile = false }: { onMobile?: boolean }) {
  return (
    <nav className={onMobile ? "grid gap-4" : "flex flex-col gap-5"}>
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
                className="flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted"
              >
                <Icon data-icon="inline-start" />
                {item.label}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

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
        <aside className="hidden border-r bg-background p-5 md:block">
          <Link href="/admin" className="text-3xl font-black tracking-normal text-primary">
            AGA LeadEngine™
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">Website Admin</p>
          <Separator className="my-5" />
          <AdminNavGroups />
        </aside>
        <section className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-20 border-b bg-background/95 px-4 py-3 backdrop-blur md:flex md:min-h-16 md:items-center md:justify-between md:px-5 md:py-0">
            <div className="flex min-w-0 items-center justify-between gap-3 md:hidden">
              <div className="min-w-0">
                <Link href="/admin" className="block truncate text-lg font-black tracking-normal text-primary">
                  AGA LeadEngine™
                </Link>
                <p className="truncate text-xs font-medium text-muted-foreground">{email ?? "Not signed in"}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <details className="group relative">
                  <summary className="flex size-9 cursor-pointer list-none items-center justify-center rounded-[13px] border border-border bg-background transition-colors hover:bg-muted [&::-webkit-details-marker]:hidden">
                    <Menu className="size-4" />
                    <span className="sr-only">Open admin navigation</span>
                  </summary>
                  <div className="absolute right-0 top-11 max-h-[min(34rem,calc(100vh-5rem))] w-[min(20rem,calc(100vw-2rem))] overflow-auto rounded-lg border bg-background p-4 shadow-xl">
                    <AdminNavGroups onMobile />
                  </div>
                </details>
                <form action={signOutAdmin}>
                  <Button variant="secondary" size="icon-sm" aria-label="Sign out">
                    <LogOut />
                  </Button>
                </form>
              </div>
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Draft / Publish CMS
              </p>
              <p className="text-sm font-medium">{email ?? "Not signed in"}</p>
            </div>
            <form action={signOutAdmin} className="hidden md:block">
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
