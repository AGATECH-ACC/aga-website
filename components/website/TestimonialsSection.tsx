import { Card, CardContent } from "@/components/ui/card"
import type { CmsTestimonial } from "@/lib/cms/types"

import { WebsiteContainer, WebsiteSection } from "./shared"

export function TestimonialsSection({
  testimonials,
  locale = "en",
}: {
  testimonials: CmsTestimonial[]
  locale?: "en" | "zh"
}) {
  if (!testimonials.length) return null

  return (
    <WebsiteSection>
      <WebsiteContainer className="flex flex-col gap-8">
        <h2 className="text-center text-3xl font-semibold tracking-normal md:text-5xl">
          {locale === "zh" ? "客户怎么说" : "What our clients say"}
        </h2>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="min-w-[85%] snap-center bg-background shadow-sm sm:min-w-[26rem] md:min-w-0">
              <CardContent className="flex h-full flex-col gap-5 p-6">
                {testimonial.starRating ? (
                  <div className="text-sm tracking-widest text-primary">
                    {"★".repeat(testimonial.starRating)}
                  </div>
                ) : null}
                <p className="flex-1 text-base leading-7 text-foreground">
                  &ldquo;{testimonial.quoteText}&rdquo;
                </p>
                <div>
                  <p className="font-semibold">{testimonial.clientName}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.companyLabel}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </WebsiteContainer>
    </WebsiteSection>
  )
}
