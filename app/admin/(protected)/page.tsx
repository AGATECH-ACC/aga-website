import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const cards = [
  { title: "Products", href: "/admin/products", note: "Manage service modules and product variables." },
  { title: "Industries", href: "/admin/industries", note: "Manage industry solution pages and cards." },
  { title: "Case Studies", href: "/admin/case-studies", note: "Manage gallery cards and detail pages." },
  { title: "Events", href: "/admin/events", note: "Manage spotlight event and event pages." },
  { title: "About", href: "/admin/pages/about", note: "Manage company story and about page copy." },
  { title: "Media", href: "/admin/media", note: "Upload and organize website images." },
]

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-semibold tracking-normal">Admin Portal</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Manage website content as drafts, publish when ready, and keep English and Chinese content together.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="h-full transition-transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {card.title}
                  <ArrowUpRight className="size-4" />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {card.note}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
