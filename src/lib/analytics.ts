export type CstanAnalyticsEvent =
  | "nfc_landing_viewed"
  | "ask_cstan_ai_clicked"
  | "suggested_question_clicked"
  | "message_sent"
  | "whatsapp_clicked"
  | "website_clicked"
  | "save_contact_clicked"

type AnalyticsProperties = Record<string, boolean | number | string | undefined>

export function trackCstanEvent(
  event: CstanAnalyticsEvent,
  properties: AnalyticsProperties = {},
) {
  if (typeof window === "undefined") return

  const detail = {
    event,
    properties,
    timestamp: new Date().toISOString(),
  }

  window.dispatchEvent(new CustomEvent("cstan:analytics", { detail }))
  console.info("[CSTAN analytics]", detail)
}
