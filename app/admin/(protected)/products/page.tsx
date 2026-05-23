import { AdminCollectionPage } from "@/components/admin/AdminCollectionPage"

type PageProps = {
  searchParams: Promise<{ q?: string; status?: string }>
}

export default function AdminProductsPage({ searchParams }: PageProps) {
  return <AdminCollectionPage collection="products" searchParams={searchParams} />
}
