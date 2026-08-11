import { profile } from "@/src/config/profile"

function escapeVCard(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;")
}

function createVCard() {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N;CHARSET=UTF-8:Tan;Chi Shiong;;;",
    `FN;CHARSET=UTF-8:${escapeVCard(profile.name)}`,
    `ORG;CHARSET=UTF-8:${escapeVCard(profile.company)}`,
    `TITLE;CHARSET=UTF-8:${escapeVCard(profile.role)}`,
  ]

  if (profile.phone) lines.push(`TEL;TYPE=CELL,VOICE:${escapeVCard(profile.phone)}`)
  if (profile.email) lines.push(`EMAIL;TYPE=WORK:${escapeVCard(profile.email)}`)
  if (profile.websiteUrl) lines.push(`URL;TYPE=WORK:${escapeVCard(profile.websiteUrl)}`)
  if (profile.linkedinUrl) {
    lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${escapeVCard(profile.linkedinUrl)}`)
  }

  lines.push(
    `NOTE;CHARSET=UTF-8:${escapeVCard(`${profile.fullName} · ${profile.chineseName}`)}`,
    "END:VCARD",
  )

  return lines.join("\r\n")
}

export const dynamic = "force-static"

export function GET() {
  return new Response(createVCard(), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Disposition": 'attachment; filename="gulichan.vcf"',
      "Content-Type": "text/vcard; charset=utf-8",
    },
  })
}
