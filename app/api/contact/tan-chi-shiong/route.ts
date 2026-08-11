const vCard = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "N;CHARSET=UTF-8:Tan;Chi Shiong;;;",
  "FN;CHARSET=UTF-8:Tan Chi Shiong",
  "ORG;CHARSET=UTF-8:AGA Ventures",
  "TITLE;CHARSET=UTF-8:Founder / 创办人",
  "TEL;TYPE=CELL,VOICE:+60183576003",
  "EMAIL;TYPE=WORK:enquiry@agaventures.ai",
  "URL:https://www.agaventures.ai",
  "NOTE;CHARSET=UTF-8:中文姓名：陈起祥",
  "END:VCARD",
].join("\r\n")

export const dynamic = "force-static"

export function GET() {
  return new Response(vCard, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Disposition": 'attachment; filename="tan-chi-shiong.vcf"',
      "Content-Type": "text/vcard; charset=utf-8",
    },
  })
}
