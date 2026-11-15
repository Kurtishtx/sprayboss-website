import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Videos | SprayBossPro',
  description: 'Short videos of every SprayBossPro feature: routing, the crew app, invoicing, estimates, the client app, texting, AI tools, chemical records and more.',
  alternates: { canonical: 'https://www.spraybosspro.com/videos' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
