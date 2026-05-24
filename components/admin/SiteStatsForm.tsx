import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { saveSiteStats } from "@/lib/cms/actions"
import type { CmsSiteStats } from "@/lib/cms/types"

function StatField({
  label,
  numberName,
  suffixName,
  value,
}: {
  label: string
  numberName: string
  suffixName: string
  value: { number: number; suffix: string }
}) {
  return (
    <div className="grid gap-3 rounded-xl border bg-muted/20 p-4 md:grid-cols-[1fr_10rem_7rem] md:items-end">
      <label className="flex flex-col gap-2 text-sm font-semibold">
        Field
        <span className="rounded-lg border bg-background px-3 py-2 text-muted-foreground">{label}</span>
      </label>
      <label className="flex flex-col gap-2 text-sm font-semibold">
        Number
        <Input name={numberName} type="number" min={0} defaultValue={value.number} />
      </label>
      <label className="flex flex-col gap-2 text-sm font-semibold">
        Suffix
        <Input name={suffixName} defaultValue={value.suffix} />
      </label>
    </div>
  )
}

export function SiteStatsForm({ stats }: { stats: CmsSiteStats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Homepage stat counters</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={saveSiteStats} className="flex flex-col gap-4">
          <StatField
            label="stat_counter_analyses"
            numberName="stat_counter_analyses_number"
            suffixName="stat_counter_analyses_suffix"
            value={stats.statCounterAnalyses}
          />
          <StatField
            label="stat_counter_automation_pct"
            numberName="stat_counter_automation_pct_number"
            suffixName="stat_counter_automation_pct_suffix"
            value={stats.statCounterAutomationPct}
          />
          <StatField
            label="stat_counter_modules"
            numberName="stat_counter_modules_number"
            suffixName="stat_counter_modules_suffix"
            value={stats.statCounterModules}
          />
          <Button type="submit" variant="primary" className="w-fit">
            Save counters
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
