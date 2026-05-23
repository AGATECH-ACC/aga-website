import { redirect } from "next/navigation"

import { AdminShell } from "@/components/admin/AdminShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentAdmin } from "@/lib/cms/db"

export const dynamic = "force-dynamic"

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, admin, configured } = await getCurrentAdmin()

  if (!configured) {
    return (
      <main className="grid min-h-screen place-items-center bg-muted/30 p-6">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Supabase is not configured</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
            `SUPABASE_SERVICE_ROLE_KEY`, then run the SQL in
            `supabase/cms_schema.sql`.
          </CardContent>
        </Card>
      </main>
    )
  }

  if (!user || !admin) {
    redirect("/admin/login")
  }

  return <AdminShell email={user.email}>{children}</AdminShell>
}
