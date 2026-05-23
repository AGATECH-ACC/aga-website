import { AdminCollectionPage } from "@/components/admin/AdminCollectionPage"

type PageProps = {
  searchParams: Promise<{ q?: string; status?: string }>
}

export default function AdminAboutPage({ searchParams }: PageProps) {
  return <AdminCollectionPage collection="about" searchParams={searchParams} />
}
