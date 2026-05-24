import { BarChart3, Clock3, FileText, Globe2, Target } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { BilingualText, type BilingualText as BilingualTextType } from "./shared"

type Feature = {
  title: BilingualTextType
  icon: React.ReactNode
  wide?: boolean
}

type FeatureGridProps = {
  features?: Feature[]
}

export function FeatureGrid({
  features = [
    { title: { en: "Built for SME growth" }, icon: <BarChart3 data-icon="inline-start" /> },
    { title: { en: "Launch in weeks" }, icon: <Clock3 data-icon="inline-start" /> },
    { title: { en: "Business model fit" }, icon: <FileText data-icon="inline-start" /> },
    { title: { en: "Mobile-first multilingual" }, icon: <Globe2 data-icon="inline-start" /> },
    { title: { en: "Integrated e-invoice systems" }, icon: <Target data-icon="inline-start" />, wide: true },
  ],
}: FeatureGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr]">
      <Card className="min-h-96">
        <CardContent className="relative min-h-96 overflow-hidden bg-muted">
          <div className="absolute inset-8 rounded-2xl bg-background/70" />
          <div className="absolute left-8 top-6 text-[12rem] font-semibold leading-none text-primary/35">
            A
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title.en} className={feature.wide ? "sm:col-span-2" : undefined}>
            <CardHeader>
              <div className="grid size-12 place-items-center rounded-full bg-system/10 text-system">
                {feature.icon}
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle>
                <BilingualText text={feature.title} />
              </CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
