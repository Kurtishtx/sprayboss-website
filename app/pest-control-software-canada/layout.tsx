import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pest Control Software for Canada | CAD Billing Built In — SprayBossPro',
  description: 'Pest control software for Canadian companies — bill customers in Canadian dollars, route technicians, log applications, and run recurring pest programs. Live demo, no sales call. From $59 USD/month.',
  alternates: { canonical: 'https://spraybosspro.com/pest-control-software-canada' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
