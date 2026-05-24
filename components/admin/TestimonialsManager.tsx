"use client"

import { Pencil, Plus, Star, Trash2, X } from "lucide-react"
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { deleteTestimonial, saveTestimonial, setTestimonialStatus } from "@/lib/cms/actions"
import type { CmsTestimonial } from "@/lib/cms/types"

function Textarea(props: React.ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      maxLength={200}
      className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    />
  )
}

function TestimonialForm({
  testimonial,
  onClose,
}: {
  testimonial?: CmsTestimonial
  onClose?: () => void
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <form action={saveTestimonial} className="grid gap-3">
        {testimonial ? <input type="hidden" name="id" value={testimonial.id} /> : null}
        <label className="flex flex-col gap-2 text-sm font-semibold">
          Quote text
          <Textarea name="quoteText" defaultValue={testimonial?.quoteText} required />
        </label>
        <div className="grid gap-3 md:grid-cols-4">
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Client name
            <Input name="clientName" defaultValue={testimonial?.clientName} required />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Company label
            <Input name="companyLabel" defaultValue={testimonial?.companyLabel} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Star rating
            <Input name="starRating" type="number" min={1} max={5} defaultValue={testimonial?.starRating ?? ""} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Display order
            <Input name="displayOrder" type="number" defaultValue={testimonial?.displayOrder ?? 0} />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input name="isActive" type="checkbox" defaultChecked={testimonial?.isActive ?? true} />
            Live
          </label>
          <Button type="submit" variant="primary" size="sm">
            {testimonial ? "Save testimonial" : "Add testimonial"}
          </Button>
          {onClose ? (
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          ) : null}
        </div>
      </form>
      <aside className="h-fit rounded-2xl border bg-muted/20 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Live preview</p>
            <p className="text-sm text-muted-foreground">Homepage testimonial card</p>
          </div>
          <Badge variant={testimonial?.isActive ? "secondary" : "outline"}>
            {testimonial?.isActive ? "Live" : "Not Live"}
          </Badge>
        </div>
        <div className="rounded-2xl border bg-background p-5 shadow-md">
          {testimonial?.starRating ? (
            <div className="mb-4 flex gap-1 text-primary">
              {Array.from({ length: testimonial.starRating }).map((_, index) => (
                <Star key={index} className="size-4 fill-current" />
              ))}
            </div>
          ) : null}
          <p className="text-sm leading-6 text-muted-foreground">
            “{testimonial?.quoteText || "Client quote will appear here."}”
          </p>
          <div className="mt-5">
            <p className="font-semibold">{testimonial?.clientName || "Client name"}</p>
            <p className="text-sm text-muted-foreground">{testimonial?.companyLabel || "Company label"}</p>
          </div>
        </div>
      </aside>
    </div>
  )
}

export function TestimonialsManager({ testimonials }: { testimonials: CmsTestimonial[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const editingTestimonial = useMemo(
    () => testimonials.find((testimonial) => testimonial.id === editingId),
    [editingId, testimonials]
  )

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <CardTitle>Testimonials</CardTitle>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => {
            setEditingId(null)
            setModalOpen(true)
          }}
        >
          <Plus data-icon="inline-start" />
          New
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
          {testimonials.length ? (
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="py-3 pr-4 font-semibold">Client</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 pr-4 font-semibold">Rating</th>
                  <th className="py-3 pr-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="border-b last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-medium">{testimonial.clientName}</p>
                      <p className="text-muted-foreground">{testimonial.companyLabel || testimonial.quoteText}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={testimonial.isActive ? "secondary" : "outline"}>
                        {testimonial.isActive ? "Live" : "Not Live"}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{testimonial.starRating ?? "Hidden"}</td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditingId(testimonial.id)
                            setModalOpen(true)
                          }}
                        >
                          <Pencil data-icon="inline-start" />
                          Edit
                        </Button>
                        <form action={setTestimonialStatus}>
                          <input type="hidden" name="id" value={testimonial.id} />
                          <input type="hidden" name="isActive" value={String(!testimonial.isActive)} />
                          <Button type="submit" size="sm" variant="outline">
                            {testimonial.isActive ? "Set Not Live" : "Set Live"}
                          </Button>
                        </form>
                        <form action={deleteTestimonial}>
                          <input type="hidden" name="id" value={testimonial.id} />
                          <Button
                            type="submit"
                            variant="danger"
                            size="sm"
                            onClick={(event) => {
                              if (!window.confirm(`Delete testimonial from "${testimonial.clientName}"? This cannot be undone.`)) {
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
              No testimonials yet. Use New to add the first record.
            </p>
          )}
      </CardContent>
      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-4">
          <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-xl font-semibold tracking-normal">
                  {editingTestimonial ? `Edit ${editingTestimonial.clientName}` : "New testimonial"}
                </h2>
                <p className="text-sm text-muted-foreground">Edit the record and preview the homepage card.</p>
              </div>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() => {
                  setModalOpen(false)
                  setEditingId(null)
                }}
              >
                <X />
              </Button>
            </div>
            <div className="overflow-y-auto p-5">
              <TestimonialForm
                key={editingTestimonial?.id ?? "new"}
                testimonial={editingTestimonial}
                onClose={() => {
                  setModalOpen(false)
                  setEditingId(null)
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  )
}
