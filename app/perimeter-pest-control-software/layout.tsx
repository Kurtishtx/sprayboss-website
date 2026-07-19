import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perimeter Pest Control Software | SprayBossPro',
  description: 'Perimeter pest control software for recurring barrier programs — quarterly scheduling, application compliance logging, circle-map routing, card-on-file billing, and automated SMS. $129/month, all features.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
