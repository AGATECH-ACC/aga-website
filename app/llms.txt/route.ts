import { getLlmsMarkdown } from "@/lib/cms/db"

export const revalidate = 60

export async function GET() {
  const markdown = await getLlmsMarkdown()

  return new Response(markdown.endsWith("\n") ? markdown : `${markdown}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  })
}
