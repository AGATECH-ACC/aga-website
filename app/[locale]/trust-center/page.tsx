import { LegalPage } from "../_components/LegalPage"

type PageProps = {
  params: Promise<{ locale: string }>
}

export default function TrustCenterPage({ params }: PageProps) {
  return <LegalPage params={params} pageKey="trust-center" />
}
