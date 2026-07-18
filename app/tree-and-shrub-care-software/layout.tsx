import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tree and Shrub Care Software | SprayBossPro',
  description: 'Tree and shrub care software with seasonal program scheduling, spray/injection compliance logging, circle-map routing, card-on-file billing, and automated SMS. $129/month, all features.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
