"use client"

import Link from "next/link"
import { ExternalLink, Pencil, Plus, Trash2, X } from "lucide-react"
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteCmsEntry, setCmsEntryStatus } from "@/lib/cms/actions"
import type { CmsCollection, CmsEntry, CmsMediaAsset } from "@/lib/cms/types"

import { CmsEntryForm } from "./CmsEntryForm"

function englishTitle(entry: CmsEntry) {
  const content = entry.locales.find((locale) => locale.locale === "en")
  return content?.draftTitle || content?.title || entry.slug
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function collectionPreviewHref(collection: CmsCollection, slug: string) {
  if (collection === "products") return `/en/services/${slug}`
  if (collection === "industries") return `/en/solutions/${slug}`
  if (collection === "case_studies") return `/en/case-studies/${slug}`
  if (collection === "events") return `/en/events/${slug}`
  if (collection === "about") return "/en/about"
  return "/en"
}

function ConfirmDeleteButton({ title }: { title: string }) {
  return (
    <Button
      type="submit"
      size="sm"
      variant="danger"
      onClick={(event) => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) {
          event.preventDefault()
        }
      }}
    >
      <Trash2 data-icon="inline-start" />
      Delete
    </Button>
  )
}

export function AdminCollectionManager({
  collection,
  entries,
  mediaAssets,
}: {
  collection: CmsCollection
  entries: CmsEntry[]
  mediaAssets: CmsMediaAsset[]
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const editingEntry = useMemo(
    () => entries.find((entry) => entry.id === editingId),
    [editingId, entries]
  )
  const modalTitle = editingEntry ? `Edit ${englishTitle(editingEntry)}` : "New record"
  const isSingleton = collection === "about"
  const cardTitle = isSingleton ? "About page content" : "Entries"
  const emptyMessage = isSingleton
    ? "No About page content exists yet. Use New to create the editable About page record."
    : "No records found. Use New to create the first draft."

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <CardTitle>{cardTitle}</CardTitle>
          {isSingleton && entries.length ? null : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingId(null)
                setModalOpen(true)
              }}
            >
              <Plus data-icon="inline-start" />
              New
            </Button>
          )}
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {entries.length ? (
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="py-3 pr-4 font-semibold">Title (English)</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 pr-4 font-semibold">Last Modified</th>
                  <th className="py-3 pr-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const title = englishTitle(entry)
                  const nextStatus = entry.status === "published" ? "draft" : "published"

                  return (
                    <tr key={entry.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">{title}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={entry.status === "published" ? "secondary" : "outline"}>
                          {entry.status === "published" ? "Live" : "Not Live"}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{formatDate(entry.updatedAt)}</td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setEditingId(entry.id)
                              setModalOpen(true)
                            }}
                          >
                            <Pencil data-icon="inline-start" />
                            Edit
                          </Button>
                          {entry.status === "published" ? (
                            <Button asChild type="button" size="sm" variant="ghost">
                              <Link href={collectionPreviewHref(collection, entry.slug)} target="_blank">
                                <ExternalLink data-icon="inline-start" />
                                View live
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingId(entry.id)
                                setModalOpen(true)
                              }}
                            >
                              <ExternalLink data-icon="inline-start" />
                              Preview
                            </Button>
                          )}
                          <form action={setCmsEntryStatus}>
                            <input type="hidden" name="id" value={entry.id} />
                            <input type="hidden" name="collection" value={collection} />
                            <input type="hidden" name="status" value={nextStatus} />
                            <Button type="submit" size="sm" variant="outline">
                              {entry.status === "published" ? "Set Not Live" : "Set Live"}
                            </Button>
                          </form>
                          <form action={deleteCmsEntry}>
                            <input type="hidden" name="id" value={entry.id} />
                            <input type="hidden" name="collection" value={collection} />
                            <ConfirmDeleteButton title={title} />
                          </form>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-4 text-muted-foreground">{emptyMessage}</div>
          )}
        </CardContent>
      </Card>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-4">
          <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-xl font-semibold tracking-normal">{modalTitle}</h2>
                <p className="text-sm text-muted-foreground">Edit content and preview how the public page/card will read.</p>
              </div>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() => {
                  setModalOpen(false)
                  setEditingId(null)
                }}
              >
                <X />
              </Button>
            </div>
            <div className="overflow-y-auto p-5">
              <CmsEntryForm
                key={editingEntry?.id ?? "new"}
                collection={collection}
                entry={editingEntry}
                mediaAssets={mediaAssets}
                previewHref={
                  editingEntry?.status === "published"
                    ? collectionPreviewHref(collection, editingEntry.slug)
                    : undefined
                }
                onCancelEdit={() => {
                  setModalOpen(false)
                  setEditingId(null)
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
