"use client"

import { Copy, Trash2 } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { deleteCmsMedia } from "@/lib/cms/actions"
import type { CmsMediaAsset } from "@/lib/cms/types"

function formatBytes(value: number | null) {
  if (!value) return "Size unavailable"
  const units = ["B", "KB", "MB", "GB"]
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1)
  return `${(value / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`
}

function MediaCard({ asset }: { asset: CmsMediaAsset }) {
  const hasImageUrl = Boolean(asset.publicUrl)
  const [dimensions, setDimensions] = useState(hasImageUrl ? "Loading dimensions" : "No public image")
  const [copied, setCopied] = useState(false)

  return (
    <Card>
      <div className="aspect-video overflow-hidden rounded-t-xl bg-muted">
        {hasImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset.publicUrl}
            alt={asset.altText}
            className="h-full w-full object-cover"
            onLoad={(event) => {
              setDimensions(`${event.currentTarget.naturalWidth} x ${event.currentTarget.naturalHeight}px`)
            }}
            onError={() => setDimensions("Dimensions unavailable")}
          />
        ) : (
          <div className="grid h-full place-items-center px-4 text-center text-sm font-medium text-muted-foreground">
            CMS metadata record
          </div>
        )}
      </div>
      <CardContent className="flex flex-col gap-3 p-4 text-sm">
        <div className="grid gap-1">
          <p className="font-semibold">{asset.altText || asset.path}</p>
          <p className="break-all text-muted-foreground">{asset.publicUrl || asset.path}</p>
          <p className="text-xs text-muted-foreground">
            {dimensions} · {formatBytes(asset.sizeBytes)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="w-fit" variant="outline">
            {asset.collection ?? "media"}
          </Badge>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={!hasImageUrl}
            onClick={async () => {
              if (!hasImageUrl) return
              await navigator.clipboard.writeText(asset.publicUrl)
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1600)
            }}
          >
            <Copy data-icon="inline-start" />
            {copied ? "Copied" : "Copy URL"}
          </Button>
          <form action={deleteCmsMedia}>
            <input type="hidden" name="id" value={asset.id} />
            <input type="hidden" name="path" value={asset.path} />
            <Button
              type="submit"
              size="sm"
              variant="danger"
              onClick={(event) => {
                if (!window.confirm(`Delete "${asset.path}"? This removes it from storage and the media library.`)) {
                  event.preventDefault()
                }
              }}
            >
              <Trash2 data-icon="inline-start" />
              Delete
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

export function MediaLibraryGrid({ assets }: { assets: CmsMediaAsset[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {assets.length ? (
        assets.map((asset) => <MediaCard key={asset.id} asset={asset} />)
      ) : (
        <Card>
          <CardContent className="p-8 text-muted-foreground">No media uploaded yet.</CardContent>
        </Card>
      )}
    </div>
  )
}
