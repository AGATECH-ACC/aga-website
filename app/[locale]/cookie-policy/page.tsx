import { LegalPage } from "../_components/LegalPage"

type PageProps = {
  params: Promise<{ locale: string }>
}

export default function CookiePolicyPage({ params }: PageProps) {
  return <LegalPage params={params} pageKey="cookie-policy" />
}
