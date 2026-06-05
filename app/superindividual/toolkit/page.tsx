import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { SuperindividualToolkitClient } from "@/components/superindividual/SuperindividualToolkitClient"

export const metadata: Metadata = {
  title: "你的AI工具包 | 超级个体实验室",
  description: "超级个体实验室专属AI工具包、Prompt模板与每日清单。",
}

type ToolkitPageProps = {
  searchParams: Promise<{
    id?: string
  }>
}

export default async function SuperindividualToolkitPage({
  searchParams,
}: ToolkitPageProps) {
  const { id } = await searchParams

  if (!id) {
    redirect("/superindividual")
  }

  return <SuperindividualToolkitClient accessToken={id} />
}
