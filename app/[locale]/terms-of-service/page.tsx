import { LegalPage } from "../_components/LegalPage"

type PageProps = {
  params: Promise<{ locale: string }>
}

export default function TermsOfServicePage({ params }: PageProps) {
  return <LegalPage params={params} pageKey="terms-of-service" />
}
