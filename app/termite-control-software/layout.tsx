import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termite Control Software | SprayBossPro',
  description: 'Termite control software with inspection & WDO scheduling, treatment compliance logging, warranty renewals, circle-map routing, card-on-file billing, and automated SMS. $129/month, all features.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
