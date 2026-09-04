import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features | SprayBossPro',
  description: 'Circle-map routing, waiting list dispatch, recurring program scheduling, automated SMS alerts, chemical compliance logs, and Stripe payments.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}