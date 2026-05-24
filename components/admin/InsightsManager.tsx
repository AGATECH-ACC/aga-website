"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  createInsightDraft,
  deleteInsight,
  setInsightFeatured,
  setInsightStatus,
} from "@/lib/cms/actions"
import type { CmsInsight } from "@/lib/cms/types"

function formatDate(value: string | null) {
  if (!value) return "Not saved"

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function completionTone(insight: CmsInsight) {
  if (insight.titleEn && insight.titleZh) return "bg-emerald-500"
  if (insight.titleEn) return "bg-amber-500"
  return "bg-muted-foreground"
}

function CompletionIndicator({ insight }: { insight: CmsInsight }) {
  const label = insight.titleEn && insight.titleZh ? "EN + ZH" : insight.titleEn ? "EN only" : "Empty"

  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
      <span className={`size-2.5 rounded-full ${completionTone(insight)}`} />
      {label}
    </span>
  )
}

export function InsightsManager({ insights }: { insights: CmsInsight[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <CardTitle>Insights / Blog</CardTitle>
        <form action={createInsightDraft}>
          <Button type="submit" variant="primary" size="sm">
            <Plus data-icon="inline-start" />
            New
          </Button>
        </form>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {insights.length ? (
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="border-b text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="py-3 pr-4 font-semibold">Cover</th>
                <th className="py-3 pr-4 font-semibold">Title</th>
                <th className="py-3 pr-4 font-semibold">Category</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 pr-4 font-semibold">Featured</th>
                <th className="py-3 pr-4 font-semibold">EN / ZH</th>
                <th className="py-3 pr-4 font-semibold">Last Modified</th>
                <th className="py-3 pr-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {insights.map((insight) => (
                <tr key={insight.id} className="border-b last:border-0">
                  <td className="py-3 pr-4">
                    <div className="relative size-10 overflow-hidden rounded-lg border bg-muted">
                      {insight.coverImage ? (
                        <Image src={insight.coverImage} alt="" fill sizes="40px" className="object-cover" />
                      ) : null}
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-medium">{insight.titleEn || "Untitled insight"}</td>
                  <td className="py-3 pr-4">
                    {insight.category ? <Badge variant="outline">{insight.category}</Badge> : <span className="text-muted-foreground">-</span>}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={insight.isActive ? "secondary" : "outline"}>
                      {insight.isActive ? "Live" : "Draft"}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <form action={setInsightFeatured}>
                      <input type="hidden" name="id" value={insight.id} />
                      <input type="hidden" name="isFeatured" value={String(!insight.isFeatured)} />
                      <Button type="submit" size="sm" variant={insight.isFeatured ? "primary" : "outline"}>
                        {insight.isFeatured ? "On" : "Off"}
                      </Button>
                    </form>
                  </td>
                  <td className="py-3 pr-4">
                    <CompletionIndicator insight={insight} />
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{formatDate(insight.updatedAt)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <Button asChild type="button" size="sm" variant="secondary">
                        <Link href={`/admin/insights/${insight.id}`}>
                          <Pencil data-icon="inline-start" />
                          Edit
                        </Link>
                      </Button>
                      <Button asChild type="button" size="sm" variant="ghost">
                        <Link href={`/api/preview/insight?locale=en&slug=${encodeURIComponent(insight.slug)}`} target="_blank">
                          <ExternalLink data-icon="inline-start" />
                          Preview
                        </Link>
                      </Button>
                      <form action={setInsightStatus}>
                        <input type="hidden" name="id" value={insight.id} />
                        <input type="hidden" name="isActive" value={String(!insight.isActive)} />
                        <Button type="submit" size="sm" variant="outline">
                          {insight.isActive ? "Set Draft" : "Set Live"}
                        </Button>
                      </form>
                      <form action={deleteInsight}>
                        <input type="hidden" name="id" value={insight.id} />
                        <Button
                          type="submit"
                          variant="danger"
                          size="sm"
                          onClick={(event) => {
                            if (!window.confirm(`Delete "${insight.titleEn}"? This cannot be undone.`)) {
                              event.preventDefault()
                            }
                          }}
                        >
                          <Trash2 data-icon="inline-start" />
                          Delete
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="rounded-xl border p-4 text-sm text-muted-foreground">
            No insights yet. Use New to add the first record.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
