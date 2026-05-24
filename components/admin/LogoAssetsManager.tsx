"use client"

import { Plus, Trash2, Upload, X } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { deleteLogoAsset, setLogoAssetStatus, uploadLogoAsset } from "@/lib/cms/actions"
import type { CmsLogoAsset } from "@/lib/cms/types"

function LogoUploadForm({ onClose }: { onClose?: () => void }) {
  return (
    <form action={uploadLogoAsset} className="grid gap-4">
      <Input name="name" placeholder="Logo name" required />
      <Input name="file" type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" required />
      <Input name="linkUrl" placeholder="Optional link URL" />
      <Input name="displayOrder" type="number" defaultValue={0} />
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input name="isActive" type="checkbox" defaultChecked />
        Live
      </label>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="primary">
          <Upload data-icon="inline-start" />
          Upload logo
        </Button>
        {onClose ? (
          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
        ) : null}
      </div>
    </form>
  )
}

export function LogoAssetsManager({ logos }: { logos: CmsLogoAsset[] }) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <CardTitle>Trusted logo strip</CardTitle>
        <Button type="button" variant="primary" size="sm" onClick={() => setModalOpen(true)}>
          <Plus data-icon="inline-start" />
          New
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
          {logos.length ? (
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="py-3 pr-4 font-semibold">Logo</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 pr-4 font-semibold">Link</th>
                  <th className="py-3 pr-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logos.map((logo) => (
                  <tr key={logo.id} className="border-b last:border-0">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-28 place-items-center rounded-lg bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logo.imageUrl} alt={logo.name} className="max-h-8 max-w-20 object-contain grayscale" />
                        </div>
                        <div>
                          <p className="font-medium">{logo.name}</p>
                          <p className="text-xs text-muted-foreground">Order {logo.displayOrder}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={logo.isActive ? "secondary" : "outline"}>{logo.isActive ? "Live" : "Not Live"}</Badge>
                    </td>
                    <td className="max-w-xs truncate py-3 pr-4 text-muted-foreground">{logo.linkUrl || "No link"}</td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <form action={setLogoAssetStatus}>
                          <input type="hidden" name="id" value={logo.id} />
                          <input type="hidden" name="isActive" value={String(!logo.isActive)} />
                          <Button type="submit" size="sm" variant="outline">
                            {logo.isActive ? "Set Not Live" : "Set Live"}
                          </Button>
                        </form>
                        <form action={deleteLogoAsset}>
                          <input type="hidden" name="id" value={logo.id} />
                          <input type="hidden" name="storagePath" value={logo.storagePath} />
                          <Button
                            type="submit"
                            variant="danger"
                            size="sm"
                            onClick={(event) => {
                              if (!window.confirm(`Delete "${logo.name}"? This cannot be undone.`)) {
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
              No logos uploaded yet. Use New to upload the first logo.
            </p>
          )}
      </CardContent>
      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-4">
          <div className="w-full max-w-xl rounded-2xl border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-xl font-semibold tracking-normal">New logo</h2>
                <p className="text-sm text-muted-foreground">Uploaded logos preview as grayscale on the live strip.</p>
              </div>
              <Button type="button" size="icon-sm" variant="ghost" onClick={() => setModalOpen(false)}>
                <X />
              </Button>
            </div>
            <div className="p-5">
              <LogoUploadForm onClose={() => setModalOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  )
}
