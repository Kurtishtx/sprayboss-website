'use client';
import { useEffect, useRef, useState } from 'react';

// Live, read-only demos of the two real apps (?demo=1). Loaded lazily inside a phone bezel.
const URLS = {
  customer: 'https://boss-pro-client-mobile.vercel.app/customer-home.html?demo=1',
  crew:     'https://boss-pro-mobile.vercel.app/?demo=1',
};
const CAPS = {
  customer: 'Exactly what your customers see — upcoming visits, invoices, pay a bill, update their card, and choose how they get alerts.',
  crew:     'And this is your crew’s day — their stop list, gate codes, property notes, chemical logging, and one-tap arrival alerts to customers.',
};

type AppKey = 'customer' | 'crew';

export default function PhoneDemo() {
  const [app, setApp] = useState<AppKey>('customer');
  const [loaded, setLoaded] = useState(false);       // defer the iframe until scrolled near
  const [frameLoading, setFrameLoading] = useState(true);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (typeof IntersectionObserver === 'undefined') { setLoaded(true); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setLoaded(true); io.disconnect(); } });
    }, { rootMargin: '250px' });
    io.observe(host);
    return () => io.disconnect();
  }, []);

  function choose(a: AppKey) { if (a !== app) { setApp(a); setFrameLoading(true); } }

  const segBtn = (a: AppKey, label: string) => (
    <button
      type="button"
      onClick={() => choose(a)}
      style={{
        border: 'none', fontFamily: 'inherit', fontSize: '14.5px', fontWeight: 800,
        padding: '11px 20px', borderRadius: '999px', cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'all .18s',
        background: app === a ? '#ff6a00' : 'transparent',
        color: app === a ? '#fff' : '#c9c9d2',
        boxShadow: app === a ? '0 4px 14px rgba(255,106,0,.4)' : 'none',
      }}
    >{label}</button>
  );

  return (
    <section
      ref={hostRef}
      style={{
        background: 'linear-gradient(180deg,#0b0b0d 0%,#161616 100%)',
        color: '#fff', padding: '74px 20px 82px', textAlign: 'center', overflow: 'hidden',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html:
        '@keyframes bpxpulse{0%{box-shadow:0 0 0 0 rgba(46,201,107,.55);}70%{box-shadow:0 0 0 9px rgba(46,201,107,0);}100%{box-shadow:0 0 0 0 rgba(46,201,107,0);}}' }} />

      <span style={{ display: 'inline-block', color: '#ff8a3d', fontSize: '12px', fontWeight: 800, letterSpacing: '1.8px', textTransform: 'uppercase', marginBottom: '14px' }}>
        Two apps, both included
      </span>
      <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, lineHeight: 1.15, margin: '0 auto 14px', maxWidth: '15ch' }}>
        Your customers and your crew, in their pocket.
      </h2>
      <p style={{ color: '#b9b9c2', fontSize: '16px', lineHeight: 1.7, maxWidth: '56ch', margin: '0 auto 26px' }}>
        No app-store download, no extra fee. Tap a phone below — it&apos;s the real app, running live. Scroll it, poke around.
      </p>

      <div style={{ display: 'inline-flex', background: '#000', border: '1px solid #2a2a2f', borderRadius: '999px', padding: '5px', marginBottom: '8px', gap: '4px' }}>
        {segBtn('customer', '👤 Customer app')}
        {segBtn('crew', '🚚 Crew app')}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', color: '#8fd6a0', fontSize: '12.5px', fontWeight: 700, margin: '14px 0 22px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2ec96b', animation: 'bpxpulse 2s infinite' }} />
        Live demo — go ahead, scroll &amp; tap it
      </div>

      <div style={{ position: 'relative', width: '300px', maxWidth: '86vw', height: '620px', margin: '0 auto', background: '#0a0a0a', borderRadius: '46px', padding: '11px', boxShadow: '0 34px 70px rgba(0,0,0,.55), inset 0 0 0 2px #2c2c30' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#fff', borderRadius: '36px', overflow: 'hidden' }}>
          {(!loaded || frameLoading) && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '13px', background: '#fff', zIndex: 2 }}>
              Loading the live app…
            </div>
          )}
          {loaded && (
            <iframe
              key={app}
              src={URLS[app]}
              title="Live app demo"
              onLoad={() => setFrameLoading(false)}
              style={{ width: '100%', height: '100%', border: 0, display: 'block', background: '#fff' }}
            />
          )}
        </div>
      </div>

      <p style={{ color: '#c9c9d2', fontSize: '14.5px', lineHeight: 1.65, maxWidth: '46ch', margin: '24px auto 0', minHeight: '48px' }}>
        {CAPS[app]}
      </p>

      <a href="#pricing" style={{ display: 'inline-block', marginTop: '26px', background: '#ff6a00', color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: '15px', padding: '15px 34px', borderRadius: '8px' }}>
        See pricing &amp; start free →
      </a>
    </section>
  );
}
