import Link from "next/link"

import { AdminDashboardQuickActions } from "@/components/admin/AdminDashboardQuickActions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cmsCollections, type CmsCollection, type CmsEntry } from "@/lib/cms/types"
import { listAllAdminEntries, listMediaAssets } from "@/lib/cms/db"

const collectionLabels: Record<CmsCollection, string> = {
  products: "Services",
  industries: "Industries",
  case_studies: "Case Studies",
  events: "Events",
  about: "About",
}

const collectionPaths: Record<CmsCollection, string> = {
  products: "/admin/products",
  industries: "/admin/industries",
  case_studies: "/admin/case-studies",
  events: "/admin/events",
  about: "/admin/pages/about",
}

function englishTitle(entry: CmsEntry) {
  const content = entry.locales.find((locale) => locale.locale === "en")
  return content?.draftTitle || content?.title || entry.slug
}

function hasChineseTranslation(entry: CmsEntry) {
  const content = entry.locales.find((locale) => locale.locale === "zh")
  return Boolean(content?.draftTitle || content?.title || content?.draftSummary || content?.summary || content?.draftBody || content?.body)
}

function hasImage(entry: CmsEntry) {
  return entry.locales.some((locale) => {
    const value = locale.draftFields?.imageUrl ?? locale.fields?.imageUrl
    return typeof value === "string" && value.length > 0
  })
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function formatBytes(value: number) {
  if (!value) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1)
  return `${(value / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`
}

export default async function AdminDashboardPage() {
  const [entries, mediaAssets] = await Promise.all([listAllAdminEntries(), listMediaAssets()])
  const recentEntries = entries.slice(0, 5)
  const healthItems = entries
    .flatMap((entry) => {
      const flags = []
      if (!hasChineseTranslation(entry)) flags.push("Missing Chinese translation")
      if (!hasImage(entry)) flags.push("Missing image")
      return flags.map((flag) => ({ entry, flag }))
    })
    .slice(0, 8)
  const storageBytes = mediaAssets.reduce((total, asset) => total + (asset.sizeBytes ?? 0), 0)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-semibold tracking-normal">Admin Portal</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Manage website content as drafts, publish when ready, and keep English and Chinese content together.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cmsCollections.map((collection) => {
          const collectionEntries = entries.filter((entry) => entry.collection === collection)
          const published = collectionEntries.filter((entry) => entry.status === "published").length
          const draft = collectionEntries.filter((entry) => entry.status === "draft").length

          return (
            <Link key={collection} href={collectionPaths[collection]}>
              <Card className="h-full transition-transform hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-base">{collectionLabels[collection]}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Published</span>
                    <strong>{published}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Draft</span>
                    <strong>{draft}</strong>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            {recentEntries.length ? (
              recentEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between gap-4 rounded-xl border p-3">
                  <div>
                    <p className="font-semibold">{englishTitle(entry)}</p>
                    <p className="text-muted-foreground">{collectionLabels[entry.collection]}</p>
                  </div>
                  <span className="text-right text-xs text-muted-foreground">{formatDate(entry.updatedAt)}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No entries yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content health</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            {healthItems.length ? (
              healthItems.map(({ entry, flag }) => (
                <div key={`${entry.id}-${flag}`} className="flex items-center justify-between gap-4 rounded-xl border p-3">
                  <div>
                    <p className="font-semibold">{englishTitle(entry)}</p>
                    <p className="text-muted-foreground">{collectionLabels[entry.collection]}</p>
                  </div>
                  <Badge variant="outline">{flag}</Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">All entries have Chinese copy and images.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Storage usage</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4 text-sm">
          <Badge variant="secondary">aga-website-media</Badge>
          <span className="font-semibold">{formatBytes(storageBytes)}</span>
          <span className="text-muted-foreground">{mediaAssets.length} files tracked in media library</span>
        </CardContent>
      </Card>

      <section className="grid gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-normal">Quick actions</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create high-frequency content directly from the dashboard.</p>
        </div>
        <AdminDashboardQuickActions mediaAssets={mediaAssets} />
      </section>
    </div>
  )
}
