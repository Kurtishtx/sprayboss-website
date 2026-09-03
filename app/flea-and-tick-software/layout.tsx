import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flea and Tick Software | SprayBossPro',
  description: 'Flea and tick software for recurring yard barrier programs — seasonal scheduling, application compliance logging, circle-map routing, card-on-file billing, and automated SMS. from $59/month, all features.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
