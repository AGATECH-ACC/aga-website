"use client"

import Link from "next/link"
import { ArrowRight, Bot, ExternalLink, ImageIcon, Save, Send, X } from "lucide-react"
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { publishCmsEntry, saveCmsEntry } from "@/lib/cms/actions"
import { slugifyTitle } from "@/lib/cms/slug.mjs"
import type { CmsCollection, CmsEntry, CmsLocale, CmsMediaAsset } from "@/lib/cms/types"

const locales: CmsLocale[] = ["en", "zh"]

function localeValue(entry: CmsEntry | undefined, locale: CmsLocale) {
  return entry?.locales.find((item) => item.locale === locale)
}

function entryImageUrl(entry: CmsEntry | undefined) {
  for (const locale of entry?.locales ?? []) {
    const value = locale.draftFields?.imageUrl ?? locale.fields?.imageUrl
    if (typeof value === "string" && value) return value
  }

  return ""
}

function Textarea(props: React.ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className="min-h-28 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    />
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold">
      {label}
      {children}
    </label>
  )
}

function collectionPreviewLabel(collection: CmsCollection) {
  if (collection === "products") return "Website service card"
  if (collection === "industries") return "Website solution card"
  if (collection === "case_studies") return "Website case study card"
  if (collection === "events") return "Website event page"
  if (collection === "about") return "Website about page"
  return "Website preview"
}

function defaultFieldsJson(collection: CmsCollection) {
  if (collection === "case_studies") {
    return JSON.stringify(
      {
        industry: "F&B Group, Klang Valley",
        metric: "12 hours saved weekly",
        challenge: "What was broken before AGA stepped in.",
        solution: "How AGA mapped, built, connected, and trained the workflow.",
        result: "The measurable operational improvement after launch.",
      },
      null,
      2
    )
  }

  if (collection === "industries") {
    return JSON.stringify(
      {
        visualKind: "services",
        active: false,
        modules: [
          { title: "Workflow", description: "What this industry workflow needs." },
        ],
      },
      null,
      2
    )
  }

  return "{}"
}

function collectionFieldGuidance(collection: CmsCollection) {
  if (collection === "case_studies") {
    return "For case studies, use Section Label as the industry/client type. In Collection fields JSON, fill metric, challenge, solution, and result."
  }

  if (collection === "industries") {
    return "For industry cards, publish records here to replace the public fallback cards and navbar dropdown items."
  }

  if (collection === "products") {
    return "For services, publish records here to replace the public service cards and Services dropdown items."
  }

  return ""
}

export function CmsEntryForm({
  collection,
  entry,
  mediaAssets,
  onCancelEdit,
  previewHref,
}: {
  collection: CmsCollection
  entry?: CmsEntry
  mediaAssets: CmsMediaAsset[]
  onCancelEdit?: () => void
  previewHref?: string
}) {
  const englishContent = localeValue(entry, "en")
  const [slug, setSlug] = useState(entry?.slug ?? "")
  const [englishTitle, setEnglishTitle] = useState(englishContent?.draftTitle || englishContent?.title || "")
  const [englishAccent, setEnglishAccent] = useState(englishContent?.draftAccent || englishContent?.accent || "")
  const [englishSummary, setEnglishSummary] = useState(englishContent?.draftSummary || englishContent?.summary || "")
  const [englishBody, setEnglishBody] = useState(englishContent?.draftBody || englishContent?.body || "")
  const [imageUrl, setImageUrl] = useState(entryImageUrl(entry))
  const [pickerOpen, setPickerOpen] = useState(false)
  const sortedAssets = useMemo(
    () => mediaAssets.filter((asset) => asset.publicUrl).sort((a, b) => a.path.localeCompare(b.path)),
    [mediaAssets]
  )

  return (
    <Card id="cms-entry-form" className="border-0 shadow-none">
      <CardHeader className="flex-row items-center justify-between px-0 pt-0">
        <CardTitle>{entry ? `Editing ${entry.slug}` : "New record"}</CardTitle>
        <div className="flex items-center gap-2">
          {entry ? (
            <Badge variant={entry.status === "published" ? "secondary" : "outline"}>
              {entry.status === "published" ? "Live" : "Not Live"}
            </Badge>
          ) : null}
          {previewHref ? (
            <Button asChild type="button" size="sm" variant="ghost">
              <Link href={previewHref} target="_blank">
                <ExternalLink data-icon="inline-start" />
                Open live page
              </Link>
            </Button>
          ) : null}
          {entry ? (
            <Button type="button" size="sm" variant="ghost" onClick={onCancelEdit}>
              <X data-icon="inline-start" />
              Clear
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 px-0 pb-0 xl:grid-cols-[1fr_22rem]">
        <div className="flex flex-col gap-4">
          <form action={saveCmsEntry} className="flex flex-col gap-6">
            <input type="hidden" name="collection" value={collection} />
            <input type="hidden" name="imageUrl" value={imageUrl} />
            {entry ? <input type="hidden" name="id" value={entry.id} /> : null}

          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Slug">
              <Input
                name="slug"
                value={slug}
                onChange={(event) => setSlug(slugifyTitle(event.target.value))}
                placeholder="auto-generated-from-title"
                required
              />
            </Field>
            <Field label="Status">
              <select
                name="status"
                defaultValue={entry?.status ?? "draft"}
                className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <Field label="Sort order">
              <Input name="sortOrder" type="number" defaultValue={entry?.sortOrder ?? 0} />
            </Field>
            <label className="mt-6 flex items-center gap-2 text-sm font-semibold">
              <input name="featured" type="checkbox" defaultChecked={entry?.featured} />
              Featured
            </label>
          </div>

          <div className="grid gap-3 rounded-2xl border bg-muted/20 p-4">
            {collectionFieldGuidance(collection) ? (
              <p className="rounded-xl bg-background px-3 py-2 text-sm text-muted-foreground">
                {collectionFieldGuidance(collection)}
              </p>
            ) : null}
            <div className="flex flex-wrap items-end gap-3">
              <Field label="Image">
                <Input value={imageUrl} readOnly placeholder="No image selected" />
              </Field>
              <Button type="button" variant="secondary" onClick={() => setPickerOpen(true)}>
                <ImageIcon data-icon="inline-start" />
                Pick image
              </Button>
              {imageUrl ? (
                <Button type="button" variant="ghost" onClick={() => setImageUrl("")}>
                  Clear image
                </Button>
              ) : null}
            </div>
            {imageUrl ? (
              <div className="aspect-video max-w-md overflow-hidden rounded-xl border bg-background">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
            ) : null}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {locales.map((locale) => {
              const content = localeValue(entry, locale)
              const isEnglish = locale === "en"
              return (
                <div key={locale} className="flex flex-col gap-4 rounded-2xl border bg-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{isEnglish ? "English" : "Chinese"}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {content?.title ? "published exists" : "draft only"}
                    </span>
                  </div>
                  <Field label="Title">
                    <Input
                      name={`${locale}.title`}
                      value={isEnglish ? englishTitle : undefined}
                      defaultValue={isEnglish ? undefined : content?.draftTitle || content?.title}
                      onChange={
                        isEnglish
                          ? (event) => {
                              setEnglishTitle(event.target.value)
                              if (!entry) setSlug(slugifyTitle(event.target.value))
                            }
                          : undefined
                      }
                    />
                  </Field>
                  <Field label="Section Label">
                    <Input
                      name={`${locale}.accent`}
                      value={isEnglish ? englishAccent : undefined}
                      defaultValue={isEnglish ? undefined : content?.draftAccent || content?.accent}
                      onChange={isEnglish ? (event) => setEnglishAccent(event.target.value) : undefined}
                    />
                  </Field>
                  <Field label="Summary">
                    <Textarea
                      name={`${locale}.summary`}
                      value={isEnglish ? englishSummary : undefined}
                      defaultValue={isEnglish ? undefined : content?.draftSummary || content?.summary}
                      onChange={isEnglish ? (event) => setEnglishSummary(event.target.value) : undefined}
                    />
                  </Field>
                  <Field label="Body">
                    <Textarea
                      name={`${locale}.body`}
                      value={isEnglish ? englishBody : undefined}
                      defaultValue={isEnglish ? undefined : content?.draftBody || content?.body}
                      onChange={isEnglish ? (event) => setEnglishBody(event.target.value) : undefined}
                    />
                  </Field>
                  <Field label="Collection fields JSON">
                    <Textarea
                      name={`${locale}.fields`}
                      defaultValue={
                        content
                          ? JSON.stringify(content.draftFields ?? content.fields ?? {}, null, 2)
                          : defaultFieldsJson(collection)
                      }
                    />
                  </Field>
                  <Field label="SEO JSON">
                    <Textarea
                      name={`${locale}.seo`}
                      defaultValue={JSON.stringify(content?.draftSeo ?? content?.seo ?? {}, null, 2)}
                    />
                  </Field>
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="primary">
              <Save data-icon="inline-start" />
              Save draft
            </Button>
          </div>
          </form>

          {entry ? (
            <form action={publishCmsEntry}>
              <input type="hidden" name="id" value={entry.id} />
              <input type="hidden" name="collection" value={entry.collection} />
              <Button type="submit" variant="secondary">
                <Send data-icon="inline-start" />
                Publish draft
              </Button>
            </form>
          ) : null}
        </div>
        <aside className="sticky top-4 h-fit rounded-2xl border bg-muted/20 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                {entry?.status === "published" ? "Live preview" : "Draft preview"}
              </p>
              <p className="text-sm text-muted-foreground">{collectionPreviewLabel(collection)}</p>
            </div>
            <Badge variant={entry?.status === "published" ? "secondary" : "outline"}>
              {entry?.status === "published" ? "Live" : "Not Live"}
            </Badge>
          </div>
          <div className="group overflow-hidden rounded-2xl border border-border bg-background shadow-md">
            {imageUrl ? (
              <div className="aspect-video bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
            ) : null}
            <div className="grid gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-system/10 text-system">
                  <Bot className="size-5" />
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
              </div>
              <div className="grid gap-1.5">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-lg font-semibold text-primary">
                    {englishTitle || "Untitled record"}
                  </span>
                  {englishAccent ? (
                    <span className="text-xs text-muted-foreground">{englishAccent}</span>
                  ) : null}
                </div>
                {englishSummary ? (
                  <p className="text-sm leading-6 text-muted-foreground">{englishSummary}</p>
                ) : null}
                {englishBody ? (
                  <p className="line-clamp-5 text-xs leading-6 text-muted-foreground">{englishBody}</p>
                ) : null}
              </div>
            </div>
          </div>
        </aside>
      </CardContent>

      {pickerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="flex max-h-[85vh] w-full max-w-5xl flex-col gap-4 overflow-hidden rounded-2xl border bg-background p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-normal">Select image</h2>
                <p className="text-sm text-muted-foreground">Images from the aga-website-media bucket.</p>
              </div>
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => setPickerOpen(false)}>
                <X />
              </Button>
            </div>
            <div className="grid gap-3 overflow-y-auto md:grid-cols-3">
              {sortedAssets.length ? (
                sortedAssets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    className="overflow-hidden rounded-xl border bg-background text-left transition-colors hover:border-primary"
                    onClick={() => {
                      setImageUrl(asset.publicUrl)
                      setPickerOpen(false)
                    }}
                  >
                    <div className="aspect-video bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={asset.publicUrl} alt={asset.altText} className="h-full w-full object-cover" />
                    </div>
                    <div className="grid gap-1 p-3 text-sm">
                      <span className="font-semibold">{asset.altText || asset.path}</span>
                      <span className="truncate text-xs text-muted-foreground">{asset.path}</span>
                    </div>
                  </button>
                ))
              ) : (
                <p className="rounded-xl border p-6 text-sm text-muted-foreground">No media uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  )
}
