'use client';
import { useEffect, useState, type ReactNode } from 'react';

/* Renders its children (the Meta Pixel and Google tag) only once the visitor scrolls, taps, clicks or
   types. Loading ad trackers on arrival set third-party cookies and blocked the page while it was
   still drawing, which cost points on Google's Lighthouse test (Performance + Best Practices). Real
   visitors interact within a second or two, so they are still tracked; a bounce that never touches
   the page is not, and that traffic was never worth retargeting. */
export default function AfterInteraction({ children }: { children: ReactNode }) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    const ev = ['scroll', 'pointerdown', 'keydown', 'touchstart', 'mousemove'];
    const fire = () => { setGo(true); ev.forEach((e) => window.removeEventListener(e, fire)); };
    ev.forEach((e) => window.addEventListener(e, fire, { once: true, passive: true }));
    return () => ev.forEach((e) => window.removeEventListener(e, fire));
  }, []);
  return go ? <>{children}</> : null;
}
