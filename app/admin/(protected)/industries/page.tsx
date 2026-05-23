import { AdminCollectionPage } from "@/components/admin/AdminCollectionPage"

type PageProps = {
  searchParams: Promise<{ q?: string; status?: string }>
}

export default function AdminIndustriesPage({ searchParams }: PageProps) {
  return <AdminCollectionPage collection="industries" searchParams={searchParams} />
}
