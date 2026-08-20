import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pest Control Software Demo | Try It Live, No Sales Call — SprayBossPro',
  description: 'Try a live pest control software demo right now — no sales call, no signup, no credit card. A fully loaded company with real routes, chemical logs, invoices and crew app. $129/month.',
  alternates: { canonical: 'https://spraybosspro.com/pest-control-software-demo' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
