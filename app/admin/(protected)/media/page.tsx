import { Upload } from "lucide-react"

import { MediaLibraryGrid } from "@/components/admin/MediaLibraryGrid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { uploadCmsMedia } from "@/lib/cms/actions"
import { listMediaAssets } from "@/lib/cms/db"

export default async function AdminMediaPage() {
  const assets = await listMediaAssets()

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Badge className="w-fit" variant="secondary">Storage</Badge>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">Media Library</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Upload public website images into the `aga-website-media` bucket and store alt text for reuse.
        </p>
      </div>

      <Card size="sm">
        <CardHeader className="pb-0">
          <CardTitle>Upload media</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <form action={uploadCmsMedia} className="grid gap-2 md:grid-cols-[1fr_10rem_1fr_1fr_auto]">
            <Input name="file" type="file" required />
            <select name="collection" className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm">
              <option value="products">services</option>
              <option value="industries">industries</option>
              <option value="case-studies">case-studies</option>
              <option value="events">events</option>
              <option value="about">about</option>
              <option value="brand">brand</option>
            </select>
            <Input name="altText" placeholder="Alt text" />
            <Input name="notes" placeholder="Usage notes" />
            <Button type="submit" size="sm" variant="primary">
              <Upload data-icon="inline-start" />
              Upload
            </Button>
          </form>
        </CardContent>
      </Card>

      <MediaLibraryGrid assets={assets} />
    </div>
  )
}
