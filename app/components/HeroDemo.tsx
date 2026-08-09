'use client';
import { useEffect, useRef, useState } from 'react';

type Key = 'business' | 'client' | 'crew';
type Demo = { url: string; label: string; kind: 'phone' | 'desktop'; cap: string };

const DEMOS: Record<Key, Demo> = {
  business: {
    // Bump ?v= whenever the demos change, so the iframe reloads fresh instead of from browser cache.
    url: 'https://my.spraybosspro.com/demo.html?v=3',
    label: '🖥️ Desktop version', kind: 'desktop',
    cap: 'The full software you run everything from — scheduling, the circle-map route builder, billing, and more.',
  },
  client: {
    url: 'https://boss-pro-client-mobile.vercel.app/customer-home.html?demo=1&v=3',
    label: '👤 Client app', kind: 'phone',
    cap: 'What your customers see — visits, invoices, pay a bill, live tracking, and alerts their way.',
  },
  crew: {
    url: 'https://boss-pro-mobile.vercel.app/?demo=1&v=3',
    label: '🚚 Crew app', kind: 'phone',
    cap: 'Your crew’s day — stop list, route map, gate codes, notes, and one-tap arrival alerts.',
  },
};
const ORDER: Key[] = ['business', 'client', 'crew'];
const PHONE_LOGICAL = 400;
const DESK_LOGICAL = 1300;

export default function HeroDemo() {
  const [active, setActive] = useState<Key>('business');
  const [bizReady, setBizReady] = useState(false);
  const [phoneReady, setPhoneReady] = useState(false);
  const deskRef = useRef<HTMLDivElement>(null);
  const [deskFit, setDeskFit] = useState({ scale: 1, w: DESK_LOGICAL, h: 700 });

  const phoneScale = 278 / PHONE_LOGICAL;
  const isPhone = active !== 'business';

  function choose(k: Key) { if (k !== active) { setActive(k); if (k !== 'business') setPhoneReady(false); } }

  // Scale the desktop dashboard (rendered at a real 1300px width) down to fit its frame.
  useEffect(() => {
    function measure() {
      const el = deskRef.current;
      if (!el) return;
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return; // hidden (phone active) → keep last scale
      const scale = w / DESK_LOGICAL;
      setDeskFit({ scale, w: DESK_LOGICAL, h: Math.ceil(h / scale) });
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
      <style dangerouslySetInnerHTML={{ __html:
        '@keyframes hdpulse{0%{box-shadow:0 0 0 0 rgba(46,201,107,.55)}70%{box-shadow:0 0 0 8px rgba(46,201,107,0)}100%{box-shadow:0 0 0 0 rgba(46,201,107,0)}}' }} />

      {/* Picker */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', background: 'rgba(0,0,0,.35)', border: '1px solid rgba(255,255,255,.14)', borderRadius: '999px', padding: '5px', gap: '4px' }}>
          {ORDER.map((k) => (
            <button key={k} type="button" onClick={() => choose(k)}
              style={{
                border: 'none', fontFamily: 'inherit', fontSize: '14.5px', fontWeight: 800,
                padding: '11px 20px', borderRadius: '999px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .18s',
                background: active === k ? '#ff6a00' : 'transparent',
                color: active === k ? '#fff' : 'rgba(255,255,255,.72)',
                boxShadow: active === k ? '0 4px 14px rgba(255,106,0,.4)' : 'none',
              }}>{DEMOS[k].label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', color: '#8fd6a0', fontSize: '12.5px', fontWeight: 700, marginBottom: '8px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2ec96b', animation: 'hdpulse 2s infinite' }} />
        Live demo — go ahead, scroll &amp; tap it
      </div>

      {/* "Lit stage" backdrop — the same #c050f0 magenta glow used behind the login screen. The glow
          hugs a narrow area for the phones and a wide one for the desktop, so it's always proportional. */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 12px 34px', borderRadius: '32px', background: isPhone
        ? 'radial-gradient(ellipse 40% 80% at 50% 47%, rgba(192,80,240,.5) 0%, rgba(192,80,240,.2) 42%, transparent 68%)'
        : 'radial-gradient(ellipse 92% 88% at 50% 46%, rgba(192,80,240,.42) 0%, rgba(192,80,240,.18) 34%, transparent 72%)' }}>
        {/* PHONE STAGE — single iframe, remounts on switch (reliable load) */}
        <div style={{ display: isPhone ? 'block' : 'none', position: 'relative', width: '300px', maxWidth: '86vw', height: '620px', background: '#0a0a0a', borderRadius: '46px', padding: '11px', boxShadow: '0 0 0 1px #c050f0, 0 0 22px 6px rgba(192,80,240,.85), 0 0 48px 13px rgba(192,80,240,.45), 0 0 82px 20px rgba(192,80,240,.2), inset 0 0 0 2px #2c2c30' }}>
          <div style={{ position: 'relative', width: '100%', height: '100%', background: '#fff', borderRadius: '36px', overflow: 'hidden' }}>
            {isPhone && (
              <>
                {!phoneReady && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '13px', background: '#fff', zIndex: 2 }}>Loading the live app…</div>}
                <iframe key={active} src={DEMOS[active].url} title={DEMOS[active].label} onLoad={() => setPhoneReady(true)}
                  style={{ width: PHONE_LOGICAL + 'px', height: Math.ceil(598 / phoneScale) + 'px', border: 0, display: 'block', background: '#fff', transform: `scale(${phoneScale})`, transformOrigin: 'top left' }} />
              </>
            )}
          </div>
        </div>

        {/* DESKTOP STAGE — mounted once (loads first), hidden when a phone is active so the session persists */}
        <div style={{ display: active === 'business' ? 'block' : 'none', width: '100%', maxWidth: '1000px', borderRadius: '12px', overflow: 'hidden', background: '#1b1b22', boxShadow: '0 0 0 1px #c050f0, 0 0 30px 8px rgba(192,80,240,.85), 0 0 90px 24px rgba(192,80,240,.5), 0 0 170px 48px rgba(192,80,240,.25), inset 0 0 0 1px rgba(255,255,255,.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 14px', background: '#25252e' }}>
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f57' }} />
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#febc2e' }} />
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#28c840' }} />
            <span style={{ marginLeft: '10px', flex: 1, background: '#15151b', color: 'rgba(255,255,255,.55)', fontSize: '12.5px', borderRadius: '7px', padding: '5px 12px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>my.spraybosspro.com</span>
          </div>
          <div ref={deskRef} style={{ position: 'relative', width: '100%', height: '600px', background: '#fff', overflow: 'hidden' }}>
            {!bizReady && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '14px', background: '#fff', zIndex: 2 }}>Spinning up your live demo…</div>}
            <iframe src={DEMOS.business.url} title="Desktop version demo" onLoad={() => setBizReady(true)}
              style={{ width: deskFit.w + 'px', height: deskFit.h + 'px', border: 0, display: 'block', background: '#fff', transform: `scale(${deskFit.scale})`, transformOrigin: 'top left' }} />
          </div>
        </div>
      </div>

      <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '14.5px', lineHeight: 1.6, maxWidth: '52ch', margin: '22px auto 0', textAlign: 'center', minHeight: '46px' }}>{DEMOS[active].cap}</p>
    </div>
  );
}
