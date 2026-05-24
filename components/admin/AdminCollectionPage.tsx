import { Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { listAdminEntries, listMediaAssets } from "@/lib/cms/db"
import type { CmsCollection } from "@/lib/cms/types"

import { AdminCollectionManager } from "./AdminCollectionManager"

const collectionLabels: Record<CmsCollection, string> = {
  products: "Services",
  industries: "Industries",
  case_studies: "Case Studies",
  events: "Events",
  about: "About Page",
}

export async function AdminCollectionPage({
  collection,
  searchParams,
}: {
  collection: CmsCollection
  searchParams?: Promise<{ q?: string; status?: string }>
}) {
  const params = await searchParams
  const entries = await listAdminEntries(collection)
  const mediaAssets = await listMediaAssets()
  const isSingleton = collection === "about"
  const query = params?.q?.toLowerCase() ?? ""
  const status = params?.status ?? "all"
  const filtered = entries.filter((entry) => {
    const matchesQuery =
      !query ||
      entry.slug.toLowerCase().includes(query) ||
      entry.locales.some((locale) => locale.draftTitle.toLowerCase().includes(query))
    const matchesStatus = status === "all" || entry.status === status
    return matchesQuery && matchesStatus
  })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Badge className="w-fit" variant="secondary">
          CMS Collection
        </Badge>
        <h1 className="text-4xl font-semibold tracking-normal">{collectionLabels[collection]}</h1>
        <p className="max-w-3xl text-muted-foreground">
          Manage drafts, localized content, SEO JSON, media references, and publish status.
        </p>
      </div>

      {!isSingleton ? (
        <Card>
          <CardHeader>
            <CardTitle>Search and status</CardTitle>
            <CardDescription>Filter content entries before editing.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3 md:grid-cols-[1fr_12rem_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input name="q" defaultValue={params?.q} className="pl-9" placeholder="Search slug or title" />
              </div>
              <select
                name="status"
                defaultValue={status}
                className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
              >
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <button className="rounded-lg bg-foreground px-4 py-1.5 text-sm font-semibold text-background">
                Filter
              </button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <AdminCollectionManager collection={collection} entries={filtered} mediaAssets={mediaAssets} />
    </div>
  )
}
