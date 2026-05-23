import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { sendLoginLink } from "@/lib/cms/actions"

type LoginPageProps = {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { status } = await searchParams

  return (
    <main className="grid min-h-screen place-items-center bg-muted/30 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Badge className="w-fit" variant="secondary">AGA Admin</Badge>
          <CardTitle>Sign in with email</CardTitle>
          <CardDescription>
            Authorized admin emails can manage website drafts, publishing, and media.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "check-email" ? (
            <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
              Check your email for the magic login link.
            </div>
          ) : null}
          {status === "missing-config" ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Supabase env vars are missing.
            </div>
          ) : null}
          <form action={sendLoginLink} className="mt-5 flex flex-col gap-3">
            <input type="hidden" name="origin" value={process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"} />
            <Input name="email" type="email" placeholder="admin@agaventures.ai" required />
            <Button type="submit" variant="primary">Send login link</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
