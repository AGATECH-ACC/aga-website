import Link from "next/link"
import { notFound } from "next/navigation"

import { InsightEditor } from "@/components/admin/InsightEditor"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getInsightById } from "@/lib/cms/db"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function AdminInsightEditorPage({ params }: PageProps) {
  const { id } = await params
  const insight = await getInsightById(id)

  if (!insight) {
    notFound()
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge className="w-fit" variant="secondary">
            Editorial CMS
          </Badge>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">
            {insight.titleEn || "Untitled insight"}
          </h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Edit bilingual article content, SEO, publishing controls, author details, and preview links.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/insights">Back to insights</Link>
        </Button>
      </div>

      <InsightEditor insight={insight} />
    </div>
  )
}
