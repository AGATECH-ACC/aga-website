import { Save, Send } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { publishCmsEntry, saveCmsEntry } from "@/lib/cms/actions"
import type { CmsCollection, CmsEntry, CmsLocale } from "@/lib/cms/types"

const locales: CmsLocale[] = ["en", "zh"]

function localeValue(entry: CmsEntry | undefined, locale: CmsLocale) {
  return entry?.locales.find((item) => item.locale === locale)
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

export function CmsEntryForm({
  collection,
  entry,
}: {
  collection: CmsCollection
  entry?: CmsEntry
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{entry ? entry.slug : "New entry"}</CardTitle>
        {entry ? <Badge variant="secondary">{entry.status}</Badge> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <form action={saveCmsEntry} className="flex flex-col gap-6">
          <input type="hidden" name="collection" value={collection} />
          {entry ? <input type="hidden" name="id" value={entry.id} /> : null}

          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Slug">
              <Input name="slug" defaultValue={entry?.slug} placeholder="business-systemization" required />
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

          <div className="grid gap-5 lg:grid-cols-2">
            {locales.map((locale) => {
              const content = localeValue(entry, locale)
              return (
                <div key={locale} className="flex flex-col gap-4 rounded-2xl border bg-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{locale === "en" ? "English" : "Chinese"}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {content?.title ? "published exists" : "draft only"}
                    </span>
                  </div>
                  <Field label="Title">
                    <Input name={`${locale}.title`} defaultValue={content?.draftTitle || content?.title} />
                  </Field>
                  <Field label="Accent / Eyebrow">
                    <Input name={`${locale}.accent`} defaultValue={content?.draftAccent || content?.accent} />
                  </Field>
                  <Field label="Summary">
                    <Textarea name={`${locale}.summary`} defaultValue={content?.draftSummary || content?.summary} />
                  </Field>
                  <Field label="Body">
                    <Textarea name={`${locale}.body`} defaultValue={content?.draftBody || content?.body} />
                  </Field>
                  <Field label="Collection fields JSON">
                    <Textarea
                      name={`${locale}.fields`}
                      defaultValue={JSON.stringify(content?.draftFields ?? content?.fields ?? {}, null, 2)}
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
      </CardContent>
    </Card>
  )
}
