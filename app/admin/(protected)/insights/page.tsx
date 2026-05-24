import { InsightsManager } from "@/components/admin/InsightsManager"
import { Badge } from "@/components/ui/badge"
import { listInsights } from "@/lib/cms/db"

export default async function AdminInsightsPage() {
  const insights = await listInsights()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Badge className="w-fit" variant="secondary">
          Editorial CMS
        </Badge>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal">Insights</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Add, edit, hide, and delete blog-style insight cards that appear on the public Insights page.
        </p>
      </div>

      <InsightsManager insights={insights} />
    </div>
  )
}
