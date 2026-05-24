import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const bookingUrl = "https://client.agaventures.ai/enquiry"

function read(path) {
  return readFileSync(new URL(`../../${path}`, import.meta.url), "utf8")
}

test("English dictionary sends booking CTAs to the client enquiry app", () => {
  const en = read("lib/i18n/en.ts")

  assert.match(en, new RegExp(`ctaHref: "${bookingUrl}"`))
  assert.doesNotMatch(en, /ctaHref: "\/en\/contact"/)
})

test("contact page contains the approved booking content", () => {
  const contactPage = read("app/[locale]/contact/page.tsx")

  assert.match(contactPage, /Book Your Free 30-Min Business Diagnosis/)
  assert.match(contactPage, /Start with one conversation/)
  assert.match(contactPage, /Book a Session Now/)
  assert.match(contactPage, new RegExp(bookingUrl))
  assert.match(contactPage, /https:\/\/wa\.me\/60183576003/)
  assert.doesNotMatch(contactPage, /Content foundation is ready/)
})

test("homepage hero uses approved CRO copy and CTA hierarchy", () => {
  const en = read("lib/i18n/en.ts")
  const hero = read("components/website/HeroSection.tsx")

  assert.match(en, /Stop being the person your team can't operate without/)
  assert.match(en, /Book a Free 30-Min Diagnosis/)
  assert.match(en, /or WhatsApp us now/)
  assert.match(hero, new RegExp(bookingUrl))
  assert.doesNotMatch(en, /AGA turns scattered workflows into one connected system/)
})

test("hero dashboard carousel uses English-only labels", () => {
  const hero = read("components/website/HeroSection.tsx")

  for (const expected of [
    "AGA System Dashboard",
    "Repetitive work automated",
    "Automation Flow",
    "Key workflows connected",
    "Sales Follow-Up System",
    "Automated follow-up reminders",
    "Finance Management Reports",
    "Owner dashboard",
    "AI Agent Workspace",
    "Auto-process tasks",
  ]) {
    assert.match(hero, new RegExp(expected))
  }
})

test("homepage has CRO sections for diagnosis breakdown and testimonials", () => {
  const homepage = read("app/[locale]/page.tsx")

  assert.match(homepage, /DiagnosisBreakdownSection/)
  assert.match(homepage, /TestimonialsSection/)
})
