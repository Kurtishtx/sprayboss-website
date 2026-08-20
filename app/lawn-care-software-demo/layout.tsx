import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lawn Care Software Demo | Try It Live, No Sales Call — SprayBossPro',
  description: 'Try a live lawn care software demo right now — no sales call, no signup, no credit card. A fully loaded company with real routes, customers, invoices and crew app. $129/month.',
  alternates: { canonical: 'https://spraybosspro.com/lawn-care-software-demo' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
