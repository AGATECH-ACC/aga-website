"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Bold,
  Calendar,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  LinkIcon,
  ListPlus,
  Quote,
  Save,
  Send,
  Table,
  Trash2,
  Upload,
} from "lucide-react"
import { useRef, useState, useTransition } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  deleteInsight,
  publishInsightNow,
  saveInsight,
  uploadInsightImage,
} from "@/lib/cms/actions"
import { slugifyTitle } from "@/lib/cms/slug.mjs"
import type { CmsInsight } from "@/lib/cms/types"

type LocaleTab = "en" | "zh"
type FaqPair = { question: string; answer: string }

const categories = [
  "SME Insights",
  "AI & Automation",
  "Case Studies",
  "Operations",
  "Finance",
  "Sales",
]

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

function CharCounter({ value, max }: { value: string; max: number }) {
  return (
    <span className={value.length > max ? "text-destructive" : "text-muted-foreground"}>
      {value.length}/{max}
    </span>
  )
}

export function InsightEditor({ insight }: { insight: CmsInsight }) {
  const [activeTab, setActiveTab] = useState<LocaleTab>("en")
  const [isPending, startTransition] = useTransition()
  const [uploadStatus, setUploadStatus] = useState("")
  const [coverImage, setCoverImage] = useState(insight.coverImage)
  const [authorImage, setAuthorImage] = useState(insight.authorImage)
  const [titleEn, setTitleEn] = useState(insight.titleEn)
  const [titleZh, setTitleZh] = useState(insight.titleZh)
  const [summaryEn, setSummaryEn] = useState(insight.summaryEn)
  const [summaryZh, setSummaryZh] = useState(insight.summaryZh)
  const [bodyEn, setBodyEn] = useState(insight.bodyEn)
  const [bodyZh, setBodyZh] = useState(insight.bodyZh)
  const [seoTitleEn, setSeoTitleEn] = useState(insight.seoTitleEn)
  const [seoTitleZh, setSeoTitleZh] = useState(insight.seoTitleZh)
  const [metaDescriptionEn, setMetaDescriptionEn] = useState(insight.metaDescriptionEn)
  const [metaDescriptionZh, setMetaDescriptionZh] = useState(insight.metaDescriptionZh)
  const [slug, setSlug] = useState(insight.slug)
  const [faqEn, setFaqEn] = useState<FaqPair[]>(insight.faqEn.length ? insight.faqEn : [{ question: "", answer: "" }])
  const [faqZh, setFaqZh] = useState<FaqPair[]>(insight.faqZh.length ? insight.faqZh : [{ question: "", answer: "" }])
  const bodyEnRef = useRef<HTMLTextAreaElement>(null)
  const bodyZhRef = useRef<HTMLTextAreaElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const toolbarImageInputRef = useRef<HTMLInputElement>(null)
  const authorInputRef = useRef<HTMLInputElement>(null)

  const readingTime = Math.max(1, Math.ceil(bodyEn.split(/\s+/).filter(Boolean).length / 200))

  async function uploadFile(file: File, mode: "cover" | "body" | "author" = "body") {
    setUploadStatus("Uploading image...")
    const formData = new FormData()
    formData.set("id", insight.id)
    formData.set("file", file)

    startTransition(async () => {
      try {
        const result = await uploadInsightImage(formData)
        const markdown = `![${file.name.replace(/\.[^.]+$/, "")}](${result.url})`
        if (mode === "cover") setCoverImage(result.url)
        if (mode === "author") setAuthorImage(result.url)
        if (mode !== "author") insertMarkdown(markdown)
        setUploadStatus("Upload complete")
        window.setTimeout(() => setUploadStatus(""), 1600)
      } catch (error) {
        setUploadStatus(error instanceof Error ? error.message : "Upload failed")
      }
    })
  }

  function activeBodyRef() {
    return activeTab === "en" ? bodyEnRef.current : bodyZhRef.current
  }

  function updateActiveBody(value: string) {
    if (activeTab === "en") setBodyEn(value)
    else setBodyZh(value)
  }

  function insertMarkdown(markdown: string) {
    const textarea = activeBodyRef()
    const current = activeTab === "en" ? bodyEn : bodyZh
    if (!textarea) {
      updateActiveBody(`${current}\n${markdown}`)
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const next = `${current.slice(0, start)}${markdown}${current.slice(end)}`
    updateActiveBody(next)
    window.requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(start + markdown.length, start + markdown.length)
    })
  }

  function wrapMarkdown(prefix: string, suffix = "") {
    const textarea = activeBodyRef()
    const current = activeTab === "en" ? bodyEn : bodyZh
    const start = textarea?.selectionStart ?? current.length
    const end = textarea?.selectionEnd ?? current.length
    const selected = current.slice(start, end) || "text"
    const next = `${current.slice(0, start)}${prefix}${selected}${suffix}${current.slice(end)}`
    updateActiveBody(next)
  }

  function updateFaq(locale: LocaleTab, index: number, field: keyof FaqPair, value: string) {
    const setter = locale === "en" ? setFaqEn : setFaqZh
    const rows = locale === "en" ? faqEn : faqZh
    setter(rows.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)))
  }

  function removeFaq(locale: LocaleTab, index: number) {
    const setter = locale === "en" ? setFaqEn : setFaqZh
    const rows = locale === "en" ? faqEn : faqZh
    setter(rows.filter((_, rowIndex) => rowIndex !== index))
  }

  function addFaq(locale: LocaleTab) {
    const setter = locale === "en" ? setFaqEn : setFaqZh
    const rows = locale === "en" ? faqEn : faqZh
    setter([...rows, { question: "", answer: "" }])
  }

  return (
    <form
      action={saveInsight}
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        const file = Array.from(event.dataTransfer.files).find((item) => item.type.startsWith("image/"))
        if (file) void uploadFile(file, "cover")
      }}
      onPaste={(event) => {
        const file = Array.from(event.clipboardData.files).find((item) => item.type.startsWith("image/"))
        if (file) void uploadFile(file, "cover")
      }}
    >
      <input type="hidden" name="id" value={insight.id} />
      <input type="hidden" name="coverImage" value={coverImage} />
      <input type="hidden" name="authorImage" value={authorImage} />
      <input type="hidden" name="readingTimeMinutes" value={readingTime} />

      <div className="grid gap-5">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Insight editor</CardTitle>
              <div className="flex rounded-xl border bg-muted p-1">
                {(["en", "zh"] as LocaleTab[]).map((locale) => (
                  <button
                    key={locale}
                    type="button"
                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${activeTab === locale ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                    onClick={() => setActiveTab(locale)}
                  >
                    {locale.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-3 rounded-2xl border bg-muted/20 p-4">
              <div className="flex flex-wrap items-end gap-3">
                <Field label="Cover image">
                  <Input value={coverImage} readOnly placeholder="No cover image selected" />
                </Field>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) void uploadFile(file, "cover")
                  }}
                />
                <Button type="button" variant="secondary" onClick={() => coverInputRef.current?.click()}>
                  <Upload data-icon="inline-start" />
                  Upload cover
                </Button>
              </div>
              {coverImage ? (
                <div className="relative aspect-[16/9] max-w-xl overflow-hidden rounded-2xl border bg-background">
                  <Image src={coverImage} alt="" fill sizes="640px" className="object-cover" />
                </div>
              ) : null}
              <p className="text-xs text-muted-foreground">
                Drag an image anywhere on this editor or paste from clipboard. Uploads insert markdown into the active body.
              </p>
              {uploadStatus ? <p className="text-sm font-semibold text-primary">{uploadStatus}</p> : null}
            </div>

            {activeTab === "en" ? (
              <LocaleFields
                locale="en"
                title={titleEn}
                setTitle={(value) => {
                  setTitleEn(value)
                  if (!slug || slug.startsWith("draft-")) setSlug(slugifyTitle(value))
                }}
                summary={summaryEn}
                setSummary={setSummaryEn}
                body={bodyEn}
                setBody={setBodyEn}
                bodyRef={bodyEnRef}
                seoTitle={seoTitleEn}
                setSeoTitle={setSeoTitleEn}
                metaDescription={metaDescriptionEn}
                setMetaDescription={setMetaDescriptionEn}
                insertMarkdown={insertMarkdown}
                wrapMarkdown={wrapMarkdown}
                imageInputRef={toolbarImageInputRef}
                onToolbarImage={(file) => uploadFile(file, "body")}
              />
            ) : (
              <LocaleFields
                locale="zh"
                title={titleZh}
                setTitle={setTitleZh}
                summary={summaryZh}
                setSummary={setSummaryZh}
                body={bodyZh}
                setBody={setBodyZh}
                bodyRef={bodyZhRef}
                seoTitle={seoTitleZh}
                setSeoTitle={setSeoTitleZh}
                metaDescription={metaDescriptionZh}
                setMetaDescription={setMetaDescriptionZh}
                insertMarkdown={insertMarkdown}
                wrapMarkdown={wrapMarkdown}
                imageInputRef={toolbarImageInputRef}
                onToolbarImage={(file) => uploadFile(file, "body")}
              />
            )}
          </CardContent>
        </Card>

        <FaqEditor locale="en" rows={faqEn} addFaq={addFaq} removeFaq={removeFaq} updateFaq={updateFaq} />
        <FaqEditor locale="zh" rows={faqZh} addFaq={addFaq} removeFaq={removeFaq} updateFaq={updateFaq} />
      </div>

      <aside className="grid h-fit gap-4 xl:sticky xl:top-4">
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <label className="flex items-center justify-between gap-3 rounded-xl border p-3 text-sm font-semibold">
              Status
              <span className="inline-flex items-center gap-2">
                Draft
                <input name="isActive" type="checkbox" defaultChecked={insight.isActive} />
                Live
              </span>
            </label>
            <label className="flex items-center justify-between gap-3 rounded-xl border p-3 text-sm font-semibold">
              Featured
              <input name="isFeatured" type="checkbox" defaultChecked={insight.isFeatured} />
            </label>
            <Field label="Publish date">
              <Input
                name="publishedAt"
                type="datetime-local"
                defaultValue={insight.publishedAt ? insight.publishedAt.slice(0, 16) : ""}
              />
            </Field>
            <Field label="Category">
              <select name="category" defaultValue={insight.category} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </Field>
            <Field label="Tags">
              <Input name="tags" defaultValue={insight.tags.join(", ")} placeholder="operations, AI, sales" />
            </Field>
            <Field label="Author name">
              <Input name="authorName" defaultValue={insight.authorName} />
            </Field>
            <Field label="Author title">
              <Input name="authorTitle" defaultValue={insight.authorTitle} placeholder="Executive Director, AGA Ventures" />
            </Field>
            <Field label="Author image">
              <div className="flex gap-2">
                <Input value={authorImage} readOnly placeholder="No author image" />
                <input
                  ref={authorInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) void uploadFile(file, "author")
                  }}
                />
                <Button type="button" variant="secondary" onClick={() => authorInputRef.current?.click()}>
                  <ImageIcon className="size-4" />
                </Button>
              </div>
            </Field>
            <Field label="Reading time">
              <Input value={`${readingTime} min`} readOnly />
            </Field>
            <Field label="Display order">
              <Input name="displayOrder" type="number" defaultValue={insight.displayOrder} />
            </Field>
            <Field label="Slug">
              <Input name="slug" value={slug} onChange={(event) => setSlug(slugifyTitle(event.target.value))} required />
            </Field>

            <div className="grid gap-2 pt-2">
              <Button type="submit" variant="secondary" disabled={isPending}>
                <Save data-icon="inline-start" />
                Save Draft
              </Button>
              <Button type="submit" variant="primary" formAction={publishInsightNow} disabled={isPending}>
                <Send data-icon="inline-start" />
                Publish Now
              </Button>
              <Button asChild type="button" variant="outline">
                <Link href={`/api/preview/insight?locale=en&slug=${encodeURIComponent(slug)}`} target="_blank">
                  Preview EN
                </Link>
              </Button>
              <Button asChild type="button" variant="outline">
                <Link href={`/api/preview/insight?locale=zh&slug=${encodeURIComponent(slug)}`} target="_blank">
                  Preview ZH
                </Link>
              </Button>
              <Button
                type="submit"
                variant="danger"
                formAction={deleteInsight}
                onClick={(event) => {
                  if (!window.confirm(`Delete "${titleEn || slug}"? This cannot be undone.`)) {
                    event.preventDefault()
                  }
                }}
              >
                <Trash2 data-icon="inline-start" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </aside>
    </form>
  )
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button type="button" size="sm" variant="outline" aria-label={label} onClick={onClick}>
      {children}
    </Button>
  )
}

function LocaleFields({
  locale,
  title,
  setTitle,
  summary,
  setSummary,
  body,
  setBody,
  bodyRef,
  seoTitle,
  setSeoTitle,
  metaDescription,
  setMetaDescription,
  insertMarkdown,
  wrapMarkdown,
  imageInputRef,
  onToolbarImage,
}: {
  locale: LocaleTab
  title: string
  setTitle: (value: string) => void
  summary: string
  setSummary: (value: string) => void
  body: string
  setBody: (value: string) => void
  bodyRef: React.RefObject<HTMLTextAreaElement | null>
  seoTitle: string
  setSeoTitle: (value: string) => void
  metaDescription: string
  setMetaDescription: (value: string) => void
  insertMarkdown: (markdown: string) => void
  wrapMarkdown: (prefix: string, suffix?: string) => void
  imageInputRef: React.RefObject<HTMLInputElement | null>
  onToolbarImage: (file: File) => void
}) {
  const suffix = locale.toUpperCase()

  return (
    <div className="grid gap-4">
      <Field label={`Title ${suffix}`}>
        <Input name={`title${suffix === "EN" ? "En" : "Zh"}`} value={title} onChange={(event) => setTitle(event.target.value)} required={locale === "en"} />
      </Field>
      <Field label={`Summary ${suffix}`}>
        <Textarea
          name={`summary${suffix === "EN" ? "En" : "Zh"}`}
          value={summary}
          maxLength={200}
          onChange={(event) => setSummary(event.target.value)}
        />
        <CharCounter value={summary} max={200} />
      </Field>
      <div className="grid gap-2">
        <div className="flex flex-wrap gap-2">
          <ToolbarButton label="H2" onClick={() => insertMarkdown("\n## Heading\n")}>
            <Heading2 className="size-4" />
          </ToolbarButton>
          <ToolbarButton label="H3" onClick={() => insertMarkdown("\n### Heading\n")}>
            <Heading3 className="size-4" />
          </ToolbarButton>
          <ToolbarButton label="Bold" onClick={() => wrapMarkdown("**", "**")}>
            <Bold className="size-4" />
          </ToolbarButton>
          <ToolbarButton label="Italic" onClick={() => wrapMarkdown("_", "_")}>
            <Italic className="size-4" />
          </ToolbarButton>
          <ToolbarButton label="Quote" onClick={() => insertMarkdown("\n> Quote\n")}>
            <Quote className="size-4" />
          </ToolbarButton>
          <ToolbarButton label="Table" onClick={() => insertMarkdown("\n| Column | Column |\n| --- | --- |\n| Value | Value |\n")}>
            <Table className="size-4" />
          </ToolbarButton>
          <ToolbarButton label="Image" onClick={() => imageInputRef.current?.click()}>
            <ImageIcon className="size-4" />
          </ToolbarButton>
          <ToolbarButton label="Link" onClick={() => insertMarkdown("[Link text](https://)")}>
            <LinkIcon className="size-4" />
          </ToolbarButton>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onToolbarImage(file)
            }}
          />
        </div>
        <Field label={`Body ${suffix}`}>
          <Textarea
            ref={bodyRef}
            name={`body${suffix === "EN" ? "En" : "Zh"}`}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="min-h-[26rem] w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </Field>
      </div>
      <Field label={`SEO title ${suffix}`}>
        <Input name={`seoTitle${suffix === "EN" ? "En" : "Zh"}`} value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} />
      </Field>
      <Field label={`Meta description ${suffix}`}>
        <Textarea
          name={`metaDescription${suffix === "EN" ? "En" : "Zh"}`}
          value={metaDescription}
          maxLength={160}
          onChange={(event) => setMetaDescription(event.target.value)}
        />
        <CharCounter value={metaDescription} max={160} />
      </Field>
    </div>
  )
}

function FaqEditor({
  locale,
  rows,
  addFaq,
  removeFaq,
  updateFaq,
}: {
  locale: LocaleTab
  rows: FaqPair[]
  addFaq: (locale: LocaleTab) => void
  removeFaq: (locale: LocaleTab, index: number) => void
  updateFaq: (locale: LocaleTab, index: number, field: keyof FaqPair, value: string) => void
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div>
          <Badge variant="outline">{locale.toUpperCase()}</Badge>
          <CardTitle className="mt-2">FAQ</CardTitle>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={() => addFaq(locale)}>
          <ListPlus data-icon="inline-start" />
          Add FAQ
        </Button>
      </CardHeader>
      <CardContent className="grid gap-3">
        {rows.map((row, index) => (
          <div key={index} className="grid gap-3 rounded-2xl border bg-muted/20 p-3 md:grid-cols-[1fr_1fr_auto]">
            <Input
              name={`faq_${locale}_question`}
              value={row.question}
              placeholder={`Question (${locale.toUpperCase()})`}
              onChange={(event) => updateFaq(locale, index, "question", event.target.value)}
            />
            <Input
              name={`faq_${locale}_answer`}
              value={row.answer}
              placeholder={`Answer (${locale.toUpperCase()})`}
              onChange={(event) => updateFaq(locale, index, "answer", event.target.value)}
            />
            <Button type="button" variant="danger" size="sm" onClick={() => removeFaq(locale, index)}>
              Remove
            </Button>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          Stored as <code>faq_{locale}</code> JSONB arrays.
        </p>
        <div className="hidden">
          <Calendar className="size-4" />
        </div>
      </CardContent>
    </Card>
  )
}
