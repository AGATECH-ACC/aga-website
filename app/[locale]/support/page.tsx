import { LegalPage } from "../_components/LegalPage"

type PageProps = {
  params: Promise<{ locale: string }>
}

export default function SupportPage({ params }: PageProps) {
  return <LegalPage params={params} pageKey="support" />
}
