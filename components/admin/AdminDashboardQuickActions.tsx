"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import type { CmsCollection, CmsMediaAsset } from "@/lib/cms/types"

import { CmsEntryForm } from "./CmsEntryForm"

const actions: Array<{ label: string; collection: CmsCollection }> = [
  { label: "New Service", collection: "products" },
  { label: "New Case Study", collection: "case_studies" },
  { label: "New Event", collection: "events" },
]

export function AdminDashboardQuickActions({ mediaAssets }: { mediaAssets: CmsMediaAsset[] }) {
  const [collection, setCollection] = useState<CmsCollection>("products")

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.collection}
            type="button"
            variant={collection === action.collection ? "primary" : "secondary"}
            onClick={() => setCollection(action.collection)}
          >
            <Plus data-icon="inline-start" />
            {action.label}
          </Button>
        ))}
      </div>
      <CmsEntryForm key={collection} collection={collection} mediaAssets={mediaAssets} />
    </div>
  )
}
