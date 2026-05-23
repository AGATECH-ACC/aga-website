import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"

const cookieName = "aga_admin_session"
const maxAgeSeconds = 60 * 60 * 8

type AdminSessionPayload = {
  email: string
  exp: number
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || ""
}

function encode(value: string) {
  return Buffer.from(value).toString("base64url")
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8")
}

function sign(payload: string) {
  const secret = getSessionSecret()

  if (!secret) return ""

  return createHmac("sha256", secret).update(payload).digest("base64url")
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) return false

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function hasAdminPasscodeConfig() {
  return Boolean(process.env.ADMIN_PASSCODE && getSessionSecret())
}

export async function createAdminSession(email: string) {
  const payload: AdminSessionPayload = {
    email,
    exp: Date.now() + maxAgeSeconds * 1000,
  }
  const encodedPayload = encode(JSON.stringify(payload))
  const signature = sign(encodedPayload)

  if (!signature) {
    throw new Error("Admin session secret is missing")
  }

  const cookieStore = await cookies()
  cookieStore.set(cookieName, `${encodedPayload}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(cookieName)
}

export async function getAdminSessionEmail() {
  const secret = getSessionSecret()

  if (!secret) return null

  const cookieStore = await cookies()
  const value = cookieStore.get(cookieName)?.value

  if (!value) return null

  const [encodedPayload, signature] = value.split(".")

  if (!encodedPayload || !signature) return null

  const expectedSignature = sign(encodedPayload)

  if (!expectedSignature || !safeEqual(signature, expectedSignature)) return null

  try {
    const payload = JSON.parse(decode(encodedPayload)) as AdminSessionPayload

    if (!payload.email || payload.exp < Date.now()) {
      return null
    }

    return payload.email
  } catch {
    return null
  }
}
