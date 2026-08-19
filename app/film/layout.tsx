import type { Metadata } from 'next';

/* Kept out of search results — this page exists to be screen-recorded, not found. */
export const metadata: Metadata = {
  title: 'Demo stage',
  robots: { index: false, follow: false },
};

export default function FilmLayout({ children }: { children: React.ReactNode }) {
  return children;
}
