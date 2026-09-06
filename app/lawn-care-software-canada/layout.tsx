import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lawn Care Software for Canada | CAD Invoicing Built In — SprayBossPro',
  description: 'Lawn care software that works in Canada out of the box — invoice your customers in Canadian dollars, route your crews, and run recurring programs. Try the live demo, no sales call. From $59 USD/month.',
  alternates: { canonical: 'https://spraybosspro.com/lawn-care-software-canada' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
