'use client';
/* A stripped stage for filming the ad.
 *
 * The hero demo is surrounded by the things a landing page needs and a screen recording does not:
 * the navbar, the caption, the trial button under it, the footer. All of that pushed the toggle
 * high up the frame and left the app itself small in shot. This page is the same three live
 * demos with everything else taken away — a label, the switch, and the app, tight together.
 *
 * Not linked from anywhere and noindexed: it exists to be recorded, not visited.
 */
import { useEffect, useRef, useState } from 'react';

type Key = 'business' | 'client' | 'crew';
const DEMOS: Record<Key, { url: string; label: string }> = {
  business: { url: 'https://my.spraybosspro.com/demo.html?v=6', label: '🖥️ Desktop' },
  client:   { url: 'https://boss-pro-client-mobile.vercel.app/customer-home.html?demo=1&v=6', label: '👤 Client app' },
  crew:     { url: 'https://boss-pro-mobile.vercel.app/?demo=1&v=6', label: '🚚 Crew app' },
};
const ORDER: Key[] = ['business', 'client', 'crew'];
const PHONE_LOGICAL = 400;
const DESK_LOGICAL = 1300;

export default function FilmPage() {
  const [active, setActive] = useState<Key>('business');
  const [phoneReady, setPhoneReady] = useState(false);
  const deskRef = useRef<HTMLDivElement>(null);
  const [deskFit, setDeskFit] = useState({ scale: 1, h: 700 });

  const isPhone = active !== 'business';
  /* Bigger than the hero's 278px: in a phone-sized ad the app has to fill the frame. */
  const phoneScale = 330 / PHONE_LOGICAL;

  useEffect(() => {
    function measure() {
      const el = deskRef.current;
      if (!el) return;
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      const scale = w / DESK_LOGICAL;
      setDeskFit({ scale, h: Math.ceil(h / scale) });
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'flex-start', padding: '18px 12px 0' }}>
      {/* The layout paints a navbar and footer on every page; this one wants neither in shot. */}
      <style dangerouslySetInnerHTML={{ __html:
        '.site-footer,nav,header{display:none!important}body{background:#0a0a0a!important}' }} />

      <div style={{ color: 'rgba(255,255,255,.55)', fontSize: '13px', fontWeight: 800,
                    letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: '10px' }}>
        Live demo
      </div>

      <div style={{ display: 'inline-flex', gap: '4px', background: 'rgba(255,255,255,.06)',
                    border: '1px solid rgba(255,255,255,.14)', borderRadius: '999px',
                    padding: '5px', marginBottom: '16px' }}>
        {ORDER.map((k) => (
          <button key={k} type="button"
            onClick={() => { if (k !== active) { setActive(k); if (k !== 'business') setPhoneReady(false); } }}
            style={{
              border: 'none', fontFamily: 'inherit', fontSize: '14.5px', fontWeight: 800,
              padding: '10px 20px', borderRadius: '999px', cursor: 'pointer', whiteSpace: 'nowrap',
              background: active === k ? '#ff6a00' : 'transparent',
              color: active === k ? '#fff' : 'rgba(255,255,255,.7)',
            }}>{DEMOS[k].label}</button>
        ))}
      </div>

      {/* PHONE */}
      <div style={{ display: isPhone ? 'block' : 'none', position: 'relative', width: '354px',
                    height: '722px', background: '#0a0a0a', borderRadius: '48px', padding: '12px',
                    boxShadow: '0 0 0 1px #c050f0, 0 0 26px 7px rgba(192,80,240,.8), 0 0 60px 16px rgba(192,80,240,.4), inset 0 0 0 2px #2c2c30' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#fff',
                      borderRadius: '38px', overflow: 'hidden' }}>
          {isPhone && (
            <>
              {!phoneReady && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#999', fontSize: '13px', background: '#fff', zIndex: 2 }}>Loading…</div>}
              <iframe key={active} src={DEMOS[active].url} title={DEMOS[active].label}
                onLoad={() => setPhoneReady(true)}
                style={{ width: PHONE_LOGICAL + 'px', height: Math.ceil(698 / phoneScale) + 'px', border: 0,
                         display: 'block', background: '#fff', transform: `scale(${phoneScale})`, transformOrigin: 'top left' }} />
            </>
          )}
        </div>
      </div>

      {/* DESKTOP — mounted once so its session survives switching away and back */}
      <div style={{ display: active === 'business' ? 'block' : 'none', width: '100%', maxWidth: '1180px',
                    borderRadius: '12px', overflow: 'hidden', background: '#1b1b22',
                    boxShadow: '0 0 0 1px #c050f0, 0 0 30px 8px rgba(192,80,240,.8), 0 0 110px 30px rgba(192,80,240,.4)' }}>
        <div ref={deskRef} style={{ position: 'relative', width: '100%', height: '760px', background: '#fff', overflow: 'hidden' }}>
          <iframe src={DEMOS.business.url} title="Desktop demo"
            style={{ width: DESK_LOGICAL + 'px', height: deskFit.h + 'px', border: 0, display: 'block',
                     background: '#fff', transform: `scale(${deskFit.scale})`, transformOrigin: 'top left' }} />
        </div>
      </div>
    </div>
  );
}
