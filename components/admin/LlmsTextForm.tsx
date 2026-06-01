import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { saveLlmsMarkdown } from "@/lib/cms/actions"

export function LlmsTextForm({ value }: { value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI crawler guide /llms.txt</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={saveLlmsMarkdown} className="flex flex-col gap-4">
          <textarea
            name="llms_markdown"
            defaultValue={value}
            className="min-h-[28rem] w-full rounded-xl border border-input bg-background px-4 py-3 font-mono text-sm leading-6 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <p className="text-sm text-muted-foreground">
            This publishes the markdown returned at <span className="font-semibold text-foreground">/llms.txt</span>.
          </p>
          <Button type="submit" variant="primary" className="w-fit">
            Save llms.txt
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
