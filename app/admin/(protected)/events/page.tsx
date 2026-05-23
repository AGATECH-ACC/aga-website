import { AdminCollectionPage } from "@/components/admin/AdminCollectionPage"

type PageProps = {
  searchParams: Promise<{ q?: string; status?: string }>
}

export default function AdminEventsPage({ searchParams }: PageProps) {
  return <AdminCollectionPage collection="events" searchParams={searchParams} />
}
