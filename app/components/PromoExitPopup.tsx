'use client';
/* Exit popup (11/15): "Not ready yet? Get 50% off your first month." -> email -> promo-capture
 * emails a SAVE50-XXXXXX code (14 days) and returns it.
 *
 * When it opens (once per visitor, never in the first 8 seconds):
 *   desktop - exit intent: the mouse leaves the WINDOW through the top edge (mouseout with no
 *             relatedTarget and clientY <= 0), i.e. heading for the tabs / back / address bar.
 *             Moving around the site's own menu never fires it - that's still inside the page.
 *   phones  - a fast flick back up after scrolling at least 600px, or 45s on the page.
 * Never when: they already got a code or signed up in this browser, the sign-up form or the
 * Live Demo popup is open, or they arrived with ?signup=1.
 *
 * Also handles ?signup=1 (&code=...) from the code email: opens the sign-up form with the code in.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { PROMO_FN, PROMO_ANON, LS_SEEN, LS_CODE, LS_SIGNED_UP, lsGet, lsSet, fillPromoInputs } from './promo';

const ARM_AFTER_MS = 8000;
const PHONE_AFTER_MS = 45000;
const PHONE_MIN_SCROLL = 600;
const FLICK_UP_PX = 150;
const FLICK_WINDOW_MS = 500;

function signupOpen(): boolean {
  const bd = document.getElementById('sbp-backdrop');
  if (bd && bd.style.display === 'block') return true;
  for (const i of [1, 2, 3]) { const f = document.getElementById('sbp-form-' + i); if (f && f.style.display === 'block') return true; }
  return false;
}
function demoPopupOpen(): boolean { return !!document.querySelector('.demopop-overlay'); }

// Open the page's own sign-up form (each page registers window.__openSignup), anchored near the top.
function openSignup(code?: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const open = (window as any).__openSignup as ((n: number, el: HTMLElement) => void) | undefined;
  if (!open) return false;
  const anchor = document.createElement('div');
  anchor.style.cssText = 'position:fixed;top:28px;left:50%;width:1px;height:1px;pointer-events:none';
  document.body.appendChild(anchor);
  try { open(1, anchor); } finally { anchor.remove(); }
  if (code) fillPromoInputs(code);
  setTimeout(() => (document.getElementById('sbp1-first') as HTMLInputElement | null)?.focus(), 50);
  return true;
}

export default function PromoExitPopup() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<'form' | 'done'>('form');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevFocus = useRef<Element | null>(null);
  const honey = useRef<HTMLInputElement>(null);

  // ?signup=1 (&code=) - from the "Start your free trial" button in the code email.
  useEffect(() => {
    let p: URLSearchParams;
    try { p = new URLSearchParams(window.location.search); } catch { return; }
    const c = (p.get('code') || '').trim().toUpperCase();
    if (p.get('signup') !== '1') { if (c) fillPromoInputs(c); return; }
    let tries = 0;
    const iv = setInterval(() => {
      if (openSignup(c || undefined) || ++tries > 40) clearInterval(iv);
    }, 100);
    return () => clearInterval(iv);
  }, []);

  const trigger = useCallback(() => {
    if (lsGet(LS_SEEN) || lsGet(LS_CODE) || lsGet(LS_SIGNED_UP)) return false;
    if (signupOpen() || demoPopupOpen()) return false;
    lsSet(LS_SEEN, String(Date.now()));
    prevFocus.current = document.activeElement;
    setOpen(true);
    return true;
  }, []);

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.get('signup') === '1') return;
    } catch { /* ignore */ }
    if (lsGet(LS_SEEN) || lsGet(LS_CODE) || lsGet(LS_SIGNED_UP)) return;

    const t0 = Date.now();
    const armed = () => Date.now() - t0 >= ARM_AFTER_MS;
    let done = false;
    const fire = () => { if (!done && armed() && trigger()) { done = true; cleanup(); } };

    const coarse = window.matchMedia?.('(pointer: coarse)').matches || window.innerWidth < 760;

    // Desktop exit intent.
    const onOut = (e: MouseEvent) => { if (!e.relatedTarget && e.clientY <= 0) fire(); };

    // Phones: a quick flick back up after real scrolling.
    let maxY = window.scrollY, peakY = window.scrollY, peakT = Date.now(), lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY, now = Date.now();
      if (y > maxY) maxY = y;
      if (y >= lastY) { peakY = y; peakT = now; }
      else if (maxY >= PHONE_MIN_SCROLL && peakY - y >= FLICK_UP_PX && now - peakT <= FLICK_WINDOW_MS) fire();
      lastY = y;
    };
    let timer: ReturnType<typeof setInterval> | null = null;
    let phoneT: ReturnType<typeof setTimeout> | null = null;

    if (coarse) {
      window.addEventListener('scroll', onScroll, { passive: true });
      // 45s on the page; if something else is open then, keep trying every 5s.
      phoneT = setTimeout(() => { fire(); if (!done) timer = setInterval(fire, 5000); }, PHONE_AFTER_MS);
    } else {
      document.addEventListener('mouseout', onOut);
    }
    function cleanup() {
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('scroll', onScroll);
      if (phoneT) clearTimeout(phoneT);
      if (timer) clearInterval(timer);
    }
    return cleanup;
  }, [trigger]);

  const close = useCallback(() => {
    setOpen(false);
    const pf = prevFocus.current as HTMLElement | null;
    try { pf?.focus?.(); } catch { /* ignore */ }
  }, []);

  // Focus, Esc, and keeping Tab inside the dialog.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      const target = stage === 'form' ? inputRef.current : cardRef.current?.querySelector<HTMLElement>('.sbp-promo-go');
      target?.focus();
    }, 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab' || !cardRef.current) return;
      const f = cardRef.current.querySelectorAll<HTMLElement>('button, a[href], input:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey, true); };
  }, [open, stage, close]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    setErr('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { setErr('Please enter a valid email address.'); inputRef.current?.focus(); return; }
    setSending(true);
    try {
      const r = await fetch(PROMO_FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: PROMO_ANON },
        body: JSON.stringify({ email: v, product: 'spraybosspro', source: 'site', page: window.location.pathname.slice(0, 300), website: honey.current?.value || '' }),
      });
      const d = await r.json().catch(() => ({}));
      if (!d || d.error || !d.ok) throw new Error(d?.error || 'Something went wrong. Please try again.');
      lsSet(LS_CODE, d.code || 'sent');
      setCode(d.code || null);
      setResent(!!d.resent);
      setStage('done');
    } catch (x) {
      setErr((x as Error).message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const startTrial = () => {
    const c = code;
    close();
    if (!openSignup(c || undefined)) window.location.href = '/?signup=1' + (c ? '&code=' + encodeURIComponent(c) : '');
  };

  if (!open) return null;

  return (
    <div className="sbp-promo-ov" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <style>{CSS}</style>
      <div className="sbp-promo-card" ref={cardRef} role="dialog" aria-modal="true" aria-labelledby="sbp-promo-title" aria-describedby="sbp-promo-sub">
        <div className="sbp-promo-hd">
          {stage === 'form' && <span className="sbp-promo-eb">Before you go</span>}
          {stage === 'form'
            ? <h2 id="sbp-promo-title">Not ready yet? Get <b>50% off your first month</b>.</h2>
            : <h2 id="sbp-promo-title">Check your email &mdash; your code is on its way</h2>}
          <p className="sbp-promo-sub" id="sbp-promo-sub">
            {stage === 'form' ? <>We&rsquo;ll email you a redemption code.</> : resent ? <>We re-sent the code we emailed you earlier.</> : <>We sent it to {email.trim()}.</>}
          </p>
          <button type="button" className="sbp-promo-x" aria-label="Close" onClick={close}>&times;</button>
        </div>
        <div className="sbp-promo-bd">
          {stage === 'form' ? (
            <form onSubmit={submit} noValidate>
              <label htmlFor="sbp-promo-email">Email address</label>
              <input id="sbp-promo-email" ref={inputRef} type="email" inputMode="email" autoComplete="email" placeholder="you@yourcompany.com"
                value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!err} aria-describedby={err ? 'sbp-promo-err' : undefined} />
              <input ref={honey} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sbp-promo-hp" />
              {err && <div className="sbp-promo-err" id="sbp-promo-err" role="alert">{err}</div>}
              <button className="sbp-promo-go" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Email me my code'}</button>
              <button className="sbp-promo-no" type="button" onClick={close}>No thanks</button>
              <p className="sbp-promo-fine">Good for 14 days. Start your free trial with it any time.</p>
            </form>
          ) : (
            <>
              {code && (
                <div className="sbp-promo-code">
                  <div className="k">Your redemption code</div>
                  <div className="c">{code}</div>
                  <div className="f">50% off your first month &middot; good for 14 days</div>
                </div>
              )}
              <button className="sbp-promo-go" type="button" onClick={startTrial}>Start your free trial</button>
              <button className="sbp-promo-no" type="button" onClick={close}>Keep looking around</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const CSS = `
.sbp-promo-ov{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(8,0,16,.62);animation:sbpPromoIn .2s ease}
.sbp-promo-card{position:relative;width:100%;max-width:440px;max-height:calc(100vh - 32px);overflow-y:auto;background:#fff;border-radius:16px;border:3px solid #e07820;box-shadow:0 0 0 4px rgba(224,120,32,.3),0 24px 70px rgba(0,0,0,.5);animation:sbpPromoUp .28s cubic-bezier(.2,.8,.2,1);font-family:inherit}
.sbp-promo-hd{background:linear-gradient(135deg,#080010,#1e0a35);padding:26px 56px 22px 26px;color:#fff;border-radius:13px 13px 0 0}
.sbp-promo-eb{display:inline-block;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#ffb36b;margin-bottom:6px}
.sbp-promo-hd h2{margin:0;font-size:23px;line-height:1.25;font-weight:800;color:#fff}
.sbp-promo-hd h2 b{color:#ff9a3c}
.sbp-promo-sub{margin:8px 0 0;color:rgba(255,255,255,.75);font-size:14px;line-height:1.5}
.sbp-promo-x{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;border:none;background:rgba(255,255,255,.14);color:#fff;font-size:22px;line-height:1;cursor:pointer}
.sbp-promo-bd{padding:20px 26px 22px}
.sbp-promo-bd label{display:block;font-size:11px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}
.sbp-promo-bd input[type=email]{width:100%;box-sizing:border-box;border:1px solid #ccc;border-radius:8px;padding:12px;font-size:16px;font-family:inherit;color:#222}
.sbp-promo-bd input[type=email]:focus{outline:2px solid #e07820;outline-offset:1px;border-color:#e07820}
.sbp-promo-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.sbp-promo-go{display:block;width:100%;margin-top:12px;background:#e07820;color:#fff;border:none;border-radius:8px;padding:13px;font-size:16px;font-weight:800;cursor:pointer;font-family:inherit}
.sbp-promo-go:hover{background:#c96a16}.sbp-promo-go:disabled{opacity:.6;cursor:default}
.sbp-promo-go:focus-visible,.sbp-promo-no:focus-visible,.sbp-promo-x:focus-visible{outline:3px solid #ffb36b;outline-offset:2px}
.sbp-promo-no{display:block;margin:10px auto 0;background:none;border:none;color:#666;font-size:13px;text-decoration:underline;cursor:pointer;font-family:inherit;padding:6px}
.sbp-promo-err{margin-top:8px;color:#b42318;font-size:13px;font-weight:600}
.sbp-promo-fine{margin:8px 0 0;font-size:12px;color:#777;text-align:center}
.sbp-promo-code{margin:0 0 4px;padding:14px;border:2px dashed #e07820;border-radius:10px;text-align:center;background:#fffaf5}
.sbp-promo-code .k{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#777}
.sbp-promo-code .c{font:900 26px/1.3 Consolas,Menlo,monospace;letter-spacing:.06em;color:#1a1a2e;margin-top:4px}
.sbp-promo-code .f{font-size:13px;color:#555;margin-top:2px}
@keyframes sbpPromoIn{from{opacity:0}to{opacity:1}}
@keyframes sbpPromoUp{from{transform:translateY(16px);opacity:0}to{transform:none;opacity:1}}
@media (prefers-reduced-motion: reduce){.sbp-promo-ov,.sbp-promo-card{animation:none}}
`;
