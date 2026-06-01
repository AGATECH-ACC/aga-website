import { LogoAssetsManager } from "@/components/admin/LogoAssetsManager"
import { LlmsTextForm } from "@/components/admin/LlmsTextForm"
import { SiteStatsForm } from "@/components/admin/SiteStatsForm"
import { TestimonialsManager } from "@/components/admin/TestimonialsManager"
import { Badge } from "@/components/ui/badge"
import { getSiteSettings, listLogoAssets, listTestimonials } from "@/lib/cms/db"

export default async function AdminSiteSettingsPage() {
  const [settings, logos, testimonials] = await Promise.all([
    getSiteSettings(),
    listLogoAssets(),
    listTestimonials(),
  ])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Badge className="w-fit" variant="secondary">
          Homepage CMS
        </Badge>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal">Site Settings</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Manage homepage counters, trust assets, and conversion content without changing component code.
        </p>
      </div>

      <SiteStatsForm stats={settings.stats} />
      <LlmsTextForm value={settings.llmsMarkdown} />
      <LogoAssetsManager logos={logos} />
      <TestimonialsManager testimonials={testimonials} />
    </div>
  )
}
