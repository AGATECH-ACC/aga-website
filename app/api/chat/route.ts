import {
  buildSystemPrompt,
  CLOUDFLARE_MODEL,
  detectBusinessIntent,
  MAX_MESSAGE_LENGTH,
  parseCloudflareAiResponse,
  sanitizeHistory,
} from "@/src/lib/cstan-ai"

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_MESSAGES = 20
const UPSTREAM_TIMEOUT_MS = 18_000

type RateLimitEntry = {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

function getClientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "anonymous"
  )
}

function isRateLimited(ip: string) {
  const now = Date.now()
  const existing = rateLimitStore.get(ip)

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  if (existing.count >= RATE_LIMIT_MAX_MESSAGES) return true

  existing.count += 1

  if (rateLimitStore.size > 500) {
    for (const [key, entry] of rateLimitStore) {
      if (entry.resetAt <= now) rateLimitStore.delete(key)
    }
  }

  return false
}

function json(message: string, showContactCTA: boolean, status = 200) {
  return Response.json(
    { message, showContactCTA },
    { status, headers: { "Cache-Control": "no-store" } },
  )
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return json("Please send a valid message.", false, 400)
  }

  if (!body || typeof body !== "object") {
    return json("Please send a valid message.", false, 400)
  }

  const candidate = body as { message?: unknown; history?: unknown }

  if (typeof candidate.message !== "string" || !candidate.message.trim()) {
    return json("Please enter a message first.", false, 400)
  }

  const message = candidate.message.trim()

  if (message.length > MAX_MESSAGE_LENGTH) {
    return json(`Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`, false, 400)
  }

  const history = sanitizeHistory(candidate.history)
  const userMessageCount = history.filter((item) => item.role === "user").length + 1
  const showContactCTA = detectBusinessIntent(message) || userMessageCount >= 7
  const ip = getClientIp(request)

  if (isRateLimited(ip)) {
    return json(
      "Looks like we've talked quite a bit 😄. Best move now is probably to speak with CSTAN directly.",
      true,
      429,
    )
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const apiToken = process.env.CLOUDFLARE_AI_TOKEN

  if (!accountId || !apiToken) {
    return json(
      "CSTAN AI is not connected yet 😄. You can still contact CSTAN directly below.",
      true,
      503,
    )
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${CLOUDFLARE_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: buildSystemPrompt() },
            ...history,
            { role: "user", content: message },
          ],
          max_tokens: 180,
        }),
        cache: "no-store",
        signal: controller.signal,
      },
    )

    if (!response.ok) {
      console.error("Cloudflare Workers AI request failed", { status: response.status })
      return json(
        "CSTAN AI is taking a short break 😄. You can still contact CSTAN directly below.",
        true,
        503,
      )
    }

    const payload: unknown = await response.json()
    const assistantMessage = parseCloudflareAiResponse(payload)

    if (!assistantMessage) {
      console.error("Cloudflare Workers AI returned an unexpected response shape")
      return json(
        "CSTAN AI is taking a short break 😄. You can still contact CSTAN directly below.",
        true,
        503,
      )
    }

    return json(assistantMessage, showContactCTA)
  } catch (error) {
    console.error("Cloudflare Workers AI request error", {
      name: error instanceof Error ? error.name : "UnknownError",
    })
    return json(
      "CSTAN AI is taking a short break 😄. You can still contact CSTAN directly below.",
      true,
      503,
    )
  } finally {
    clearTimeout(timeout)
  }
}
