'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/* Where visitors actually come from.

   The pageview beacon used to live inside HeroDemo, which only renders on the homepage and the two
   demo pages. Everything else on this site - /features, /pricing and the several hundred SEO pages -
   sent nothing at all. A visitor who found /features through Google, read it, then clicked through
   to the homepage was logged exactly once, with referrer "/features": their real source was already
   gone by the time anything was recorded. That made "direct" the biggest bucket in the traffic data
   while meaning little more than "entered on a page we do not measure".

   Mounted in the root layout, so it fires on every page, including the ranking ones. */

const ENDPOINT = 'https://knjdbgroiyhvqwrpqzcx.supabase.co/functions/v1/demo-session';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuamRiZ3JvaXlodnF3cnBxemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0OTczMDMsImV4cCI6MjA5NTA3MzMwM30.zoExtkem-XZqU86S4yJjA_xOOaS1G0IPU2M9OAAza2g';
const NOTRACK_KEY = 'bp_notrack';

// Owner/internal traffic. One visit to any page with ?notrack=1 sets the flag for this browser and
// every later beacon carries it, so the edge function drops the row. Excluding by IP does not work -
// the owner moves between home wifi, a phone hotspot and job sites - so the flag rides with the
// browser instead.
function readNoTrack(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get('notrack') === '1') {
      localStorage.setItem(NOTRACK_KEY, '1');
    }
    return localStorage.getItem(NOTRACK_KEY) === '1';
  } catch { return false; }
}

export default function PageBeacon() {
  const pathname = usePathname();
  // React 18 mounts effects twice in dev, and a route change should send exactly one beacon.
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;
    try {
      fetch(ENDPOINT, {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json', apikey: ANON_KEY },
        body: JSON.stringify({
          product: 'spraybosspro',
          event: 'pageview',
          /* On a client-side route change document.referrer still holds the ORIGINAL external
             source, not the page just left. That is the honest answer to "where did they come
             from", so it is left alone - landing_url below says which page this beacon is for. */
          referrer: document.referrer || 'direct',
          landing_url: window.location.href,
          notrack: readNoTrack(),
        }),
      }).catch(() => {});
    } catch { /* analytics only - never block the page */ }
  }, [pathname]);

  return null;
}
