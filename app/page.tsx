'use client';
import PlanCompare from './components/PlanCompare';
import { useEffect } from 'react';
import { pixelDemoStarted } from './components/MetaPixel';
import SiteScore from './components/SiteScore';
import Navbar from './components/Navbar';

const SBP_URL  = 'https://knjdbgroiyhvqwrpqzcx.supabase.co';
const SBP_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuamRiZ3JvaXlodnF3cnBxemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0OTczMDMsImV4cCI6MjA5NTA3MzMwM30.zoExtkem-XZqU86S4yJjA_xOOaS1G0IPU2M9OAAza2g';
let sbpClient: any = null;
let sbpOpenForm = 0;

function getSbpClient() { if (!sbpClient) sbpClient = (window as any).supabase.createClient(SBP_URL, SBP_ANON); return sbpClient; }

function openSignupModal(n: number, btn: HTMLElement) {
  closeAllModals(); sbpOpenForm = n;
  const form = document.getElementById('sbp-form-' + n)!;
  const rect = btn.getBoundingClientRect();
  const formW = Math.min(420, window.innerWidth - 24);
  const centerX = rect.left + rect.width / 2;
  let top = rect.bottom + 12;
  let left = centerX - formW / 2;
  if (top + 460 > window.innerHeight) { top = rect.top - 460 - 12; if (top < 12) top = 12; }
  top = Math.max(12, top);
  left = Math.max(12, Math.min(left, window.innerWidth - formW - 12));
  form.style.top = top + 'px'; form.style.left = left + 'px'; form.style.display = 'block';
  document.getElementById('sbp-backdrop')!.style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function closeSignupModal(n: number) { document.getElementById('sbp-form-' + n)!.style.display = 'none'; document.getElementById('sbp-backdrop')!.style.display = 'none'; document.body.style.overflow = ''; sbpOpenForm = 0; }
function closeAllModals() { [1,2,3].forEach(i => { const el = document.getElementById('sbp-form-' + i); if (el) el.style.display = 'none'; }); const bd = document.getElementById('sbp-backdrop'); if (bd) bd.style.display = 'none'; document.body.style.overflow = ''; sbpOpenForm = 0; }
function sbpStep2(n: number) { const err = document.getElementById('sbp' + n + '-err1')!; err.style.display = 'none'; const first = (document.getElementById('sbp' + n + '-first') as HTMLInputElement).value.trim(); const last = (document.getElementById('sbp' + n + '-last') as HTMLInputElement).value.trim(); const comp = (document.getElementById('sbp' + n + '-company') as HTMLInputElement).value.trim(); const email = (document.getElementById('sbp' + n + '-email') as HTMLInputElement).value.trim(); if (!first || !last) return sbpShowErr(err as HTMLElement, 'Please enter your first and last name.'); if (!comp) return sbpShowErr(err as HTMLElement, 'Please enter your company name.'); if (!email || !email.includes('@')) return sbpShowErr(err as HTMLElement, 'Please enter a valid email address.'); (document.getElementById('sbp' + n + '-login-email') as HTMLInputElement).value = email; document.getElementById('sbp' + n + '-step1')!.style.display = 'none'; document.getElementById('sbp' + n + '-step2')!.style.display = 'block'; (document.getElementById('sbp' + n + '-password') as HTMLInputElement).focus(); }
function sbpBackToStep1(n: number) { document.getElementById('sbp' + n + '-step2')!.style.display = 'none'; document.getElementById('sbp' + n + '-step1')!.style.display = 'block'; document.getElementById('sbp' + n + '-err2')!.style.display = 'none'; }
async function sbpCreateAccount(n: number) {
  const err = document.getElementById('sbp' + n + '-err2')!; const btn = document.getElementById('sbp' + n + '-create-btn') as HTMLButtonElement; err.style.display = 'none';
  const email = (document.getElementById('sbp' + n + '-login-email') as HTMLInputElement).value.trim(); const password = (document.getElementById('sbp' + n + '-password') as HTMLInputElement).value; const confirm = (document.getElementById('sbp' + n + '-confirm') as HTMLInputElement).value;
  if (password.length < 8) return sbpShowErr(err as HTMLElement, 'Password must be at least 8 characters.'); if (password !== confirm) return sbpShowErr(err as HTMLElement, 'Passwords do not match.'); if (!(document.getElementById('sbp' + n + '-agree') as HTMLInputElement).checked) return sbpShowErr(err as HTMLElement, 'Please agree to the Terms of Service and Privacy Policy.');
  btn.disabled = true; btn.textContent = 'Creating your account…';
  try {
    const res = await fetch(SBP_URL + '/functions/v1/manage-users', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SBP_ANON, 'apikey': SBP_ANON }, body: JSON.stringify({ action: 'create', email, password }) });
    const result = await res.json(); if (result.error) throw new Error(result.error);
    const sb = getSbpClient(); const { data: signInData, error: signInErr } = await sb.auth.signInWithPassword({ email, password }); if (signInErr) throw new Error(signInErr.message);
    const uid = signInData.user.id; const first = (document.getElementById('sbp' + n + '-first') as HTMLInputElement).value.trim(); const last = (document.getElementById('sbp' + n + '-last') as HTMLInputElement).value.trim(); const comp = (document.getElementById('sbp' + n + '-company') as HTMLInputElement).value.trim();
    await sb.auth.updateUser({ data: { full_name: first + ' ' + last } });
    const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    await sb.from('user_profiles').upsert({ id: uid, email, role: 'full_access', is_primary_owner: true, tenant_id: null, trial_ends_at: trialEnd, product: 'spraybosspro' }, { onConflict: 'id' });
    await sb.from('company_info').insert({ user_id: uid, company_name: comp, display_name: comp });
    await sb.from('platform_accounts').insert({ user_id: uid, email, plan: 'Monthly Subscription', plan_key: 'start', monthly_amount: 59, trial_ends_at: trialEnd, active: false });
    // Notify Mail@BossProHQ.com of the new trial signup. Fire-and-forget so a
    // notification hiccup can never block or break the signup itself.
    fetch(SBP_URL + '/functions/v1/notify-signup', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SBP_ANON }, body: JSON.stringify({ user_id: uid, event: 'signup' }) }).catch(() => {});
    const reasons = ['Cancel Maintaining Self','Cancel Sold House','Cancel Too Expensive','Cancel Unknown','Dropping Customer','Sold House'].map(nm => ({ name: nm, active: true, user_id: uid }));
    await sb.from('cancellation_reasons').insert(reasons);
    document.getElementById('sbp' + n + '-step2')!.style.display = 'none'; document.getElementById('sbp' + n + '-success')!.style.display = 'block'; try { (window as any).gtag?.('event', 'conversion', { send_to: 'AW-994175437/866BCK6h19gcEM3Th9oD', value: 59.0, currency: 'USD' }); } catch {}
    let secs = 4; const cd = document.getElementById('sbp' + n + '-countdown')!; cd.textContent = 'Redirecting in ' + secs + ' seconds…';
    const _ho = signInData.session ? ('#access_token=' + encodeURIComponent(signInData.session.access_token) + '&refresh_token=' + encodeURIComponent(signInData.session.refresh_token)) : '';
    const iv = setInterval(() => { secs--; if (secs <= 0) { clearInterval(iv); window.location.href = 'https://my.spraybosspro.com/dashboard.html' + _ho; } else cd.textContent = 'Redirecting in ' + secs + ' second' + (secs === 1 ? '' : 's') + '…'; }, 1000);
  } catch (e: any) { sbpShowErr(err as HTMLElement, e.message || 'Something went wrong. Please try again.'); btn.disabled = false; btn.textContent = 'Create My Account'; }
}
function sbpShowErr(el: HTMLElement, msg: string) { el.textContent = msg; el.style.display = 'block'; }

// "Have the owner text you" — soft lead capture for visitors not ready to start a trial.
// Emails the owner a SOFTWARE enquiry. no_lead:true stops it being filed as a lawn care Lead -
// the account id below is the owner's Hamann Lawn Care tenant, so without that flag a software
// question landed in the customer pipeline next to people wanting their yard sprayed.
const SBP_LEAD_ACCOUNT = '951ab5cd-c78a-4d90-9015-30f7c2197ac5';
function openTextMe() {
  const f = document.getElementById('sbp-textme'); const fab = document.getElementById('tm-fab');
  if (f) f.style.display = 'block'; if (fab) fab.style.display = 'none';
  const el = document.getElementById('tm-name') as HTMLInputElement | null; if (el) setTimeout(() => el.focus(), 30);
}
function closeTextMe() {
  const f = document.getElementById('sbp-textme'); const fab = document.getElementById('tm-fab');
  if (f) f.style.display = 'none'; if (fab) fab.style.display = 'flex';
}
async function sbpTextMe() {
  const err = document.getElementById('tm-err')!; err.style.display = 'none';
  const name = (document.getElementById('tm-name') as HTMLInputElement).value.trim();
  const phone = (document.getElementById('tm-phone') as HTMLInputElement).value.trim();
  if (!name) return sbpShowErr(err as HTMLElement, 'Please enter your name.');
  if (phone.replace(/\D/g, '').length < 10) return sbpShowErr(err as HTMLElement, 'Please enter a valid cell number.');
  const btn = document.getElementById('tm-btn') as HTMLButtonElement; btn.disabled = true; btn.textContent = 'Sending…';
  try {
    const res = await fetch(SBP_URL + '/functions/v1/submit-web-lead', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account: SBP_LEAD_ACCOUNT, source: 'website', no_lead: true, name, phone, message: 'SprayBossPro website — wants the owner to text them and help get set up.' }),
    });
    const j = await res.json();
    if (j && j.ok) {
      document.getElementById('tm-form')!.style.display = 'none';
      document.getElementById('tm-success')!.style.display = 'block';
      try { (window as any).gtag?.('event', 'generate_lead'); } catch {}
    } else { sbpShowErr(err as HTMLElement, (j && j.error) || 'Something went wrong. Please try again.'); btn.disabled = false; btn.textContent = 'Have the owner text me'; }
  } catch { sbpShowErr(err as HTMLElement, 'Network error. Please try again.'); btn.disabled = false; btn.textContent = 'Have the owner text me'; }
}

export default function Home() {
  useEffect(() => {
    // Supabase is loaded once globally via <Script> in app/layout.tsx — no per-page load needed.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || !sbpOpenForm) return;
      const n = sbpOpenForm;
      const form = document.getElementById('sbp-form-' + n);
      if (!form || form.style.display !== 'block') return;
      const step2 = document.getElementById('sbp' + n + '-step2');
      if (step2 && step2.style.display === 'block') sbpCreateAccount(n); else sbpStep2(n);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --purple-dark:#080010; --purple-mid:#0d0318; --purple-deep:#130520; --orange:#e07820; --orange-ink:#9d5416; --orange-dark:#c96a10; --blue:#5bbfff; --text:#1a1a2e; --muted:#555; --light-bg:#f8f7fc; --border:#e4e0f0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: var(--text); background: #fff; line-height: 1.6; }
        .hero { background: linear-gradient(135deg, #080010 0%, #130520 60%, #1e0a35 100%); padding: 100px 40px 80px; text-align: center; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; top: -120px; left: 50%; transform: translateX(-50%); width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(224,120,32,.15) 0%, transparent 70%); pointer-events: none; }
        .hero-badge { display: inline-block; background: rgba(224,120,32,.15); border: 1px solid rgba(224,120,32,.4); color: var(--orange); font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 6px 16px; border-radius: 20px; margin-bottom: 24px; }
        .hero h1 { color: #fff; font-size: clamp(32px, 5vw, 58px); font-weight: 800; line-height: 1.15; max-width: 820px; margin: 0 auto 20px; }
        .hero h1 span { color: var(--orange); }
        .hero p { color: rgba(255,255,255,.75); font-size: clamp(16px, 2vw, 20px); max-width: 620px; margin: 0 auto 40px; }
        .hero-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .btn-demo { display: inline-flex; align-items: center; gap: 9px; background: rgba(255,255,255,.07); border: 1.5px solid rgba(255,255,255,.32); color: #fff; font-size: 16px; font-weight: 700; padding: 15px 30px; border-radius: 8px; text-decoration: none; transition: background .18s, border-color .18s, transform .18s; }
        .btn-demo:hover { background: rgba(255,255,255,.14); border-color: rgba(255,255,255,.6); transform: translateY(-1px); }
        .btn-demo .btn-demo-dot { width: 8px; height: 8px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 0 3px rgba(74,222,128,.22); }
        .btn-primary { background: var(--orange); color: #fff; padding: 16px 36px; border-radius: 6px; font-size: 16px; font-weight: 700; text-decoration: none; transition: background .2s, transform .1s; display: inline-block; cursor: pointer; border: none; }
        .btn-primary:hover { background: var(--orange-dark); transform: translateY(-1px); }
        .hero-trust { flex-basis: 100%; text-align: center; color: rgba(255,255,255,.75); font-size: 14px; font-weight: 600; margin-top: 16px; letter-spacing: .2px; }
        .hero-trust b { color: var(--orange); font-weight: 800; }
        .btn-secondary { background: transparent; color: #fff; padding: 16px 36px; border-radius: 6px; font-size: 16px; font-weight: 600; text-decoration: none; border: 2px solid rgba(255,255,255,.3); transition: border-color .2s, background .2s; display: inline-block; }
        .btn-secondary:hover { border-color: #fff; background: rgba(255,255,255,.05); }
        .hero-stats { display: flex; justify-content: center; gap: 50px; margin-top: 64px; flex-wrap: wrap; }
        .hero-stat-val { color: var(--orange); font-size: 36px; font-weight: 800; }
        .hero-stat-lbl { color: rgba(255,255,255,.6); font-size: 13px; margin-top: 2px; }
        section { padding: 90px 40px; }
        .section-label { display: inline-block; color: var(--orange-ink); font-size: 12px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; margin-bottom: 12px; }
        .dark-section .section-label, .on-dark .section-label { color: var(--orange); }
        .section-title { font-size: clamp(26px, 4vw, 40px); font-weight: 800; line-height: 1.2; margin-bottom: 16px; color: var(--text); }
        .section-sub { color: var(--muted); font-size: 17px; max-width: 600px; margin-bottom: 56px; }
        .centered { text-align: center; }
        .centered .section-sub { margin-left: auto; margin-right: auto; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 1200px; margin: 0 auto; }
        .feature-card { background: #fff; border: 1.5px solid var(--border); border-radius: 12px; padding: 30px 28px; transition: box-shadow .2s, border-color .2s, transform .2s; }
        .feature-card:hover { box-shadow: 0 8px 32px rgba(8,0,16,.1); border-color: var(--orange); transform: translateY(-3px); }
        .feature-icon { font-size: 32px; margin-bottom: 14px; display: block; }
        .feature-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 10px; color: var(--text); }
        .feature-card p { color: var(--muted); font-size: 14px; line-height: 1.6; }
        .dark-section { background: linear-gradient(135deg, var(--purple-dark) 0%, var(--purple-deep) 100%); color: #fff; }
        .dark-section .section-title { color: #fff; }
        .dark-section .section-sub { color: rgba(255,255,255,.65); }
        .highlight-row { display: flex; align-items: center; gap: 60px; max-width: 1100px; margin: 0 auto; flex-wrap: wrap; }
        .highlight-row.reverse { flex-direction: row-reverse; }
        .highlight-text { flex: 1; min-width: 280px; }
        .highlight-text h2 { font-size: clamp(24px, 3vw, 36px); font-weight: 800; line-height: 1.2; margin-bottom: 16px; }
        .highlight-text p { font-size: 16px; color: var(--muted); margin-bottom: 20px; }
        .highlight-visual { flex: 1; min-width: 280px; background: linear-gradient(135deg, var(--purple-deep) 0%, #1e0a35 100%); border-radius: 14px; padding: 36px 32px; border: 2px solid rgba(224,120,32,.3); }
        .check-list { list-style: none; margin-top: 16px; }
        .check-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 15px; color: var(--muted); margin-bottom: 12px; }
        .check-list li::before { content: '✓'; background: var(--orange); color: #fff; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; margin-top: 2px; }
        .mock-item { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 12px 14px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; }
        .mock-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .mock-dot.orange { background: var(--orange); }
        .mock-dot.green { background: #22c55e; }
        .mock-dot.blue { background: var(--blue); }
        .mock-dot.yellow { background: #e8c000; }
        .mock-label { color: rgba(255,255,255,.85); font-size: 13px; font-weight: 600; }
        .mock-sub { color: rgba(255,255,255,.45); font-size: 11px; margin-top: 1px; }
        .mock-badge { margin-left: auto; background: var(--orange); color: #fff; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 10px; flex-shrink: 0; }
        .mock-badge.green-badge { background: #15803d; }
        .mock-badge.blue-badge { background: #2272c3; color: #fff; }
        .alert-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; max-width: 1100px; margin: 0 auto; }
        .alert-pill { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.12); border-radius: 10px; padding: 16px 18px; display: flex; align-items: center; gap: 12px; }
        .alert-pill .ap-icon { font-size: 22px; flex-shrink: 0; }
        .alert-pill .ap-label { color: rgba(255,255,255,.9); font-size: 14px; font-weight: 600; }
        .alert-pill .ap-sub { color: rgba(255,255,255,.45); font-size: 12px; }
        .stats-band { background: var(--orange); padding: 56px 40px; }
        .stats-band-inner { display: flex; justify-content: center; gap: 60px; max-width: 1000px; margin: 0 auto; flex-wrap: wrap; }
        .stat-item { text-align: center; }
        .stat-item .val { font-size: 44px; font-weight: 800; color: #111; line-height: 1; }
        .stat-item .lbl { color: #111; font-size: 14px; margin-top: 6px; }
        .pricing-grid { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; max-width: 1000px; margin: 0 auto; }
        .price-card { background: #fff; border: 2px solid var(--border); border-radius: 14px; padding: 36px 32px; width: 280px; position: relative; transition: box-shadow .2s, transform .2s; }
        .price-card:hover { box-shadow: 0 12px 40px rgba(8,0,16,.12); transform: translateY(-4px); }
        .price-card.featured { border-color: var(--orange); background: linear-gradient(180deg, #fff 0%, #fff8f2 100%); }
        .featured-badge { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--orange); color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 4px 14px; border-radius: 20px; white-space: nowrap; }
        .price-tier { font-size: 13px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .price-amount { font-size: 48px; font-weight: 800; color: var(--text); line-height: 1; }
        .price-amount sup { font-size: 22px; vertical-align: super; }
        .price-period { color: var(--muted); font-size: 13px; margin-bottom: 24px; margin-top: 4px; }
        .price-desc { color: var(--muted); font-size: 14px; margin-bottom: 24px; line-height: 1.5; }
        .price-features { list-style: none; margin-bottom: 32px; }
        .price-features li { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--text); padding: 6px 0; border-bottom: 1px solid var(--border); }
        .price-features li:last-child { border-bottom: none; }
        .price-features li::before { content: '✓'; color: var(--orange); font-weight: 700; flex-shrink: 0; }
        .price-btn { display: block; text-align: center; padding: 13px; border-radius: 6px; font-weight: 700; font-size: 15px; text-decoration: none; transition: background .2s; cursor: pointer; border: none; }
        .price-btn-primary { background: var(--orange); color: #fff; }
        .price-btn-primary:hover { background: var(--orange-dark); }
        .price-btn-outline { border: 2px solid var(--orange); color: var(--orange); }
        .price-btn-outline:hover { background: var(--orange); color: #fff; }
        .testimonial-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 1100px; margin: 0 auto; }
        .testimonial-card { background: #fff; border: 1.5px solid var(--border); border-radius: 12px; padding: 28px 26px; }
        .testimonial-stars { color: var(--orange); font-size: 18px; margin-bottom: 12px; letter-spacing: 2px; }
        .testimonial-body { font-size: 15px; color: var(--muted); line-height: 1.7; margin-bottom: 20px; font-style: italic; }
        .testimonial-author { font-weight: 700; font-size: 14px; color: var(--text); }
        .testimonial-role { font-size: 12px; color: var(--muted); }
        .cta-band { background: linear-gradient(135deg, var(--purple-dark) 0%, #1e0a35 100%); text-align: center; padding: 100px 40px; position: relative; overflow: hidden; }
        .cta-band::before { content: ''; position: absolute; bottom: -100px; left: 50%; transform: translateX(-50%); width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(224,120,32,.12) 0%, transparent 70%); pointer-events: none; }
        .cta-band h2 { color: #fff; font-size: clamp(28px, 4vw, 46px); font-weight: 800; margin-bottom: 16px; }
        .cta-band p { color: rgba(255,255,255,.7); font-size: 18px; margin-bottom: 40px; max-width: 560px; margin-left: auto; margin-right: auto; }
        footer { background: var(--purple-dark); padding: 50px 40px 30px; border-top: 1px solid rgba(255,255,255,.08); }
        .footer-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 32px; padding-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,.08); }
        .footer-brand .leaf { font-size: 28px; display: block; margin-bottom: 4px; }
        .footer-brand .name { color: #fff; font-size: 18px; font-weight: 700; }
        .footer-brand .sub { color: var(--blue); font-size: 12px; }
        .footer-brand p { color: rgba(255,255,255,.5); font-size: 13px; margin-top: 10px; max-width: 220px; line-height: 1.5; }
        .footer-links { color: rgba(255,255,255,.4); font-size: 13px; margin-top: 20px; text-align: center; }
        .footer-links a { color: rgba(255,255,255,.5); text-decoration: none; }
        .footer-links a:hover { color: #fff; }
        .premium-band { background: linear-gradient(135deg, var(--purple-dark) 0%, #1a0530 100%); padding: 90px 40px; text-align: center; position: relative; overflow: hidden; }
        .premium-band::before { content: ''; position: absolute; top: -80px; left: 50%; transform: translateX(-50%); width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(224,120,32,.1) 0%, transparent 65%); pointer-events: none; }
        .premium-band h2 { color: #fff; font-size: clamp(26px, 4vw, 44px); font-weight: 800; line-height: 1.2; max-width: 860px; margin: 0 auto 18px; }
        .premium-band h2 span { color: var(--orange); }
        .premium-band > p { color: rgba(255,255,255,.65); font-size: 17px; max-width: 700px; margin: 0 auto 52px; line-height: 1.8; }
        .premium-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; max-width: 1100px; margin: 0 auto; }
        .premium-card { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; padding: 28px 24px; text-align: left; transition: border-color .2s; }
        .premium-card:hover { border-color: var(--orange); }
        .premium-card-icon { font-size: 28px; margin-bottom: 14px; }
        .premium-card h3 { color: #fff; font-size: 16px; font-weight: 700; margin-bottom: 8px; }
        .premium-card p { color: rgba(255,255,255,.52); font-size: 13px; line-height: 1.6; }
        .lasso-map { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); border-radius: 10px; padding: 20px; margin-bottom: 14px; position: relative; min-height: 130px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .lasso-ring { position: absolute; top: 14px; left: 18px; right: 18px; bottom: 14px; border: 2.5px dashed var(--orange); border-radius: 50%; opacity: .7; }
        .lasso-pins { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; position: relative; z-index: 1; }
        .lpin { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; }
        .lpin.s { background: var(--orange); box-shadow: 0 0 0 3px rgba(224,120,32,.3); }
        .lpin.u { background: rgba(255,255,255,.2); }
        .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .stat-cell { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 12px 14px; }
        .stat-val { color: var(--orange); font-size: 18px; font-weight: 800; }
        .stat-lbl { color: rgba(255,255,255,.42); font-size: 11px; margin-top: 1px; }
        .stat-cell.full { grid-column: span 2; }
        .stat-cell.full .stat-val { color: #fff; font-size: 13px; font-weight: 600; }
        .simple-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; max-width: 1100px; margin: 0 auto; }
        .simple-card { background: #fff; border: 1.5px solid var(--border); border-radius: 12px; padding: 30px 26px; transition: border-color .2s, box-shadow .2s, transform .15s; }
        .simple-card:hover { border-color: var(--orange); box-shadow: 0 6px 24px rgba(224,120,32,.1); transform: translateY(-2px); }
        .simple-num { font-size: 40px; font-weight: 800; color: var(--orange-ink); opacity: .71; line-height: 1; margin-bottom: 12px; }
        .simple-card h3 { font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
        .simple-card p { color: var(--muted); font-size: 14px; line-height: 1.6; }
        @media (max-width: 700px) {
          nav { padding: 0 20px; } .nav-links { display: none; }
          section { padding: 60px 20px; } .hero { padding: 70px 20px 60px; }
          .hero-stats { gap: 30px; } .highlight-row, .highlight-row.reverse { flex-direction: column; }
          .stats-band-inner { gap: 36px; } footer { padding: 40px 20px 20px; }
        }
      `}</style>

      <Navbar onTrialClick={(el) => openSignupModal(1, el)} />

      {/* ── Floating "have the owner text you" widget (bottom-right, always on) ── */}
      <div style={{position:'fixed', right:'18px', bottom:'18px', zIndex:2000, display:'flex', flexDirection:'column', alignItems:'flex-end', fontFamily:"'Segoe UI', Arial, sans-serif"}}>
        <div id="sbp-textme" style={{display:'none', width:'min(330px, calc(100vw - 28px))', background:'#fff', borderRadius:16, boxShadow:'0 16px 50px rgba(0,0,0,.35)', overflow:'hidden', marginBottom:'12px'}}>
          <div style={{background:'linear-gradient(135deg,#130520,#1e0a35)', padding:'16px 18px', position:'relative'}}>
            <button onClick={closeTextMe} aria-label="Close" style={{position:'absolute', top:10, right:12, background:'none', border:'none', fontSize:22, color:'rgba(255,255,255,.7)', cursor:'pointer', lineHeight:1}}>&times;</button>
            <div style={{color:'#fff', fontSize:'16.5px', fontWeight:800, paddingRight:24}}>👋 Get set up by the owner</div>
            <div style={{color:'rgba(255,255,255,.78)', fontSize:'12.5px', marginTop:4, lineHeight:1.45}}>Drop your number &mdash; the owner texts you personally, answers your questions, and gets you set up. No pressure. Just <b style={{color:'#e07820'}}>from $59/mo</b>, no card to start.</div>
          </div>
          <div style={{padding:'16px 18px'}}>
            <div id="tm-form">
              <input id="tm-name" type="text" placeholder="Your name" style={{width:'100%', padding:'12px 14px', border:'2px solid #e4e0f0', borderRadius:9, fontSize:'14.5px', marginBottom:10, boxSizing:'border-box', fontFamily:'inherit', color:'#1a1a2e'}} />
              <input id="tm-phone" type="tel" placeholder="Cell phone" style={{width:'100%', padding:'12px 14px', border:'2px solid #e4e0f0', borderRadius:9, fontSize:'14.5px', marginBottom:6, boxSizing:'border-box', fontFamily:'inherit', color:'#1a1a2e'}} />
              <div id="tm-err" style={{display:'none', color:'#c0392b', fontSize:'12.5px', fontWeight:600, margin:'2px 0 6px'}} />
              <button id="tm-btn" onClick={sbpTextMe} style={{width:'100%', marginTop:8, background:'#e07820', color:'#fff', border:'none', borderRadius:9, padding:'13px', fontSize:'15px', fontWeight:800, cursor:'pointer'}}>Have the owner text me</button>
            </div>
            <div id="tm-success" style={{display:'none', textAlign:'center', padding:'12px 0'}}>
              <div style={{fontSize:40}}>✅</div>
              <div style={{fontSize:'17px', fontWeight:800, color:'#130520', margin:'6px 0 4px'}}>You&rsquo;re all set!</div>
              <div style={{fontSize:'13.5px', color:'#555'}}>The owner will text you shortly to get you rolling.</div>
            </div>
          </div>
        </div>
        <button id="tm-fab" onClick={openTextMe} style={{display:'flex', alignItems:'center', gap:'9px', background:'#b8590c', color:'#fff', border:'3px solid #000', borderRadius:'30px', padding:'14px 22px', fontSize:'15px', fontWeight:800, cursor:'pointer', boxShadow:'0 8px 24px rgba(224,120,32,.5)'}}>
          💬 Have the owner text you
        </button>
      </div>

      {/* ═══ MOCKUP IMAGE ═══ */}
      <div style={{background:'linear-gradient(135deg,#080010 0%,#130520 60%,#1e0a35 100%)', padding:'clamp(76px,7vw,80px) clamp(14px,4vw,40px) 0', textAlign:'center'}}>
        {/* ═══ AI ANSWERING — headline feature ═══ */}
        <style>{`
          @keyframes aiGlow { 0%,100% { box-shadow: 0 0 0 1px rgba(224,120,32,.55), 0 12px 40px rgba(224,120,32,.25); } 50% { box-shadow: 0 0 0 1px rgba(255,190,90,.9), 0 14px 56px rgba(224,120,32,.45); } }
          @keyframes aiStar { 0%,100% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(18deg) scale(1.15); } }
          .ai-card { max-width: 900px; margin: 0 auto clamp(28px,4vw,40px); text-align: left; border-radius: 18px; padding: clamp(20px,3vw,30px) clamp(18px,3.4vw,34px); background: linear-gradient(135deg, rgba(224,120,32,.16) 0%, rgba(30,10,53,.9) 55%, rgba(224,120,32,.10) 100%); animation: aiGlow 3.2s ease-in-out infinite; position: relative; }
          .ai-top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
          .ai-star { font-size: 26px; display: inline-block; animation: aiStar 2.4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(255,190,90,.8)); }
          .ai-tag { font-size: 11px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; color: #fff; background: #b8590c; border-radius: 20px; padding: 4px 11px; }
          .ai-soon { font-size: 11px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: #ffd28a; border: 1px solid rgba(255,210,138,.5); border-radius: 20px; padding: 3px 10px; }
          .ai-h { color: #fff; font-size: clamp(24px,3.6vw,38px); font-weight: 800; line-height: 1.15; margin: 0 0 8px; }
          .ai-h b { color: #e07820; }
          .ai-p { color: rgba(255,255,255,.82); font-size: clamp(15px,1.8vw,17px); line-height: 1.55; margin: 0 0 16px; max-width: 760px; }
          .ai-chips { display: flex; flex-wrap: wrap; gap: 8px; }
          .ai-chip { color: #fff; font-size: 13px; font-weight: 700; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.16); border-radius: 20px; padding: 6px 12px; }
          .top-h { color: #fff; font-size: clamp(24px,3.6vw,40px); font-weight: 800; line-height: 1.15; margin: 0 auto clamp(14px,2vw,20px); max-width: 900px; }
          .top-h span { color: #e07820; }
          .addons-label { color: #ffffff; font-size: clamp(26px,3.6vw,40px); font-weight: 900; letter-spacing: 3px; text-transform: uppercase; text-align: center; margin: 8px 0 14px; }
          .top-cta { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin: 4px 0 clamp(26px,4vw,40px); }
          .cta-demo { background: #b8590c; color: #fff; font-weight: 800; font-size: 17px; padding: 15px 28px; border-radius: 10px; text-decoration: none; box-shadow: 0 10px 30px rgba(224,120,32,.45); }
          .cta-trial { background: transparent; color: #fff; font-weight: 800; font-size: 17px; padding: 14px 26px; border-radius: 10px; text-decoration: none; border: 2px solid rgba(255,255,255,.5); }
          .addons { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; max-width: 1200px; margin: 0 auto clamp(30px,4vw,44px); align-items: stretch; }
          .addons .ai-card { margin: 0; max-width: none; }
          .addons .ai-h { font-size: clamp(22px,2.4vw,28px); }
          @media (max-width: 900px) { .addons { grid-template-columns: 1fr; } }
          .ss-btn { margin-top: 4px; background: #b8590c; color: #fff; border: none; border-radius: 10px; padding: 12px 18px; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,.35); }
          .ss-go { background: #b8590c; }
          .hero-mock { display: block; width: 100%; max-width: 1200px; height: auto; margin: 0 auto; padding-bottom: clamp(40px,6vw,80px); }
          .hero-video { display: block; width: 100%; max-width: 960px; margin: 0 auto; border-radius: 14px; box-shadow: 0 18px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(224,120,32,.35); background: #000; }
          .video-cap { color: rgba(255,255,255,.6); font-size: 13px; font-weight: 700; margin-top: 10px; letter-spacing: .3px; }
          .ai-pill { display: inline-flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; max-width: 900px; margin: 0 auto clamp(18px,3vw,26px); padding: 8px 16px 8px 12px; border-radius: 30px; background: rgba(255,255,255,.06); color: rgba(255,255,255,.9); font-size: clamp(13px,1.6vw,15px); line-height: 1.35; animation: aiGlow 3.2s ease-in-out infinite; }
          .ai-pill .ai-star { font-size: 18px; }
          .ai-pill b { color: #fff; } .ai-pill .ai-price { color: #e07820; }
        `}</style>
        <h2 className="top-h">CRM &amp; Scheduling Software for <span>Lawn Care &amp; Pest Control</span></h2>

        {/* Price, up top above the mockup */}
        <div style={{textAlign:'center', marginBottom:'clamp(22px,3vw,32px)'}}>
          <div style={{display:'inline-flex', alignItems:'baseline', gap:'12px', flexWrap:'wrap', justifyContent:'center', color:'#fff'}}>
            <span style={{fontSize:'clamp(30px,4.6vw,46px)', fontWeight:800, lineHeight:1}}><span style={{fontSize:'.46em', fontWeight:700, color:'rgba(255,255,255,.6)'}}>CRM Software starting at </span>$59<span style={{fontSize:'.46em', fontWeight:700, color:'rgba(255,255,255,.6)'}}>/month</span></span>
            <span style={{fontSize:'clamp(16px,2.2vw,22px)', fontWeight:800, color:'#e07820'}}>&middot; 14-Day Free Trial</span>
          </div>
          <div style={{color:'rgba(255,255,255,.6)', fontSize:'13px', fontWeight:600, marginTop:'7px', letterSpacing:'.3px'}}>No credit card required &middot; Cancel anytime</div>
        </div>
<div className="top-cta"><a href="https://my.spraybosspro.com/demo.html" target="_blank" rel="noopener" className="cta-demo" onClick={(e) => { if (typeof window !== 'undefined' && screen.availWidth > 900) { e.preventDefault(); window.open((e.currentTarget as HTMLAnchorElement).href, 'bossprodemo', 'width=' + screen.availWidth + ',height=' + screen.availHeight + ',left=0,top=0,resizable=yes,scrollbars=yes'); }  try { if (localStorage.getItem('bp_notrack') !== '1') pixelDemoStarted(); } catch (e) { pixelDemoStarted(); } }}>&#9654; Try the Live Demo</a><a href="#" onClick={(e) => { e.preventDefault(); openSignupModal(1, e.currentTarget as HTMLElement); }} className="cta-trial">Start Free Trial</a></div>
        <link rel="preload" as="image" href="/walkthrough-poster.webp" fetchPriority="high" />
        <video className="hero-video" onPlay={() => { try { if (localStorage.getItem('bp_notrack') !== '1') pixelDemoStarted(); } catch (e) { pixelDemoStarted(); } }} controls preload="none" poster="/walkthrough-poster.webp"><source src="/spraybosspro-walkthrough.mp4" type="video/mp4" /></video>
        <div className="video-cap">&#9654; Watch the full 2-minute walkthrough</div>
        <div className="addons-label" style={{marginTop:'clamp(28px,4vw,44px)'}}>Add-ons</div>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.82)', fontSize: 'clamp(14px,1.7vw,16px)', lineHeight: 1.55, margin: '-6px auto 18px', maxWidth: 720 }}>All optional &mdash; use the ones you want, skip the ones you don&apos;t. Everything else in SprayBossPro works the same either way, and you can turn any of them on or off anytime.</p>
        <div className="addons">
        <div className="ai-card">
          <div className="ai-top">
            <span className="ai-star" aria-hidden="true">&#11088;</span>
            <span className="ai-tag">AI Answering</span>
            <span className="ai-soon">New Add-On</span>
          </div>
          <h2 className="ai-h">An AI receptionist for only <b>49&cent; a minute</b></h2>
          <p className="ai-p ai-vol" style={{ fontWeight: 700, marginTop: 4 }}>Answering 100+ calls a day? Email <a href="mailto:Support@bossprohq.com" style={{ color: 'inherit', textDecoration: 'underline' }}>Support@bossprohq.com</a> for our 29&cent; volume rate.</p>
          <p className="ai-p">The most real, human-sounding AI on the market &mdash; and it&apos;s built into SprayBossPro, so it doesn&apos;t just take messages. It knows your customers and your CRM, tells them when you&apos;re coming, skips and reschedules services, tells existing customers your pricing and adds new services, sends a secure form to update their card, and takes down new customers for you. 24/7. You only pay when it answers.</p>
          <div className="ai-chips">
            <span className="ai-chip">&#128222; Answers every call, 24/7</span>
            <span className="ai-chip">&#129504; Knows your customers &amp; CRM</span>
            <span className="ai-chip">&#128197; Skips &amp; reschedules</span>
            <span className="ai-chip">&#128178; Quotes &amp; adds services</span>
            <span className="ai-chip">&#128179; Sends card-update form</span>
            <span className="ai-chip">&#128221; Takes new leads</span>
            <span className="ai-chip">&#9989; No monthly fee</span>
          </div>
        </div>
        <div className="ai-card">
          <div className="ai-top">
            <span className="ai-star" aria-hidden="true">&#10024;</span>
            <span className="ai-tag">AI Assistant</span>
            <span className="ai-soon">Included on every plan</span>
          </div>
          <h2 className="ai-h">An AI office assistant that <b>does the work</b></h2>
          <p className="ai-p ai-vol" style={{ fontWeight: 700, marginTop: 4 }}>Included on every plan &mdash; see the plans below for how many questions each one comes with.</p>
          <p className="ai-p">Just tell it what to do &mdash; like you&apos;d tell your office manager. It&apos;s built into SprayBossPro, so it knows your customers, your schedule and your money. It schedules and moves visits, adds plans at your price-table prices, texts customers, sends invoices and card forms, runs reports like your sales tax, and opens any page you ask for. It shows you every change first, and nothing happens until you press Confirm.</p>
          <div className="ai-chips">
            <span className="ai-chip">&#128197; Schedules &amp; moves visits</span>
            <span className="ai-chip">&#10133; Adds plans &amp; customers</span>
            <span className="ai-chip">&#128172; Texts customers</span>
            <span className="ai-chip">&#128196; Sends invoices</span>
            <span className="ai-chip">&#128202; Reports in seconds</span>
            <span className="ai-chip">&#129517; Opens any page</span>
            <a className="ai-chip" href="#ai-assistant" style={{ textDecoration: 'none' }}>&#128064; See it work &rarr;</a>
          </div>
        </div>
        <div className="ai-card" style={{ gridColumn: '1 / -1' }}>
          <div className="ai-top">
            <span className="ai-star" aria-hidden="true">&#128236;</span>
            <span className="ai-tag">Neighbor Postcards</span>
            <span className="ai-soon">New Add-On</span>
          </div>
          <h2 className="ai-h">Every finished job mails <b>your neighbors</b></h2>
          <p className="ai-p ai-vol" style={{ fontWeight: 700, marginTop: 4 }}>$1.59 a postcard, printing and postage included. No monthly fee.</p>
          <p className="ai-p" style={{ marginTop: -6 }}>Mailed within 1&ndash;2 business days of the job, First Class. Usually arrives 5&ndash;10 business days after that.</p>
          <p className="ai-p">When your crew finishes a job, SprayBossPro automatically mails your postcard to the closest homes on that street &mdash; 5, 10, 20 or as many as you want &mdash; and skips anyone who&apos;s already your customer. Pick a template or make it 100% your own with the drag-and-drop designer, set a monthly budget, and see every card that went out. Or pick properties on your list and mail around all of them at once.</p>
          <div className="ai-chips">
            <span className="ai-chip">&#128236; Mails after every job</span>
            <span className="ai-chip">&#127969; Closest neighbors, not random</span>
            <span className="ai-chip">&#128683; Skips current customers</span>
            <span className="ai-chip">&#127912; Templates or fully custom</span>
            <span className="ai-chip">&#128207; QR code to book</span>
            <span className="ai-chip">&#128176; Monthly budget cap</span>
          </div>
        </div>
        <div className="ai-card" style={{ gridColumn: '1 / -1' }}>
          <div className="ai-top">
            <span className="ai-star" aria-hidden="true">&#129534;</span>
            <span className="ai-tag">Costs &amp; Receipts</span>
            <span className="ai-soon">New &middot; Included</span>
          </div>
          <h2 className="ai-h">Snap a receipt. <b>See where the money goes.</b></h2>
          <p className="ai-p ai-vol" style={{ fontWeight: 700, marginTop: 4 }}>Keeps track of all your costs. Included on every plan.</p>
          <p className="ai-p">In the SprayBossPro crew app, your techs tap Menu &gt; Receipts and take a picture. AI reads the amount, store and date and picks the cost type, then they pick the truck and the job. No signal? It saves on the phone and uploads later. In the office, Costs &amp; Receipts adds it all up by type, truck, employee, job and month for any dates. Make your own cost types like Gas, Chemicals, Equipment and Repairs, add costs with no receipt like insurance or software, and export it for your bookkeeper.</p>
          <div className="ai-chips">
            <span className="ai-chip">&#128181; Tracks every cost</span>
            <span className="ai-chip">&#128248; Snap a receipt</span>
            <span className="ai-chip">&#129302; AI fills it in</span>
            <span className="ai-chip">&#127991;&#65039; Your own cost types</span>
            <span className="ai-chip">&#128666; By truck &amp; job</span>
            <span className="ai-chip">&#128202; Totals by type &amp; month</span>
            <span className="ai-chip">&#128246; Works offline</span>
          </div>
        </div>
        <div className="ai-card" style={{ gridColumn: '1 / -1' }}>
          <div className="ai-top">
            <span className="ai-star" aria-hidden="true">&#127760;</span>
            <span className="ai-tag">Free Website</span>
            <span className="ai-soon">Included</span>
          </div>
          <h2 className="ai-h">A professional website, <b>free</b> with any paid plan</h2>
          <p className="ai-p ai-vol" style={{ fontWeight: 700, marginTop: 4 }}>Websites like this often cost $5,000&ndash;$15,000 to have built. Yours is free.</p>
          <p className="ai-p">We build it for you &mdash; a perfectly built 200&ndash;300 page website with a free domain, or use your own. Built to score 90+ on Google, and 100 on SEO, and we send you the score report once it&apos;s built. Fast on every phone, and every form on it goes straight into SprayBossPro as a new lead.</p>
          <div className="ai-chips">
            <span className="ai-chip">&#127760; Free domain (or use yours)</span>
            <span className="ai-chip">&#128196; 200&ndash;300 pages</span>
            <span className="ai-chip">&#128200; 90+ and 100 on SEO</span>
            <span className="ai-chip">&#128221; Forms flow into your CRM</span>
            <span className="ai-chip">&#128241; Mobile-perfect</span>
            <span className="ai-chip">&#128736; We build it for you</span>
          </div>
          <p className="ai-p" style={{margin:'14px 0 10px'}}>Compare our score to any other website you&apos;ve been quoted &mdash; or the one you have now.</p>
          <SiteScore />
        </div>
        </div>
        {/* 10/31 owner: highlight offline crew app + QuickBooks auto-sync */}
        <div className="hl-band" style={{display:'flex', flexWrap:'wrap', justifyContent:'center', gap:16, maxWidth:1000, margin:'0 auto 22px', padding:'0 16px'}}>
          <div style={{flex:'1 1 300px', maxWidth:480, background:'rgba(255,255,255,.07)', border:'2px solid #facc15', borderRadius:14, padding:'16px 18px', boxShadow:'0 0 24px rgba(250,204,21,.18)'}}>
            <div style={{display:'flex', alignItems:'center', gap:10, fontWeight:900, fontSize:19, color:'#fff', marginBottom:6}}><span style={{fontSize:26}}>&#128246;</span>Works even when you&apos;re offline</div>
            <p style={{margin:0, color:'#e5e7eb', fontSize:15, lineHeight:1.55}}>No signal? No problem. The crew app keeps working: jobs, notes, photos and estimates save on the phone and sync the moment you&apos;re back online.</p>
          </div>
          <div style={{flex:'1 1 300px', maxWidth:480, background:'rgba(255,255,255,.07)', border:'2px solid #facc15', borderRadius:14, padding:'16px 18px', boxShadow:'0 0 24px rgba(250,204,21,.18)'}}>
            <div style={{display:'flex', alignItems:'center', gap:10, fontWeight:900, fontSize:19, color:'#fff', marginBottom:6}}><span style={{fontSize:26}}>&#128260;</span>QuickBooks syncs automatically every 5 minutes</div>
            <p style={{margin:0, color:'#e5e7eb', fontSize:15, lineHeight:1.55}}>Connect QuickBooks Online with one click. Your customers, invoices and payments sync to QuickBooks every 5 minutes, so there&apos;s no double entry.</p>
          </div>
        </div>
        <div className="integ-strip" style={{display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'center', gap:'10px 14px', maxWidth:1000, margin:'0 auto clamp(26px,4vw,40px)', color:'rgba(255,255,255,.82)', fontSize:'clamp(14px,1.7vw,16px)', textAlign:'center'}}>
          <span style={{fontWeight:800, color:'#fff'}}>Integrates with</span>
          <span style={{display:'inline-flex', alignItems:'center', gap:7, background:'#fff', color:'#1f1f1f', borderRadius:20, padding:'6px 14px', fontWeight:800}}><span aria-hidden="true" style={{width:10, height:10, borderRadius:'50%', background:'#ff4f00'}}></span>Zapier</span>
          <span style={{display:'inline-flex', alignItems:'center', gap:7, background:'#fff', color:'#1f1f1f', borderRadius:20, padding:'6px 14px', fontWeight:800}}><span aria-hidden="true" style={{width:10, height:10, borderRadius:'50%', background:'#6d00cc'}}></span>Make</span>
          <span style={{fontWeight:800, color:'#fff', marginLeft:6}}>Payroll</span>
          <span style={{display:'inline-flex', alignItems:'center', gap:7, background:'#fff', color:'#1f1f1f', borderRadius:20, padding:'6px 14px', fontWeight:800}}><span aria-hidden="true" style={{width:10, height:10, borderRadius:'50%', background:'#f45d48'}}></span>Gusto</span>
          <span style={{display:'inline-flex', alignItems:'center', gap:7, background:'#fff', color:'#1f1f1f', borderRadius:20, padding:'6px 14px', fontWeight:800}}><span aria-hidden="true" style={{width:10, height:10, borderRadius:'50%', background:'#2ca01c'}}></span>QuickBooks</span>
          <span style={{display:'inline-flex', alignItems:'center', gap:7, background:'#fff', color:'#1f1f1f', borderRadius:20, padding:'6px 14px', fontWeight:800}}><span aria-hidden="true" style={{width:10, height:10, borderRadius:'50%', background:'#d0271d'}}></span>ADP</span>
          <span style={{display:'inline-flex', alignItems:'center', gap:7, background:'#fff', color:'#1f1f1f', borderRadius:20, padding:'6px 14px', fontWeight:800}}><span aria-hidden="true" style={{width:10, height:10, borderRadius:'50%', background:'#004b8d'}}></span>Paychex</span>
          <span>Connect to thousands of apps, and run payroll: hours, overtime, tips &amp; bonuses</span>
        </div>
        <img src="/hero-mockup.webp" srcSet="/hero-mockup-640.webp 640w, /hero-mockup.webp 1200w" sizes="(max-width: 700px) 100vw, 1200px" loading="lazy" decoding="async" alt="SprayBossPro software on a laptop with the AI Assistant button and a hand-drawn map lasso, plus the client app and crew app on phones" className="hero-mock" width={1600} height={880} />
      </div>

      {/* The 3 plans, right after the top picture and before the real-picture sections (owner, 10/30). */}
      <PlanCompare onTrial={(el) => openSignupModal(1, el)} />

      {/* ═══ BILLING DEEP DIVE ═══ */}
      <section id="billing" style={{background:'var(--light-bg)'}}>
        <div className="highlight-row reverse">
          <div className="highlight-text">
            <h2>Getting paid without chasing anyone</h2>
            <p>Turn on automatic invoicing and SprayBossPro emails the invoice the morning after the job and charges the card on file on the schedule you set — or leave both off and send them by hand. Build an estimate in minutes, email it from the platform, and let clients accept it with a single click. The moment they accept, convert it to an invoice and collect payment — all without leaving SprayBossPro.</p>
            <p><strong>Fully customizable, top to bottom.</strong> Change every color, choose exactly what shows and what doesn&apos;t, and pick from over 100 preloaded header photos &mdash; or upload your own photos and logos.</p>
            <ul className="check-list">
              <li>Estimate builder with your service catalog and line items</li>
              <li>Email estimates via Resend with custom branded templates</li>
              <li>Client-facing estimate page with Accept / Decline buttons</li>
              <li>Automatic status tracking: Draft → Sent → Accepted → Invoiced</li>
              <li>Invoice management with unpaid, partial, paid, and overdue filters</li>
              <li>Card-on-file for quick payment collection</li>
              <li>Sales tax management by jurisdiction with tax reports</li>
              <li>Discount codes — percentage or fixed dollar amount</li>
              <li>Full payment history with method, date, and reference tracking</li>
            </ul>
          </div>
          <div className="highlight-visual" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', alignItems:'start', padding:'24px', background:'#7d838c', border:'none'}}>
              <figure style={{margin:0}}>
                <figcaption style={{color:'#ffffff', fontWeight:700, fontSize:'12px', textAlign:'center', marginBottom:'10px', textTransform:'uppercase', letterSpacing:'1px'}}>Branded Estimate</figcaption>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/branded-estimate-v5.webp" width={900} height={2399} loading="lazy" decoding="async" alt="Branded estimate email with the company logo, a header photo, service badges and an Approve Estimate button" style={{display:'block', width:'100%', height:'auto', borderRadius:'8px', boxShadow:'0 10px 30px rgba(0,0,0,.35)', border:'3px solid #ffffff'}} />
              </figure>
              <figure style={{margin:0}}>
                <figcaption style={{color:'#ffffff', fontWeight:700, fontSize:'12px', textAlign:'center', marginBottom:'10px', textTransform:'uppercase', letterSpacing:'1px'}}>Branded Invoice</figcaption>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/branded-invoice-v5.webp" width={900} height={1683} loading="lazy" decoding="async" alt="Branded invoice email with line items, sales tax, amount due and a Pay Now button" style={{display:'block', width:'100%', height:'auto', borderRadius:'8px', boxShadow:'0 10px 30px rgba(0,0,0,.35)', border:'3px solid #ffffff'}} />
              </figure>
          </div>
        </div>
      </section>

      {/* ═══ MEETINGS: real screenshots of the Meetings page and Meeting Alerts (10/29) ═══ */}
      <section id="ai-assistant" aria-label="AI office assistant" style={{ background: '#ffffff', padding: 'clamp(44px,7vw,80px) 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 'clamp(24px,4vw,48px)', alignItems: 'center' }}>
          <figure style={{ margin: 0, background: '#7d838c', borderRadius: 16, padding: 'clamp(14px,2.5vw,24px)' }}>
            <figcaption style={{ color: '#ffffff', fontWeight: 700, fontSize: 12, textAlign: 'center', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>A Real Task, Start to Finish</figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ai-assistant.webp" width={720} height={938} loading="lazy" decoding="async" alt="AI Assistant scheduling a Mosquito Control visit for Tuesday, with a Confirm card" style={{ display: 'block', width: '100%', maxWidth: 420, margin: '0 auto', height: 'auto', borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,.35)', border: '3px solid #ffffff' }} />
          </figure>
          <div>
            <span style={{ display: 'inline-block', color: '#ff6a00', fontWeight: 900, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>AI Assistant</span>
            <h2 style={{ color: '#111827', fontSize: 'clamp(26px,3.8vw,42px)', fontWeight: 900, lineHeight: 1.12, margin: '0 0 12px' }}>Your AI Office Assistant. Just Tell It What To Do.</h2>
            <p style={{ color: '#4b5563', fontSize: 'clamp(15px,1.9vw,18px)', lineHeight: 1.7, margin: '0 0 14px' }}>It&apos;s built right into SprayBossPro and knows your customers, your schedule and your money. Type "Schedule Mary Jones&apos;s Mosquito Control for this Tuesday" and it finds the job, picks the date and shows you a card. Nothing changes until you press Confirm.</p>
            <p style={{ color: '#111827', fontSize: 15.5, fontWeight: 800, margin: '0 0 10px' }}>Talk to it like you&apos;d talk to your office manager:</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'grid', gap: '8px' }}>
              {[
                ['"Schedule the Smiths for Tuesday"', 'Done'],
                ['"Add a plan for Dirk at $50 a visit"', 'Done'],
                ['"Text Mary we\'re running late"', 'Sent'],
                ['"Take me to unpaid invoices"', 'Opens the page'],
                ['"How much sales tax did I collect last month?"', 'Answered in seconds'],
                ['"How do I set up auto-billing?"', 'Explains it, with an Open button'],
              ].map(([say, did]) => (
                <li key={say} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 10px', background: '#f3f4f6', borderRadius: 10, padding: '9px 12px', fontSize: 15, lineHeight: 1.45 }}>
                  <span style={{ color: '#111827', fontStyle: 'italic', fontWeight: 600 }}>{say}</span>
                  <span style={{ color: '#16a34a', fontWeight: 900, whiteSpace: 'nowrap' }}>&rarr; {did}</span>
                </li>
              ))}
            </ul>
            <p style={{ color: '#4b5563', fontSize: 15, lineHeight: 1.6, margin: '0 0 12px' }}>It shows you every change first. Nothing happens until you press <b>Confirm</b>.</p>
            <p style={{ color: '#111827', fontSize: 15.5, lineHeight: 1.6, margin: 0, fontWeight: 700 }}>Included on every plan: 50, 100 or 250 questions a month. Need more? 250 more for $15.</p>
          </div>
        </div>
      </section>

      <section id="meetings" aria-label="Meetings and booking link" style={{ background: '#f6f7f9', padding: 'clamp(44px,7vw,80px) 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto clamp(22px,3.5vw,36px)' }}>
            <span style={{ display: 'inline-block', color: '#ff6a00', fontWeight: 900, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Meetings</span>
            <h2 style={{ color: '#111827', fontSize: 'clamp(26px,3.8vw,42px)', fontWeight: 900, lineHeight: 1.12, margin: '0 0 12px' }}>Book Meetings. Get a YES Back by Text.</h2>
            <p style={{ color: '#4b5563', fontSize: 'clamp(15px,1.9vw,18px)', lineHeight: 1.7, margin: 0 }}>Estimate walkthroughs, phone calls or video meetings &mdash; your customers pick a day and time from your booking link, or you and your staff set it up for them. SprayBossPro texts them right away and sends reminders before, and when they reply YES or NO the meeting marks itself Confirmed or Can&apos;t make it.</p>
          </div>
          <div style={{ background: '#7d838c', borderRadius: 16, padding: 'clamp(14px,2.5vw,24px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 18, alignItems: 'start' }}>
            <figure style={{ margin: 0 }}>
              <figcaption style={{ color: '#ffffff', fontWeight: 700, fontSize: 12, textAlign: 'center', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Your Meetings Page</figcaption>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/meetings-list.webp" width={1200} height={617} loading="lazy" decoding="async" alt="Meetings page: upcoming meetings by day with Confirmed, Waiting on reply and Booked online tags, a Copy booking link button and New Meeting" style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8, boxShadow: '0 10px 30px rgba(0,0,0,.35)', border: '3px solid #ffffff' }} />
            </figure>
            <figure style={{ margin: 0 }}>
              <figcaption style={{ color: '#ffffff', fontWeight: 700, fontSize: 12, textAlign: 'center', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>The Texts They Get</figcaption>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/meetings-alerts.webp" width={1000} height={921} loading="lazy" decoding="async" alt="Meeting Alerts: reminders 1 day and 1 hour before, a Reply YES to confirm option, and the booked text with a live preview" style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8, boxShadow: '0 10px 30px rgba(0,0,0,.35)', border: '3px solid #ffffff' }} />
            </figure>
            <figure style={{ margin: 0, gridColumn: '1 / -1' }}>
              <figcaption style={{ color: '#ffffff', fontWeight: 700, fontSize: 12, textAlign: 'center', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Turn Each One On or Off Under Alerts</figcaption>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/meetings-toggles.webp" width={1400} height={439} loading="lazy" decoding="async" alt="Alerts page, Client Meeting Alerts: Meeting Booked, Reminder, Moved and Canceled, each with its own Text and Email switch" style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8, boxShadow: '0 10px 30px rgba(0,0,0,.35)', border: '3px solid #ffffff' }} />
            </figure>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 'clamp(20px,3vw,30px) auto 0', maxWidth: 1000, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px 28px' }}>
            {[
              'Customers book themselves from your link',
              'Or you and your staff book it for them',
              'In person, phone or video',
              'Booked, moved and canceled texts',
              'Reminders whenever you want them',
              'YES / NO replies confirm on their own',
              'Assign each meeting to someone on your team',
              'Turn it on any time in Settings › Add-ons',
            ].map((t) => (
              <li key={t} style={{ display: 'flex', gap: 10, color: '#374151', fontSize: 15.5, lineHeight: 1.5 }}><span style={{ color: '#16a34a', fontWeight: 900 }}>✓</span>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Business in a box" style={{ background: '#ffffff', padding: 'clamp(44px,7vw,80px) 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(24px,4vw,40px)' }}>
            <h2 style={{ color: '#111827', fontSize: 'clamp(28px,4.2vw,46px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 12px' }}>Your whole business <span style={{ color: '#b8590c' }}>in a box.</span></h2>
            <p style={{ color: '#4b5563', fontSize: 'clamp(15px,1.9vw,19px)', lineHeight: 1.6, margin: '0 auto', maxWidth: 760 }}>From the first phone call to the 5-star review, everything a lawn care and pest control company runs on, in one login. Stop paying 7 companies.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 22, alignItems: 'stretch' }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 16, padding: 'clamp(18px,3vw,28px)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: '#6b7280', marginBottom: 12 }}>What it costs to piece together</div>
              {[
                ['Scheduling, CRM & routing software', 150, ''],
                ['Crew app: estimates, invoices & payments in the field', 50, ''],
                ['Online payments: pay-by-email invoices & card on file', 50, ''],
                ['Texting & automatic customer alerts', 50, ''],
                ['Website, hosting & SEO', 150, ''],
                ['Social media inbox & post scheduler', 99, 'Launching soon'],
                ['AI receptionist that answers calls, books, reschedules, sends card-update forms & so much more', 200, ''],
              ].map(([name, price, tag]) => (
                <div key={name as string} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderBottom: '1px solid #f1f1f1', fontSize: 15.5, color: '#1f2937' }}>
                  <span style={{ color: '#16a34a', fontWeight: 900 }} aria-hidden="true">&#10003;</span>
                  <span style={{ flex: 1 }}>{name}{tag ? <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 800, color: '#92400e', background: '#fef3c7', borderRadius: 10, padding: '2px 8px', whiteSpace: 'nowrap' }}>{tag}</span> : null}</span>
                  <span style={{ fontWeight: 700, color: '#6b7280', whiteSpace: 'nowrap' }}>${price}+/mo</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, paddingTop: 14, fontSize: 17, fontWeight: 800, color: '#111827' }}>
                <span style={{ flex: 1 }}>Typical total</span>
                <span style={{ color: '#b91c1c', textDecoration: 'line-through', fontSize: 22 }}>$749+/mo</span>
              </div>
              <p style={{ fontSize: 12, color: '#6b7280', margin: '10px 0 0', lineHeight: 1.5 }}>Typical starting prices for separate tools. Your costs may vary.</p>
            </div>
            <div style={{ background: '#0b0b12', borderRadius: 16, padding: 'clamp(22px,3.4vw,34px)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 18px 50px rgba(184,89,12,.25)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,.65)', marginBottom: 10 }}>SprayBossPro</div>
              <div style={{ fontSize: 'clamp(22px,2.8vw,30px)', fontWeight: 900, lineHeight: 1.2, marginBottom: 6 }}>All of it, in one place</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '6px 0 14px' }}>
                <span style={{ fontSize: 15, color: 'rgba(255,255,255,.7)', fontWeight: 700 }}>starting at</span>
                <span style={{ fontSize: 'clamp(46px,6vw,64px)', fontWeight: 900, color: '#f59e3b', lineHeight: 1 }}>$59</span>
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,.7)', fontWeight: 700 }}>/month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', fontSize: 15.5, lineHeight: 1.9, color: 'rgba(255,255,255,.9)' }}>
                <li>&#10003; Every tool listed here, one login</li>
                <li>&#10003; Free website + domain included</li>
                <li>&#10003; AI answering only when it answers: 49&cent;/min</li>
                <li>&#10003; Unlimited clients &amp; properties, no per-user fees</li>
                <li>&#10003; Connects to thousands of apps with Zapier &amp; Make</li>
              </ul>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); openSignupModal(1, e.currentTarget as HTMLElement); }} style={{ background: '#b8590c', color: '#fff', fontWeight: 800, fontSize: 16, padding: '13px 22px', borderRadius: 10, textDecoration: 'none' }}>Start 14-Day Free Trial</a>
                <a href="https://my.spraybosspro.com/demo.html" target="_blank" rel="noopener" style={{ color: '#fff', fontWeight: 800, fontSize: 16, padding: '12px 20px', borderRadius: 10, textDecoration: 'none', border: '2px solid rgba(255,255,255,.45)' }}>Try the Live Demo</a>
              </div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.6)', marginTop: 12 }}>No credit card required &middot; Cancel anytime</div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Our promise" style={{ background: '#0b0b12', padding: 'clamp(40px,6vw,64px) 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: 'clamp(24px,3.4vw,38px)', fontWeight: 800, lineHeight: 1.2, margin: '0 auto 12px', maxWidth: 900 }}>We give you everything you need to succeed, <span style={{ color: 'var(--orange)' }}>because we want you to win.</span></h2>
        <p style={{ color: 'rgba(255,255,255,.82)', fontSize: 'clamp(15px,1.8vw,18px)', lineHeight: 1.6, margin: '0 auto', maxWidth: 760 }}>Software, a free website, AI answering, and a real owner who&apos;ll move your data and pick up the phone.</p>
      </section>
      <section aria-label="Your data is yours" style={{ background: '#f6f7f9', padding: 'clamp(40px,6vw,70px) 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: '#111827', fontSize: 'clamp(26px,3.6vw,40px)', fontWeight: 800, lineHeight: 1.15, margin: '0 0 10px' }}>Your data is yours. Period.</h2>
          <p style={{ color: '#4b5563', fontSize: 'clamp(15px,1.8vw,18px)', lineHeight: 1.6, margin: '0 auto 28px', maxWidth: 720 }}>Moving your business into new software is a big deal. Here is our promise, in writing.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14, textAlign: 'left' }}>
            {[
              ['\u{1F512}', 'We never sell your data', 'Not your info, not your customers\u2019. Not ever, to anyone.'],
              ['\u{1F91D}', 'Your customers are yours', 'We never contact, market to, or sell to your customers.'],
              ['\u{1F6AB}', 'Never used against you', 'We won\u2019t use your data to compete with you or hand it to anyone in your industry.'],
              ['\u{1F4E4}', 'Take it with you anytime', 'Export your customers, properties, invoices and history whenever you want.'],
              ['\u{1F5D1}\uFE0F', 'Leave and it\u2019s deleted', 'Cancel and we delete it within 90 days, or sooner if you ask.'],
              ['\u{1F440}', 'Nobody snoops', 'We only open your account when you ask us for help. Your data never trains AI.'],
            ].map(([ic, h, t]) => (
              <div key={h} style={{ background: '#fff', borderRadius: 12, padding: '18px 18px 16px', boxShadow: '0 1px 3px rgba(0,0,0,.07)' }}>
                <div aria-hidden="true" style={{ fontSize: 24, marginBottom: 6 }}>{ic}</div>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#111827', marginBottom: 4 }}>{h}</div>
                <div style={{ fontSize: 14.5, color: '#4b5563', lineHeight: 1.5 }}>{t}</div>
              </div>
            ))}
          </div>
          <p style={{ color: '#374151', fontSize: 15, margin: '24px 0 0', lineHeight: 1.6 }}>
            <b>Larger company?</b> We&apos;ll sign a Data Protection Agreement with you, already signed on our side. <a href="mailto:Support@bossprohq.com?subject=Data%20Protection%20Agreement%20request" style={{ color: '#1d4ed8', fontWeight: 700 }}>Request it</a>
            <span style={{ color: '#6b7280' }}> &middot; <a href="/privacy-policy" style={{ color: '#4b5563' }}>Privacy Policy</a> &middot; <a href="/terms" style={{ color: '#4b5563' }}>Terms</a></span>
          </p>
        </div>
      </section>
      <section aria-label="Tech reviews, tips and bonuses" style={{ background: '#ffffff', padding: 'clamp(44px,7vw,80px) 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(22px,3.5vw,36px)' }}>
            <span style={{ display: 'inline-block', background: '#16a34a', color: '#fff', fontWeight: 900, fontSize: 12, letterSpacing: 1.5, borderRadius: 20, padding: '5px 12px', marginBottom: 12 }}>NEW</span>
            <h2 style={{ color: '#111827', fontSize: 'clamp(26px,3.8vw,42px)', fontWeight: 900, lineHeight: 1.12, margin: '0 0 12px' }}>Tech reviews, tips &amp; crew bonuses</h2>
            <p style={{ color: '#4b5563', fontSize: 'clamp(15px,1.9vw,19px)', lineHeight: 1.6, margin: '0 auto', maxWidth: 780 }}>Your customers rate the tech who did the job and can leave a tip. Your crew sees their stars, their tips and exactly how close they are to their next bonus. Included on every SprayBossPro plan.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(20px,3vw,36px)', alignItems: 'center', justifyContent: 'center' }}>
          <figure style={{ flex: '0 0 auto', width: 'min(290px, 82vw)', margin: 0, textAlign: 'center' }}>
            <div style={{ background: '#0b0b0f', borderRadius: 38, padding: 10, boxShadow: '0 24px 60px rgba(15,23,42,.28), 0 0 0 2px #26262c' }}>
              <img src="/crew-bonus.webp" width={600} height={1055} loading="lazy" decoding="async" alt="Crew app Bonus &amp; Tips screen: the tech's star rating, tips owed, how close they are to their bonus, and what customers said" style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 29 }} />
            </div>
            <figcaption style={{ color: '#4b5563', fontSize: 13.5, fontWeight: 600, marginTop: 10 }}>What your tech sees in the crew app</figcaption>
          </figure>
          <div style={{ flex: '1 1 520px', minWidth: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
            {[
              ['\u2B50', 'Customers rate their tech', 'After every job, a text, email or app alert asks \u201cHow did Jake do?\u201d One tap for stars and a comment.'],
              ['\u{1F49A}', 'Tips go to the crew', 'Customers tip on their card on file or a new card. Every tip is tracked per employee, minus processing.'],
              ['\u{1F69A}', 'Fair crew splits', 'Set the split per truck, give drivers a bigger share, or change any single job. Drag your crew between trucks.'],
              ['\u{1F3AF}', 'Bonuses they can see', 'Set goals by gross, jobs or rating. Techs see \u201cYou\u2019re $200 away from your bonus\u201d in the crew app.'],
              ['\u{1F44B}', 'Meet your tech', 'Customers see who\u2019s coming, with a photo, rating, reviews and an \u201cabout me\u201d before the visit.'],
              ['\u{1F4B8}', 'Run payroll in one click', 'Hours and overtime from the crew time clock, plus tips and bonuses, ready for Gusto, QuickBooks, ADP or Paychex. By hand or automatically.'],
            ].map(([ic, h, t]) => (
              <div key={h} style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 14, padding: '18px 18px 16px' }}>
                <div aria-hidden="true" style={{ fontSize: 26, marginBottom: 6 }}>{ic}</div>
                <div style={{ fontWeight: 800, fontSize: 16.5, color: '#111827', marginBottom: 4 }}>{h}</div>
                <div style={{ fontSize: 14.5, color: '#4b5563', lineHeight: 1.5 }}>{t}</div>
              </div>
            ))}
          </div>
          </div>
          <p style={{ textAlign: 'center', color: '#374151', fontSize: 15, margin: '22px 0 0', lineHeight: 1.6 }}>Happy customers can share it on Google or Facebook too, and private feedback comes straight to you.</p>
        </div>
      </section>

      {/* ═══ HERO ═══ */}
      <div className="hero" style={{paddingTop:'60px'}}>
        <div className="hero-badge">Built for Lawn Care, Pest Control &amp; Spray</div>
        <h1>Run Your Entire Operation<br /><span>From One Dashboard</span></h1>
        <p>SprayBossPro is the all-in-one field management platform built specifically for lawn care, pest control, and spray businesses. Schedule jobs, send estimates, collect payments, and keep your team coordinated — all in one place.</p>
        <div className="hero-btns">
          <a href="#" onClick={(e) => { e.preventDefault(); openSignupModal(1, e.currentTarget as HTMLElement); }} className="btn-primary">Start Your 14-Day Free Trial</a>
          <div className="hero-trust">No credit card required &nbsp;&middot;&nbsp; 14-day free trial &nbsp;&middot;&nbsp; <b>from $59/mo</b> after &nbsp;&middot;&nbsp; <b>demo needs no signup</b></div>
        </div>
        <div className="hero-stats">
          <div><div className="hero-stat-val">100+</div><div className="hero-stat-lbl">Features Built In</div></div>
          <div><div className="hero-stat-val">89</div><div className="hero-stat-lbl">Screens &amp; Tools</div></div>
          <div><div className="hero-stat-val">0</div><div className="hero-stat-lbl">Apps to Install</div></div>
          <div><div className="hero-stat-val">24/7</div><div className="hero-stat-lbl">Access Anywhere</div></div>
        </div>
      </div>

      {/* ═══ PREMIUM BAND ═══ */}
      <div className="premium-band">
        <h2>Affordable Doesn&apos;t Mean Cheap.<br /><span>This Is Enterprise-Level Software.</span></h2>
        <p>We charged less because we&apos;ve been the customer. We know what it feels like to pay $600 a month for software that still doesn&apos;t do what your business actually needs. SprayBossPro does everything the enterprise platforms do — route mapping, chemical compliance, automated SMS, card payments, role-based access, mobile app — built specifically for lawn care, pest control, and spray businesses, and priced for the real world. $59 a month isn&apos;t a cheap price. It&apos;s a fair price. The big platforms aren&apos;t charging $500 because they&apos;re better. They&apos;re charging $500 because they can — and because their customers don&apos;t have a better option. Now you do.</p>
        <div className="premium-grid">
          <div className="premium-card"><div className="premium-card-icon">🗺️</div><h3 className="pc-h">Enterprise Route Intelligence</h3><p>Live route maps, drag-and-drop stop ordering, and circle-to-schedule map selection — tools that cost thousands per month at other platforms are standard in SprayBossPro at every plan level.</p></div>
          <div className="premium-card"><div className="premium-card-icon">🧪</div><h3 className="pc-h">Full Chemical Compliance Engine</h3><p>Pesticide application logs, technician license tracking, weather conditions per application, print-ready compliance reports — built to hold up to any state inspector, at no extra charge.</p></div>
          <div className="premium-card"><div className="premium-card-icon">💬</div><h3 className="pc-h">Automated Communication Suite</h3><p>10+ automated SMS alert types, a two-way texting inbox, 3-step estimate follow-up sequences, 3-step payment follow-up sequences — all running without you every single day.</p></div>
          <div className="premium-card"><div className="premium-card-icon">💳</div><h3 className="pc-h">Built-In Card Processing</h3><p>Card-on-file storage, post-service billing, partial payments, automated payment reminders, and full payment history. The same billing infrastructure the big guys use — included in your $59.</p></div>
          <div className="premium-card"><div className="premium-card-icon">👑</div><h3 className="pc-h">Role-Based Access Control</h3><p>Owner, Manager, Office, Technician, and Mobile roles — the same granular permission system as platforms charging 5× more per month. Your office staff sees what they need. Your techs see only their stops.</p></div>
          <div className="premium-card"><div className="premium-card-icon">📱</div><h3 className="pc-h">Full Mobile App for Field Techs</h3><p>Your technicians manage their stops, log chemicals, mark complete, add notes, and skip stops from their phone — all in a mobile-optimized view purpose-built for someone in a truck.</p></div>
          <div className="premium-card"><div className="premium-card-icon">🙋</div><h3 className="pc-h">A Branded App for Your Customers, Too</h3><p>Your clients get their own installable app to see visits and photos, pay invoices, book new services, update their card, get alerts, and leave reviews — and you choose exactly what each one can see. Almost nobody else offers this at any price.</p></div>
        </div>
      </div>

      {/* ═══ LASSO FEATURE ═══ */}
      <section id="lasso">
        <div className="highlight-row">
          <div className="highlight-text">
            <h2>Draw a circle. Know what is inside it before you load the truck.</h2>
            <p>No other lawn care or pest control software has this. On the waiting list map, draw a circle around any geographic area — a neighborhood, a ZIP code, a corridor. SprayBossPro works out every detail of what&apos;s inside before you schedule a single stop or mix a single gallon.</p>
            <p style={{marginTop:'12px'}}>This isn&apos;t just a map feature. It&apos;s a business intelligence tool. You can look at a section of your service area and know in seconds whether it&apos;s worth building a route around, how many trucks to send, what to load, and how much chemical to mix. You know before you drive out there.</p>
            <ul className="check-list">
              <li>Total sq ft and linear ft for all properties inside the circle</li>
              <li>Total stop count and total number of services across all types</li>
              <li>Breakdown by service type — Lawn Care 4 · 8, Mosquito · 6, Insect · 5, etc.</li>
              <li>Per-service sq ft totals so you know exactly how much chemical to mix before loading</li>
              <li>Schedule all circled stops at once — they drop straight to the dispatch board with a full route map</li>
              <li>All service types are fully customizable to match exactly how your operation runs</li>
              <li>The system calculates how much to do per day and how many gallons to mix per service</li>
              <li>You know what to load and how much to mix before the truck leaves the shop.</li>
            </ul>
          </div>
          <div className="highlight-visual">
            <div style={{color:'rgba(255,255,255,.45)', fontSize:'11px', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px'}}>Waiting List Map — Circle Selection</div>
            {/* The actual waiting list, lasso closed, Selection Summary open. A drawing of this
                was never going to be more convincing than the thing itself. */}
            <img loading="lazy" decoding="async" src="/shot-lasso.webp" alt="SprayBossPro waiting list with a lasso drawn around a neighbourhood and the Selection Summary open"
                 style={{width:'100%', display:'block', borderRadius:'10px', border:'1px solid rgba(255,255,255,.12)'}} />
            <div className="stat-grid">
              <div className="stat-cell"><div className="stat-val">14</div><div className="stat-lbl">Stops Selected</div></div>
              <div className="stat-cell"><div className="stat-val">19</div><div className="stat-lbl">Total Services</div></div>
              <div className="stat-cell"><div className="stat-val">118,400</div><div className="stat-lbl">Sq Ft</div></div>
              <div className="stat-cell"><div className="stat-val">4,200</div><div className="stat-lbl">Linear Ft</div></div>
              <div className="stat-cell full"><div className="stat-val">Lawn Care 4 · 8 &nbsp;|&nbsp; Mosquito · 6 &nbsp;|&nbsp; Insect · 5</div><div className="stat-lbl">Breakdown by Service Type</div></div>
            </div>
            <button style={{width:'100%', marginTop:'12px', background:'var(--orange)', color:'#111', border:'none', borderRadius:'8px', padding:'13px', fontSize:'14px', fontWeight:700, cursor:'pointer', fontFamily:'inherit'}}>Schedule These 14 Stops →</button>
            <div style={{marginTop:'10px', textAlign:'center', color:'rgba(255,255,255,.35)', fontSize:'11px'}}>Drops to dispatch board with full route map</div>
          </div>
        </div>
      </section>

      {/* ═══ CUSTOMER APP ═══ */}
      <section className="dark-section">
        <div className="centered" style={{maxWidth:'1100px', margin:'0 auto'}}>
          <h2 className="section-title">Your customers get their own app, and you choose what it shows them</h2>
          {/* The client app and the crew app, side by side - the two screens this section is about. */}
          <div style={{display:'flex', gap:'26px', justifyContent:'center', flexWrap:'wrap', margin:'34px 0 8px'}}>
            <img loading="lazy" decoding="async" src="/shot-clientapp.webp" alt="The customer's own app showing today's route and how many stops away the crew is" style={{width:'270px', maxWidth:'42vw', display:'block', borderRadius:'14px', border:'1px solid rgba(255,255,255,.14)'}} />
            <img loading="lazy" decoding="async" src="/shot-crewapp.webp" alt="The crew app: the day's route on the map, then the first stop with its gate code, notes and Start button" style={{width:'270px', maxWidth:'42vw', display:'block', borderRadius:'14px', border:'1px solid rgba(255,255,255,.14)'}} />
          </div>
          <p className="section-sub">Most software this powerful stops at you and your crew. SprayBossPro gives your customers their own branded app they install right on their phone — no app store, no password, just a secure text-link login. It&apos;s the kind of thing platforms charging 5× more don&apos;t even offer.</p>
        </div>
        <div style={{maxWidth:'1000px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'14px 40px'}}>
          {[
            'See upcoming visits and full history — what was done, tech notes, and before/after photos',
            'View and pay invoices right from their phone — card on file, one-tap Pay Now',
            'Sign up for new services with live pricing figured from their own property — and see what they already have',
            'Update their card, reschedule or skip a visit, contact you, or refer a friend',
            'Get alerts their way — text, email, or app pop-up — and pick which ones they receive',
            'Live tracking on service day — customers see exactly how many stops away the crew is, in real time',
            'Leave a review — or a private “Rate Us” that sends only your happy customers to Google & Facebook',
          ].map((t, i) => (
            <div key={i} style={{display:'flex', gap:'10px', alignItems:'flex-start', color:'rgba(255,255,255,.82)', fontSize:'15px', lineHeight:1.6}}>
              <span style={{color:'var(--orange)', fontWeight:800, flexShrink:0}}>✓</span><span>{t}</span>
            </div>
          ))}
        </div>
        <p style={{maxWidth:'900px', margin:'34px auto 0', textAlign:'center', color:'#fff', fontSize:'19px', fontWeight:700, lineHeight:1.5}}>It’s fully customizable from the business side — you decide exactly what every customer can see <em>and</em> do, flipping any feature on or off with a single switch.</p>
      </section>

      {/* ═══ EASIER TO USE ═══ */}
      <section style={{background:'var(--light-bg)'}}>
        <div className="centered" style={{maxWidth:'1100px', margin:'0 auto'}}>
          <h2 className="section-title">Powerful without being a project to set up</h2>
          <p className="section-sub">The big enterprise platforms take weeks to learn, months to set up, and require a dedicated person just to manage them. SprayBossPro is designed so any owner or office manager can be running real routes on day one — without training, without a consultant, without an IT department.</p>
        </div>
        <div className="simple-grid">
          <div className="simple-card"><div className="simple-num">01</div><h3>Set Up in One Afternoon</h3><p>Add your service types, import your clients and properties, set up your chemical mixes, and configure your SMS alert templates. Most businesses are scheduling real routes the same day they sign up. No implementation fee. No onboarding consultant. No 6-hour kickoff call.</p></div>
          <div className="simple-card"><div className="simple-num">02</div><h3>One Screen Does Everything</h3><p>The dispatch board shows your waiting list, your scheduled stops, your route map, your day summary, and your chemical needs all in one place. Your crew gets their stops on their phone. You&apos;re not switching between six different apps to run your day.</p></div>
          <div className="simple-card"><div className="simple-num">03</div><h3>Your Techs Learn It in Minutes</h3><p>The mobile tech view is built for people in trucks, not office managers at desks. Big buttons, clear status, one tap to mark complete, log chemicals, skip a stop, or add a note. We&apos;ve had technicians learn the system while sitting in the parking lot before their first stop.</p></div>
          <div className="simple-card"><div className="simple-num">04</div><h3>Automation Runs Without You</h3><p>Set your alert templates once — scheduled, completed, skipped, estimate follow-ups, payment follow-ups, review requests. After that, SprayBossPro handles customer communication automatically on every single job, every single day, without you having to think about it again.</p></div>
        </div>
      </section>

      {/* ═══ FEATURES OVERVIEW ═══ */}
      <section id="features" style={{background:'var(--light-bg)'}}>
        <div className="centered" style={{maxWidth:'1200px', margin:'0 auto'}}>
          <h2 className="section-title">Stop Juggling 5 Different Apps</h2>
          <p className="section-sub">SprayBossPro replaces your scheduling app, your billing software, your texting tool, and your route planner — all under one roof.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card"><span className="feature-icon">📋</span><h3>Smart Scheduling</h3><p>SprayBossPro is smart enough to know exactly how much work is waiting. For every service type on your waiting list, it automatically totals the square footage or linear footage so you know precisely how much you can fit in a day before you ever make a single call. No more guessing, no more overbooking — just look at your waiting list, see the ft² or linear ft for each service, and schedule with confidence.</p></div>
          <div className="feature-card"><span className="feature-icon">🗺️</span><h3>Live Route Map</h3><p>See all your stops pinned on an interactive map. Build efficient routes, drag to reorder, and give your drivers a clear path every single day.</p></div>
          <div className="feature-card"><span className="feature-icon">💰</span><h3>Estimates &amp; Invoices</h3><p>Create professional estimates in seconds, email them to clients, and convert accepted estimates directly to invoices. Track every dollar owed.</p></div>
          <div className="feature-card"><span className="feature-icon">💳</span><h3>Built-In Card Payments</h3><p>Accept credit cards directly through the platform. Store cards on file, charge after service, and track payment history all in one place.</p></div>
          <div className="feature-card"><span className="feature-icon">💬</span><h3>Two-Way SMS</h3><p>Send and receive text messages from customers right inside the app. Full conversation history organized by contact — no more switching to your phone.</p></div>
          <div className="feature-card"><span className="feature-icon">🔔</span><h3>Automated Alerts</h3><p>Auto-text and email customers when a service is scheduled, completed, or rescheduled. Set it once and let SprayBossPro handle the communication.</p></div>
          <div className="feature-card"><span className="feature-icon">👥</span><h3>Client &amp; Lead Management</h3><p>Manage existing clients and active leads side by side. Track estimates, service history, properties, and notes all tied to each contact.</p></div>
          <div className="feature-card"><span className="feature-icon">🏠</span><h3>Property Profiles</h3><p>Every service address gets its own profile with coordinates, notes, service history, and the ability to map it instantly.</p></div>
          <div className="feature-card"><span className="feature-icon">🧪</span><h3>Chemical Tracking</h3><p>Log every chemical application with mix used, area treated, gallons applied, weather, and technician. Generate compliance reports in one click.</p></div>
          <div className="feature-card"><span className="feature-icon">⚗️</span><h3>Daily Mix Calculator</h3><p>Know exactly how much to mix every morning. Totals every mix for the day&apos;s route, breaks out ounces per product, and recalculates what you still need after you enter what&apos;s already in the tank.</p></div>
          <div className="feature-card"><span className="feature-icon">📦</span><h3>Package Plans</h3><p>Create recurring service packages, assign clients, and manage renewals. SprayBossPro reminds you when package renewals are due.</p></div>
          <div className="feature-card"><span className="feature-icon">🚛</span><h3>Team &amp; Truck Management</h3><p>Manage employees, assign trucks, track hours, and control who sees what with role-based access for office staff, technicians, and drivers.</p></div>
          <div className="feature-card"><span className="feature-icon">📊</span><h3>Dashboard &amp; Reports</h3><p>Custom stat cards show today&apos;s revenue, services completed, properties served, money owed, and more — all at a glance the moment you log in.</p></div>
          <div className="feature-card"><span className="feature-icon">📞</span><h3>AI Receptionist</h3><p>A human-sounding AI answers your phone 24/7, knows your customers, books and reschedules, and takes new leads. 49¢ a minute, only when it answers.</p></div>
          <div className="feature-card"><span className="feature-icon">📬</span><h3>Neighbor Postcards</h3><p>Every finished job mails your postcard to the closest neighbors, skipping current customers. Design it yourself, set a budget. $1.59 a card, First Class postage included.</p></div>
          <div className="feature-card"><span className="feature-icon">🧾</span><h3>Costs &amp; Receipts</h3><p>Crews snap receipts in the app and AI fills in the amount, store and date. See every cost by type, truck, job and month.</p></div>
          <div className="feature-card"><span className="feature-icon">⭐</span><h3>Tech Reviews &amp; Tips</h3><p>After every job, customers rate the tech who did it and can leave a tip. Every tip is tracked per employee.</p></div>
          <div className="feature-card"><span className="feature-icon">🎯</span><h3>Crew Bonuses &amp; Splits</h3><p>Set bonus goals by gross, jobs or rating. Give drivers a bigger share. Techs see &ldquo;You&rsquo;re $200 away from your bonus&rdquo; in the crew app.</p></div>
          <div className="feature-card"><span className="feature-icon">💸</span><h3>One-Click Payroll</h3><p>Hours and overtime from the time clock, plus tips and bonuses, ready for Gusto, QuickBooks, ADP or Paychex. By hand or on a schedule.</p></div>
          <div className="feature-card"><span className="feature-icon">👋</span><h3>Meet Your Tech</h3><p>Customers see who is coming before the visit, with a photo, star rating, reviews and an &ldquo;about me.&rdquo;</p></div>
          <div className="feature-card"><span className="feature-icon">🔗</span><h3>Zapier &amp; Make</h3><p>Connect SprayBossPro to thousands of apps like Google Sheets, Mailchimp and Slack with instant webhooks and an API key.</p></div>
          <div className="feature-card"><span className="feature-icon">📱</span><h3>Google Reviews &amp; Social Inbox</h3><p>Connect your Google Business Profile to see and reply to every Google review, and let AI write the replies for you to approve or post automatically. Facebook and Instagram messages, comments and lead forms are coming soon.</p></div>
          <div className="feature-card"><span className="feature-icon">⚡</span><h3>Fast Setup</h3><p>Trucks, crew, products, services, pricing and packages in about 10 minutes. Upload what you already have.</p></div>
          <div className="feature-card"><span className="feature-icon">🌐</span><h3>Free Website</h3><p>A 200–300 page website built for Google, with a free domain. Every form goes straight into SprayBossPro as a new lead.</p></div>
          <div className="feature-card"><span className="feature-icon">🎨</span><h3>Make It Yours</h3><p>Pick any colors for your software and choose exactly what shows in your sidebar, in any order.</p></div>
          <div className="feature-card"><span className="feature-icon">📝</span><h3>Estimates from the Field</h3><p>Techs write and send estimates from the crew app on the spot, even with no signal.</p></div>
          <div className="feature-card"><span className="feature-icon">🔒</span><h3>Your Data Is Yours</h3><p>Never sold, never shared. Export anytime. Bigger companies get a signed data protection agreement.</p></div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" style={{background:'var(--light-bg)'}}>
        <div className="centered" style={{maxWidth:'1100px', margin:'0 auto'}}>
          <span className="section-label">Simple Pricing</span>
          <h2 className="section-title">We got tired of getting ripped off, so we fixed it</h2>
          <p className="section-sub">Over the past 20 years we have tried just about every field service software out there — and for 10+ years we were paying $500–$700 a month. Every feature was an add-on. Every user cost more. Every upgrade was another invoice.</p>
          <div style={{background:'#fff', border:'1.5px solid var(--border)', borderRadius:'14px', padding:'36px 40px', maxWidth:'800px', margin:'0 auto 56px', textAlign:'left', borderLeft:'5px solid var(--orange)'}}>
            <p style={{fontSize:'17px', color:'var(--text)', lineHeight:'1.8', marginBottom:'16px'}}>We were paying <strong>$500 to $700 a month</strong> for software that nickel-and-dimed us at every turn. Want texting? That&apos;s an add-on. Want more users? Pay per user. Want the reporting module? Upgrade your plan. It never ended — and none of those people had ever run a spray route in their life.</p>
            <p style={{fontSize:'17px', color:'var(--text)', lineHeight:'1.8', marginBottom:'16px'}}>That&apos;s exactly why we built SprayBossPro with pricing you can read in one screen. <strong>Three plans &mdash; $59, $89 and $199</strong> &mdash; and the only thing that changes is size: how many users, trucks and texts you get, and whether the automation is switched on. Every plan runs the same software, and clients and properties are unlimited on all three. No per-seat fees, no add-on modules, no surprise invoice.</p>
            <p style={{fontSize:'17px', color:'var(--text)', lineHeight:'1.8'}}>The only reason we charge a small fee for outbound text messages is simple — they cost us money to send. We&apos;re not marking them up to make a profit off you. 500 outbound messages are included every month, and if you go over, it&apos;s just $15 per additional 500. That&apos;s it. No gotchas. No surprises. We&apos;re operators just like you, and we built the pricing we always wished existed.</p>
          </div>
        </div>
        <p style={{textAlign:'center', color:'var(--muted)', fontSize:'13px', marginTop:'32px'}}>No contracts. Cancel anytime. No hidden fees — ever.</p>
      </section>

      {/* ═══ SCHEDULING DEEP DIVE ═══ */}
      <section id="scheduling">
        <div className="centered" style={{maxWidth:'1100px', margin:'0 auto'}}>
          <h2 className="section-title">From Waiting List to Dispatched in Seconds</h2>
          <p className="section-sub" style={{marginBottom:'0'}}>SprayBossPro gives you a waiting list of everything not yet scheduled, a full dispatch board for scheduled jobs, and a live map so you can build tight, efficient routes every morning.</p>
        </div>
        {/* Full width, because at half width the stop list underneath the map is unreadable. */}
        <div style={{maxWidth:'1400px', margin:'36px auto 0'}}>
          <img loading="lazy" decoding="async" src="/shot-route.webp" alt="The Scheduled board: square footage and revenue by service across the top, the day auto-routed with every stop numbered on the map, and the stop list underneath"
               style={{width:'100%', display:'block', borderRadius:'12px', border:'1px solid var(--border)', boxShadow:'0 18px 50px rgba(0,0,0,.14)'}} />
        </div>
        <ul className="check-list" style={{maxWidth:'1000px', margin:'38px auto 0', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'0 48px'}}>
          <li>Waiting list with sq ft totals and service counts per type</li>
          <li>One-click scheduling with date picker and tech assignment</li>
          <li>Drag-and-drop route ordering</li>
          <li>Interactive map showing all stops with stop detail panel</li>
          <li>Filter by employee, date range, or service status</li>
          <li>Summary bar: total stops, revenue, sq ft, jobs completed</li>
          <li>Print dispatch sheets for drivers in the field</li>
          <li>Mark jobs complete, skipped, or rescheduled with one click</li>
        </ul>
      </section>

      {/* ═══ ALERTS ═══ */}
      <section id="alerts" className="dark-section">
        <div className="centered" style={{maxWidth:'1100px', margin:'0 auto'}}>
          <h2 className="section-title">Sound like a big company without hiring one</h2>
          {/* Every alert, with its own text / email / in-app switches. The section spent five
              bullet points describing this table; showing it is shorter and more convincing. */}
          <img loading="lazy" decoding="async" src="/shot-alerts.webp" alt="The alert list with independent text, email and in-app switches on every alert"
               style={{width:'100%', maxWidth:'620px', display:'block', margin:'30px auto 6px', borderRadius:'10px', border:'1px solid rgba(255,255,255,.12)'}} />
          <p className="section-sub">That is the whole list, not a sample. Nineteen alerts, each with its own text, email and in-app switch. Turn one on and it sends itself from then on. Turn a channel off and your customers never see it as an option.</p>
        </div>
        <div className="alert-grid">
          <div className="alert-pill"><span className="ap-icon">📅</span><div><div className="ap-label">Service Scheduled</div><div className="ap-sub">Auto-text when a job is booked</div></div></div>
          <div className="alert-pill"><span className="ap-icon">✅</span><div><div className="ap-label">Service Completed</div><div className="ap-sub">Notify customer when tech finishes</div></div></div>
          <div className="alert-pill"><span className="ap-icon">🔄</span><div><div className="ap-label">Rescheduled Alert</div><div className="ap-sub">Instantly notify on date changes</div></div></div>
          <div className="alert-pill"><span className="ap-icon">⏭️</span><div><div className="ap-label">Service Skipped</div><div className="ap-sub">Let customers know before you skip</div></div></div>
          <div className="alert-pill"><span className="ap-icon">📄</span><div><div className="ap-label">Estimate Sent</div><div className="ap-sub">SMS when estimate hits their inbox</div></div></div>
          <div className="alert-pill"><span className="ap-icon">🔁</span><div><div className="ap-label">Estimate Follow-Ups</div><div className="ap-sub">3 automated follow-ups if not accepted</div></div></div>
          <div className="alert-pill"><span className="ap-icon">🎉</span><div><div className="ap-label">Estimate Accepted</div><div className="ap-sub">Celebrate (and get ready to roll)</div></div></div>
          <div className="alert-pill"><span className="ap-icon">⭐</span><div><div className="ap-label">Review Request</div><div className="ap-sub">Auto-ask for Google reviews after service</div></div></div>
          <div className="alert-pill"><span className="ap-icon">💳</span><div><div className="ap-label">Payment Declined</div><div className="ap-sub">Notify and follow up automatically</div></div></div>
          <div className="alert-pill"><span className="ap-icon">💬</span><div><div className="ap-label">Inbound Text Alert</div><div className="ap-sub">Get notified when a customer texts you</div></div></div>
        </div>
        <p style={{textAlign:'center', color:'rgba(255,255,255,.45)', fontSize:'13px', marginTop:'32px'}}>Toggle SMS and Email independently for each alert type — you&apos;re in full control.</p>
      </section>

      {/* ═══ STATS BAND ═══ */}
      <div className="stats-band">
        <div className="stats-band-inner">
          <div className="stat-item"><div className="val">10+</div><div className="lbl">Automated Alert Types</div></div>
          <div className="stat-item"><div className="val">3</div><div className="lbl">Estimate Follow-Up Sequences</div></div>
          <div className="stat-item"><div className="val">3</div><div className="lbl">Payment Follow-Up Sequences</div></div>
          <div className="stat-item"><div className="val">∞</div><div className="lbl">Custom SMS Templates</div></div>
        </div>
      </div>

      {/* ═══ TEAM / MOBILE ═══ */}
      <section>
        <div className="highlight-row">
          <div className="highlight-text">
            <h2>Office, Field, and Mobile — All Connected</h2>
            <p>SprayBossPro isn&apos;t just for the office. Your technicians get a mobile-optimized version built for the truck. Roles control exactly what each person can see and do.</p>
            <ul className="check-list">
              <li>Role-based access: Owner, Manager, Office, Technician, Mobile</li>
              <li>Mobile technicians see their jobs, mark complete, and skip</li>
              <li>Office staff manages scheduling, billing, and messaging</li>
              <li>Employee hour tracking and payroll-ready reports</li>
              <li>Truck management — assign vehicles to services</li>
              <li>Admin controls for adding, deactivating, and managing users</li>
            </ul>
          </div>
          <div className="highlight-visual">
            <img loading="lazy" decoding="async" src="/shot-devices.webp" alt="SprayBossPro on a laptop with the client app and the crew app on two phones"
                 style={{width:'100%', display:'block', borderRadius:'10px', border:'1px solid rgba(255,255,255,.12)'}} />
          </div>
        </div>
      </section>

      {/* ═══ CHEMICAL TRACKING ═══ */}
      <section style={{background:'var(--light-bg)'}}>
        <div className="highlight-row reverse">
          <div className="highlight-text">
            <h2>Chemical Tracking Built Right In</h2>
            <p>Every application logged. Every mix recorded. Every technician tracked. SprayBossPro gives you a complete chemical application history you can filter, print, and take to any inspection.</p>
            <ul className="check-list">
              <li><strong>Daily Mix Calculator</strong> — every morning, see exactly how much of each mix your trucks need, per product, with tank math done for you</li>
              <li>Log product mixes, area treated, and gallons applied per job</li>
              <li>Track weather conditions at time of application</li>
              <li>Filter reports by client, mix, technician, or date range</li>
              <li>Summary cards: total applications, properties, sq ft, gallons</li>
              <li>Full product catalog with mix recipes</li>
              <li>Print-ready chemical reports for compliance</li>
              <li>Area treated types (lawn, shrubs, beds, etc.) tracked separately</li>
            </ul>
          </div>
          <div className="highlight-visual">
            <img loading="lazy" decoding="async" src="/shot-chem.webp" alt="The chemical report: product, EPA registration number, rate applied and area treated per stop"
                 style={{width:'100%', display:'block', borderRadius:'10px', border:'1px solid rgba(255,255,255,.12)'}} />
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section>
        <div className="centered" style={{maxWidth:'1100px', margin:'0 auto'}}>
          <span className="section-label">Who We Are</span>
          <h2 className="section-title">Built by an Operator. Owned by an Operator.</h2>
          <p className="section-sub">We&apos;re not a big corporation. We&apos;re not a venture-backed tech startup. We&apos;re a privately owned company built by someone who has been in the field since 2006.</p>
          <div style={{background:'#fff', border:'1.5px solid var(--border)', borderRadius:'14px', padding:'36px 40px', maxWidth:'800px', margin:'0 auto 56px', textAlign:'left', borderLeft:'5px solid var(--orange)'}}>
            <p style={{fontSize:'17px', color:'var(--text)', lineHeight:'1.8', marginBottom:'16px'}}>We own and operate a spray business. We&apos;ve been in this industry since <strong>2006</strong> — which means when we built SprayBossPro, we didn&apos;t have to guess what operators need. We already knew. We lived it every day.</p>
            <p style={{fontSize:'17px', color:'var(--text)', lineHeight:'1.8', marginBottom:'16px'}}>We built this software because everything else out there was built by people who have never driven a spray truck, never managed a waiting list of hundreds or thousands of properties, never had to chase down a payment while also trying to dispatch a full crew. They build features they <em>think</em> you need. We build features we <em>know</em> you need.</p>
            <p style={{fontSize:'17px', color:'var(--text)', lineHeight:'1.8'}}>SprayBossPro is <strong>privately owned</strong> — no corporate board, no outside investors, no decisions made by people who have never touched a sprayer. When you call or message us, you&apos;re talking to the owner. That&apos;s the way we like it, and that&apos;s never going to change.</p>
          </div>
        </div>
        <div className="testimonial-grid" style={{maxWidth:'1100px', margin:'0 auto'}}>
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-body">&ldquo;Before SprayBossPro I was using 3 different apps and still falling through the cracks on follow-ups. Now everything is in one place and my close rate on estimates is way up because the follow-up texts go out automatically.&rdquo;</p>
            <div className="testimonial-author">Lawn Care Owner</div>
            <div className="testimonial-role">Nashville, TN</div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-body">&ldquo;The chemical tracking alone is worth it. I used to keep a spreadsheet and it was always behind. Now every application is logged right when the job is done and I can pull a report for any inspector in 30 seconds.&rdquo;</p>
            <div className="testimonial-author">Pest Control Operator</div>
            <div className="testimonial-role">Phoenix, AZ</div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-body">&ldquo;The route map changed how I schedule. I can look at where all my jobs are, drag them into order, and cut drive time in half. My guys are doing more stops per day with less fuel.&rdquo;</p>
            <div className="testimonial-author">Spray Tech Business Owner</div>
            <div className="testimonial-role">Charlotte, NC</div>
          </div>
        </div>
      </section>

      {/* ═══ TECH ═══ */}
      <section style={{background:'var(--light-bg)'}}>
        <div className="highlight-row">
          <div className="highlight-text">
            <h2>Built to stay quick when the day gets busy</h2>
            <p>SprayBossPro runs on the latest and greatest infrastructure available today. That means your texts and emails go out in seconds — not hours. No queues backing up, no alerts firing late, no wondering if your customer got the message. Everything happens in real time, the way it&apos;s supposed to.</p>
            <p style={{marginTop:'12px'}}>We built on a modern stack specifically to eliminate the performance issues and outages that plague older field service platforms. Less downtime. Fewer bugs. A faster experience every time you log in.</p>
          </div>
          <div className="highlight-visual">
            <div style={{color:'rgba(255,255,255,.5)', fontSize:'11px', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'14px'}}>Alert Delivery</div>
            <div className="mock-item"><div className="mock-dot green"></div><div><div className="mock-label">Service Completed SMS</div><div className="mock-sub">Sent to customer · 0.4 seconds</div></div><div className="mock-badge green-badge">Delivered</div></div>
            <div className="mock-item"><div className="mock-dot green"></div><div><div className="mock-label">Estimate Email</div><div className="mock-sub">Sent to customer · 0.9 seconds</div></div><div className="mock-badge green-badge">Delivered</div></div>
            <div className="mock-item"><div className="mock-dot green"></div><div><div className="mock-label">Review Request SMS</div><div className="mock-sub">Sent to customer · 0.6 seconds</div></div><div className="mock-badge green-badge">Delivered</div></div>
            <div style={{marginTop:'16px', background:'rgba(255,255,255,.07)', borderRadius:'8px', padding:'14px 16px', textAlign:'center'}}>
              <div style={{color:'var(--orange)', fontSize:'22px', fontWeight:800}}>No Hours-Long Delays.</div>
              <div style={{color:'rgba(255,255,255,.55)', fontSize:'13px', marginTop:'4px'}}>Your customers hear from you instantly — every time.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WE ACTUALLY LISTEN ═══ */}
      <section className="dark-section">
        <div className="highlight-row reverse" style={{maxWidth:'1100px', margin:'0 auto'}}>
          <div className="highlight-text">
            <span className="section-label" style={{color:'var(--orange)'}}>We Actually Listen</span>
            <h2 style={{color:'#fff'}}>Have an Idea? We&apos;ll Build It.</h2>
            <p style={{color:'rgba(255,255,255,.7)'}}>Most software companies put your feature request in a queue and get back to you six months later — if ever. That&apos;s not us. When you have a suggestion or need something built for your workflow, we listen. We respond. And we build it fast.</p>
            <p style={{color:'rgba(255,255,255,.7)', marginTop:'12px'}}>Custom features for our clients typically ship in 1–2 weeks, not months. SprayBossPro is built by someone who runs a field service business, and we know that when you need something, you need it now — not on the next quarterly release cycle.</p>
            <p style={{color:'rgba(255,255,255,.7)', marginTop:'12px'}}>Our goal is simple: be the best field management software available. And the only way to get there is by building it with our clients — not just for them.</p>
          </div>
          <div className="highlight-visual">
            <div style={{color:'rgba(255,255,255,.5)', fontSize:'11px', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'14px'}}>Feature Request Timeline</div>
            <div className="mock-item"><span style={{fontSize:'20px'}}>💬</span><div><div className="mock-label">You submit a request</div><div className="mock-sub">Tell us what you need and why</div></div><div className="mock-badge blue-badge">Day 1</div></div>
            <div className="mock-item"><span style={{fontSize:'20px'}}>⚡</span><div><div className="mock-label">We start building</div><div className="mock-sub">No committees. No approval queues.</div></div><div className="mock-badge blue-badge">Day 2–3</div></div>
            <div className="mock-item"><span style={{fontSize:'20px'}}>✅</span><div><div className="mock-label">Feature is live</div><div className="mock-sub">In your account, ready to use</div></div><div className="mock-badge green-badge">Week 1–2</div></div>
            <div style={{marginTop:'16px', background:'rgba(255,255,255,.07)', borderRadius:'8px', padding:'14px 16px', textAlign:'center'}}>
              <div style={{color:'var(--orange)', fontSize:'16px', fontWeight:700}}>Not months. Weeks.</div>
              <div style={{color:'rgba(255,255,255,.45)', fontSize:'12px', marginTop:'4px'}}>Your input shapes the software you use every day.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <div className="cta-band">
        <h2>Your Competition Is Already<br />Using Software Like This.</h2>
        <p>Stop running your business out of a notepad and a group text. Get organized, get paid faster, and give your customers an experience that wins referrals.</p>
        <div className="hero-btns">
          <a href="#" onClick={(e) => { e.preventDefault(); openSignupModal(3, e.currentTarget as HTMLElement); }} className="btn-primary" style={{fontSize:'17px', padding:'18px 44px'}}>Start Your 14-Day Free Trial</a>
          <div className="hero-trust">No credit card required &nbsp;&middot;&nbsp; 14-day free trial &nbsp;&middot;&nbsp; <b>from $59/mo</b> after</div>
        </div>
      </div>

      {/* ═══ MODALS ═══ */}
      <div id="sbp-backdrop" onClick={() => closeAllModals()} style={{display:'none', position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,.55)', zIndex:99997}}></div>
      {[1,2,3].map(n => (
        <div key={n} id={`sbp-form-${n}`} style={{display:'none', position:'fixed', zIndex:99999, width:'420px', maxWidth:'calc(100vw - 24px)', background:'#fff', borderRadius:'14px', border:'3px solid #e07820', boxShadow:'0 0 0 4px rgba(224,120,32,.35), 0 16px 60px rgba(0,0,0,.45)', maxHeight:'calc(100vh - 40px)', overflowY:'auto'}}>
          <div style={{background:'linear-gradient(135deg,#080010,#1e0a35)', padding:'28px 28px 22px', position:'relative'}}>
            <div style={{color:'#fff', fontSize:'20px', fontWeight:800, paddingRight:'36px'}}>Start Your 14-Day Free Trial</div>
            <div style={{color:'rgba(255,255,255,.6)', fontSize:'13px', marginTop:'5px'}}>No credit card required · Full access · from $59/mo after your 14-day trial</div>
            <button onClick={() => closeSignupModal(n)} style={{position:'absolute', top:'16px', right:'16px', background:'rgba(255,255,255,.12)', border:'none', color:'#fff', width:'32px', height:'32px', borderRadius:'50%', cursor:'pointer', fontSize:'20px', display:'flex', alignItems:'center', justifyContent:'center'}}>×</button>
          </div>
          <div id={`sbp${n}-step1`} style={{padding:'24px 28px'}}>
            <div id={`sbp${n}-err1`} style={{background:'#fff0f0', border:'1px solid #f5c6c6', color:'#c0392b', borderRadius:'6px', padding:'10px 12px', fontSize:'13px', marginBottom:'14px', display:'none'}}></div>
            <div style={{display:'flex', gap:'12px', marginBottom:'14px'}}>
              <div style={{flex:1}}><label style={{fontSize:'11px', fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'.5px', display:'block', marginBottom:'5px'}}>First Name</label><input id={`sbp${n}-first`} type="text" placeholder="John" style={{width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'10px 12px', fontSize:'14px', fontFamily:'inherit', color:'#333'}} /></div>
              <div style={{flex:1}}><label style={{fontSize:'11px', fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'.5px', display:'block', marginBottom:'5px'}}>Last Name</label><input id={`sbp${n}-last`} type="text" placeholder="Smith" style={{width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'10px 12px', fontSize:'14px', fontFamily:'inherit', color:'#333'}} /></div>
            </div>
            <div style={{marginBottom:'14px'}}><label style={{fontSize:'11px', fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'.5px', display:'block', marginBottom:'5px'}}>Company Name</label><input id={`sbp${n}-company`} type="text" placeholder="Smith Lawn &amp; Spray Co." style={{width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'10px 12px', fontSize:'14px', fontFamily:'inherit', color:'#333'}} /></div>
            <div style={{marginBottom:'20px'}}><label style={{fontSize:'11px', fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'.5px', display:'block', marginBottom:'5px'}}>Email Address</label><input id={`sbp${n}-email`} type="email" placeholder="you@yourcompany.com" style={{width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'10px 12px', fontSize:'14px', fontFamily:'inherit', color:'#333'}} /></div>
            <button onClick={() => sbpStep2(n)} style={{width:'100%', background:'#e07820', color:'#fff', border:'none', borderRadius:'6px', padding:'13px', fontSize:'15px', fontWeight:700, cursor:'pointer', fontFamily:'inherit'}}>Next: Create Password →</button>
          </div>
          <div id={`sbp${n}-step2`} style={{padding:'24px 28px', display:'none'}}>
            <div id={`sbp${n}-err2`} style={{background:'#fff0f0', border:'1px solid #f5c6c6', color:'#c0392b', borderRadius:'6px', padding:'10px 12px', fontSize:'13px', marginBottom:'14px', display:'none'}}></div>
            <div style={{background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'6px', padding:'10px 14px', marginBottom:'16px'}}>
              <div style={{fontSize:'12px', color:'#16a34a', fontWeight:700}}>14-Day Free Trial — No Credit Card Required</div>
              <div style={{fontSize:'12px', color:'#555', marginTop:'2px'}}>Full access to every feature. from $59/month after trial.</div>
            </div>
            <div style={{marginBottom:'14px'}}><label style={{fontSize:'11px', fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'.5px', display:'block', marginBottom:'5px'}}>Login Email</label><input id={`sbp${n}-login-email`} type="email" readOnly style={{width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'10px 12px', fontSize:'14px', fontFamily:'inherit', background:'#f8f8f8', color:'#333'}} /></div>
            <div style={{marginBottom:'14px'}}><label style={{fontSize:'11px', fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'.5px', display:'block', marginBottom:'5px'}}>Password</label><input id={`sbp${n}-password`} type="password" placeholder="At least 8 characters" style={{width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'10px 12px', fontSize:'14px', fontFamily:'inherit', color:'#333'}} /></div>
            <div style={{marginBottom:'14px'}}><label style={{fontSize:'11px', fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'.5px', display:'block', marginBottom:'5px'}}>Confirm Password</label><input id={`sbp${n}-confirm`} type="password" placeholder="Repeat password" style={{width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'10px 12px', fontSize:'14px', fontFamily:'inherit', color:'#333'}} /></div>
            <div style={{marginBottom:'18px', display:'flex', alignItems:'flex-start', gap:'10px'}}><input type="checkbox" id={`sbp${n}-agree`} style={{width:'16px', height:'16px', accentColor:'#e07820', cursor:'pointer', flexShrink:0, marginTop:'3px'}} /><label htmlFor={`sbp${n}-agree`} style={{fontSize:'13px', color:'#555', cursor:'pointer', lineHeight:1.5}}>I agree to the <a href="https://spraybosspro.com/terms" target="_blank" style={{color:'#e07820'}}>Terms of Service</a> and <a href="https://spraybosspro.com/privacy-policy" target="_blank" style={{color:'#e07820'}}>Privacy Policy</a></label></div>
            <button id={`sbp${n}-create-btn`} onClick={() => sbpCreateAccount(n)} style={{width:'100%', background:'#e07820', color:'#fff', border:'none', borderRadius:'6px', padding:'13px', fontSize:'15px', fontWeight:700, cursor:'pointer', fontFamily:'inherit'}}>Create My Account</button>
            <button onClick={() => sbpBackToStep1(n)} style={{width:'100%', background:'none', border:'none', color:'#888', fontSize:'13px', cursor:'pointer', marginTop:'10px', padding:'6px', fontFamily:'inherit', textDecoration:'underline'}}>← Back</button>
          </div>
          <div id={`sbp${n}-success`} style={{padding:'48px 28px', textAlign:'center', display:'none'}}>
            <div style={{width:'64px', height:'64px', background:'#16a34a', borderRadius:'50%', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'30px', color:'#fff', marginBottom:'16px'}}>✓</div>
            <div style={{fontSize:'22px', fontWeight:800, color:'#1a1a2e', marginBottom:'10px'}}>You&apos;re In!</div>
            <div style={{fontSize:'15px', color:'#555', lineHeight:1.6, marginBottom:'6px'}}>Your 14-day free trial has started.<br />Taking you to your dashboard…</div>
            <div id={`sbp${n}-countdown`} style={{fontSize:'12px', color:'#aaa', marginTop:'10px'}}></div>
          </div>
        </div>
      ))}
    </>
  );
}
