import Link from "next/link"
import {
  ArrowRight,
  Bot,
  ChartNoAxesColumnIncreasing,
  MessageSquare,
  Settings2,
  Workflow,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const productIcons = {
  workflow: Settings2,
  operations: Workflow,
  sales: MessageSquare,
  finance: ChartNoAxesColumnIncreasing,
  ai: Bot,
} as const

type ProductItem = {
  name: string
  tagline: string
  description: string
  href: string
  visualKind: keyof typeof productIcons
}

type ProductGridProps = {
  products?: ProductItem[]
  cta?: string
  ctaHref?: string
}

export function ProductGrid({ products = [], cta, ctaHref }: ProductGridProps) {
  if (!products.length) return null

  const [featured, ...rest] = products

  return (
    <div className="flex flex-col gap-4">
      {/* First product — large featured card */}
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <ProductCard product={featured} featured />
        {rest[0] && <ProductCard product={rest[0]} />}
      </div>

      {/* Remaining products — 3 column row */}
      <div className="grid gap-4 md:grid-cols-3">
        {rest.slice(1).map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>

      {cta && ctaHref && (
        <div className="flex justify-center pt-2">
          <Button asChild variant="secondary" size="sm">
            <Link href={ctaHref}>
              {cta}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

function ProductCard({
  product,
  featured = false,
}: {
  product: ProductItem
  featured?: boolean
}) {
  const Icon = productIcons[product.visualKind] ?? Bot

  return (
    <Link
      href={product.href}
      className={cn(
        "group flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 transition-all hover:border-primary/30 hover:shadow-md",
        featured && "md:p-7"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "grid place-items-center rounded-xl bg-system/10 text-system",
            featured ? "size-12" : "size-10"
          )}
        >
          <Icon className={featured ? "size-6" : "size-5"} />
        </div>
        <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "font-semibold text-primary",
              featured ? "text-lg" : "text-base"
            )}
          >
            {product.name}
          </span>
          <span className="text-xs text-muted-foreground">{product.tagline}</span>
        </div>
        <p
          className={cn(
            "leading-6 text-muted-foreground",
            featured ? "text-sm" : "text-xs"
          )}
        >
          {product.description}
        </p>
      </div>
    </Link>
  )
}
