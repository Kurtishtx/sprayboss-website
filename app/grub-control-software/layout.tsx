import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grub Control Software | SprayBossPro',
  description: 'Grub control software for lawn grub programs — seasonal scheduling, sq-ft pricing, application compliance logging, circle-map routing, card-on-file billing, and automated SMS. $129/month, all features.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
