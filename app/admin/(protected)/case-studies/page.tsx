import { AdminCollectionPage } from "@/components/admin/AdminCollectionPage"

type PageProps = {
  searchParams: Promise<{ q?: string; status?: string }>
}

export default function AdminCaseStudiesPage({ searchParams }: PageProps) {
  return <AdminCollectionPage collection="case_studies" searchParams={searchParams} />
}
