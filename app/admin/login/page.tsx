import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { signInAdmin } from "@/lib/cms/actions"

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
          <CardTitle>Sign in with passcode</CardTitle>
          <CardDescription>
            Authorized admin emails can manage website drafts, publishing, and media. No email magic link required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "missing-config" ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Admin passcode or Supabase server env vars are missing.
            </div>
          ) : null}
          {status === "invalid" ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Email or passcode is incorrect.
            </div>
          ) : null}
          {status === "unauthorized" ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              This email is not active in the admin allowlist.
            </div>
          ) : null}
          {status === "lookup-error" ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Admin allowlist lookup failed. Please try again in a moment.
            </div>
          ) : null}
          <form action={signInAdmin} className="mt-5 flex flex-col gap-3">
            <Input name="email" type="email" placeholder="admin@agaventures.ai" required />
            <Input name="passcode" type="password" placeholder="Admin passcode" required />
            <Button type="submit" variant="primary">Sign in</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
