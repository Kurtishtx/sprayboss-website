'use client';
import { useEffect } from 'react';
import Navbar from './components/Navbar';

const SBP_URL  = 'https://knjdbgroiyhvqwrpqzcx.supabase.co';
const SBP_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuamRiZ3JvaXlodnF3cnBxemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0OTczMDMsImV4cCI6MjA5NTA3MzMwM30.zoExtkem-XZqU86S4yJjA_xOOaS1G0IPU2M9OAAza2g';
let sbpClient: any = null;
let sbpOpenForm = 0;

function getSbpClient() {
  if (!sbpClient) sbpClient = (window as any).supabase.createClient(SBP_URL, SBP_ANON);
  return sbpClient;
}

function openSignupModal(n: number, btn: HTMLElement) {
  closeAllModals();
  sbpOpenForm = n;
  const form = document.getElementById('sbp-form-' + n)!;
  const rect = btn.getBoundingClientRect();
  const formW = Math.min(420, window.innerWidth - 24);
  const centerX = rect.left + rect.width / 2;
  let top  = rect.bottom + 12;
  let left = centerX - formW / 2;
  if (top + 460 > window.innerHeight) { top = rect.top - 460 - 12; if (top < 12) top = 12; }
  top  = Math.max(12, top);
  left = Math.max(12, Math.min(left, window.innerWidth - formW - 12));
  form.style.top  = top  + 'px';
  form.style.left = left + 'px';
  form.style.display = 'block';
  document.getElementById('sbp-backdrop')!.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeSignupModal(n: number) {
  document.getElementById('sbp-form-' + n)!.style.display = 'none';
  document.getElementById('sbp-backdrop')!.style.display = 'none';
  document.body.style.overflow = '';
  sbpOpenForm = 0;
}

function closeAllModals() {
  [1, 2, 3].forEach(i => {
    const el = document.getElementById('sbp-form-' + i);
    if (el) el.style.display = 'none';
  });
  const backdrop = document.getElementById('sbp-backdrop');
  if (backdrop) backdrop.style.display = 'none';
  document.body.style.overflow = '';
  sbpOpenForm = 0;
}

function sbpStep2(n: number) {
  const err = document.getElementById(`sbp${n}-err1`)!;
  err.style.display = 'none';
  const first = (document.getElementById(`sbp${n}-first`) as HTMLInputElement).value.trim();
  const last  = (document.getElementById(`sbp${n}-last`)  as HTMLInputElement).value.trim();
  const comp  = (document.getElementById(`sbp${n}-company`) as HTMLInputElement).value.trim();
  const email = (document.getElementById(`sbp${n}-email`) as HTMLInputElement).value.trim();
  if (!first || !last)                return sbpShowErr(err, 'Please enter your first and last name.');
  if (!comp)                          return sbpShowErr(err, 'Please enter your company name.');
  if (!email || !email.includes('@')) return sbpShowErr(err, 'Please enter a valid email address.');
  (document.getElementById(`sbp${n}-login-email`) as HTMLInputElement).value = email;
  document.getElementById(`sbp${n}-step1`)!.style.display = 'none';
  document.getElementById(`sbp${n}-step2`)!.style.display = 'block';
  (document.getElementById(`sbp${n}-password`) as HTMLInputElement).focus();
}

function sbpBackToStep1(n: number) {
  document.getElementById(`sbp${n}-step2`)!.style.display = 'none';
  document.getElementById(`sbp${n}-step1`)!.style.display = 'block';
  document.getElementById(`sbp${n}-err2`)!.style.display  = 'none';
}

async function sbpCreateAccount(n: number) {
  const err = document.getElementById(`sbp${n}-err2`)!;
  const btn = document.getElementById(`sbp${n}-create-btn`) as HTMLButtonElement;
  err.style.display = 'none';
  const email    = (document.getElementById(`sbp${n}-login-email`) as HTMLInputElement).value.trim();
  const password = (document.getElementById(`sbp${n}-password`)    as HTMLInputElement).value;
  const confirm  = (document.getElementById(`sbp${n}-confirm`)     as HTMLInputElement).value;
  if (password.length < 8)  return sbpShowErr(err, 'Password must be at least 8 characters.');
  if (password !== confirm)  return sbpShowErr(err, 'Passwords do not match.');
  if (!(document.getElementById(`sbp${n}-agree`) as HTMLInputElement).checked)
    return sbpShowErr(err, 'Please agree to the Terms of Service and Privacy Policy.');
  btn.disabled = true;
  btn.textContent = 'Creating your account…';
  try {
    const res = await fetch(SBP_URL + '/functions/v1/manage-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SBP_ANON, 'apikey': SBP_ANON },
      body: JSON.stringify({ action: 'create', email, password }),
    });
    const result = await res.json();
    if (result.error) throw new Error(result.error);
    const sb = getSbpClient();
    const { data: signInData, error: signInErr } = await sb.auth.signInWithPassword({ email, password });
    if (signInErr) throw new Error(signInErr.message);
    const uid   = signInData.user.id;
    const first = (document.getElementById(`sbp${n}-first`)   as HTMLInputElement).value.trim();
    const last  = (document.getElementById(`sbp${n}-last`)    as HTMLInputElement).value.trim();
    const comp  = (document.getElementById(`sbp${n}-company`) as HTMLInputElement).value.trim();
    await sb.auth.updateUser({ data: { full_name: first + ' ' + last } });
    const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    await sb.from('user_profiles').upsert(
      { id: uid, email, role: 'full_access', is_primary_owner: true, tenant_id: null, trial_ends_at: trialEnd },
      { onConflict: 'id' }
    );
    await sb.from('company_info').insert({ user_id: uid, company_name: comp, display_name: comp });
    const reasons = ['Cancel Maintaining Self','Cancel Sold House','Cancel Too Expensive','Cancel Unknown','Dropping Customer','Sold House']
      .map(nm => ({ name: nm, active: true, user_id: uid }));
    await sb.from('cancellation_reasons').insert(reasons);
    document.getElementById(`sbp${n}-step2`)!.style.display   = 'none';
    document.getElementById(`sbp${n}-success`)!.style.display = 'block';
    let secs = 4;
    const cd = document.getElementById(`sbp${n}-countdown`)!;
    cd.textContent = 'Redirecting in ' + secs + ' seconds…';
    const iv = setInterval(() => {
      secs--;
      if (secs <= 0) { clearInterval(iv); window.location.href = 'https://my.spraybosspro.com/dashboard.html'; }
      else cd.textContent = 'Redirecting in ' + secs + ' second' + (secs === 1 ? '' : 's') + '…';
    }, 1000);
  } catch (e: any) {
    sbpShowErr(err, e.message || 'Something went wrong. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Create My Account';
  }
}

function sbpShowErr(el: HTMLElement, msg: string) { el.textContent = msg; el.style.display = 'block'; }

function SignupForm({ n }: { n: number }) {
  return (
    <div id={`sbp-form-${n}`} className="sbp-form">
      <div className="sbp-form-header">
        <div className="sbp-form-title">Start Your 14-Day Free Trial</div>
        <div className="sbp-form-subtitle">No credit card required. Full access. Cancel anytime.</div>
        <button className="sbp-form-close" onClick={() => closeSignupModal(n)}>×</button>
      </div>

      {/* Step 1 */}
      <div id={`sbp${n}-step1`} className="sbp-form-body">
        <div id={`sbp${n}-err1`} className="sbp-err"></div>
        <div className="sbp-field-row">
          <div className="sbp-field-half">
            <label className="sbp-label">First Name</label>
            <input id={`sbp${n}-first`} type="text" placeholder="John" className="sbp-input" />
          </div>
          <div className="sbp-field-half">
            <label className="sbp-label">Last Name</label>
            <input id={`sbp${n}-last`} type="text" placeholder="Smith" className="sbp-input" />
          </div>
        </div>
        <div className="sbp-field">
          <label className="sbp-label">Company Name</label>
          <input id={`sbp${n}-company`} type="text" placeholder="Smith Lawn & Spray Co." className="sbp-input" />
        </div>
        <div className="sbp-field-last">
          <label className="sbp-label">Email Address</label>
          <input id={`sbp${n}-email`} type="email" placeholder="you@yourcompany.com" className="sbp-input" />
        </div>
        <button onClick={() => sbpStep2(n)} className="btn-primary" style={{width:'100%', fontSize:'15px', padding:'13px'}}>
          Next: Create Password →
        </button>
      </div>

      {/* Step 2 */}
      <div id={`sbp${n}-step2`} className="sbp-form-body" style={{display:'none'}}>
        <div id={`sbp${n}-err2`} className="sbp-err"></div>
        <div className="sbp-trial-note">
          <div className="sbp-trial-note-title">14-Day Free Trial — No Credit Card Required</div>
          <div className="sbp-trial-note-sub">Full access to every feature. $129/month after trial.</div>
        </div>
        <div className="sbp-field">
          <label className="sbp-label">Login Email</label>
          <input id={`sbp${n}-login-email`} type="email" readOnly className={`sbp-input sbp-input-readonly`} />
        </div>
        <div className="sbp-field">
          <label className="sbp-label">Password</label>
          <input id={`sbp${n}-password`} type="password" placeholder="At least 8 characters" className="sbp-input" />
        </div>
        <div className="sbp-field">
          <label className="sbp-label">Confirm Password</label>
          <input id={`sbp${n}-confirm`} type="password" placeholder="Repeat password" className="sbp-input" />
        </div>
        <div className="sbp-agree-row">
          <input type="checkbox" id={`sbp${n}-agree`} className="sbp-agree-check" />
          <label htmlFor={`sbp${n}-agree`} className="sbp-agree-label">
            I agree to the{' '}
            <a href="https://spraybosspro.com/terms" target="_blank" rel="noreferrer" className="sbp-link">Terms of Service</a>
            {' '}and{' '}
            <a href="https://spraybosspro.com/privacy-policy" target="_blank" rel="noreferrer" className="sbp-link">Privacy Policy</a>
          </label>
        </div>
        <button id={`sbp${n}-create-btn`} onClick={() => sbpCreateAccount(n)} className="btn-primary" style={{width:'100%', fontSize:'15px', padding:'13px'}}>
          Create My Account
        </button>
        <button className="sbp-btn-back" onClick={() => sbpBackToStep1(n)}>← Back</button>
      </div>

      {/* Success */}
      <div id={`sbp${n}-success`} className="sbp-success-panel">
        <div className="sbp-success-icon">✓</div>
        <div className="sbp-success-title">You&#39;re In!</div>
        <div className="sbp-success-sub">Your 14-day free trial has started.<br />Taking you to your dashboard…</div>
        <div id={`sbp${n}-countdown`} className="sbp-countdown"></div>
      </div>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || !sbpOpenForm) return;
      const n = sbpOpenForm;
      if (document.getElementById('sbp-form-' + n)?.style.display !== 'block') return;
      if (document.getElementById(`sbp${n}-step2`)?.style.display === 'block') sbpCreateAccount(n);
      else sbpStep2(n);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {/* ════ NAVBAR ════ */}
      <Navbar onTrialClick={(el) => openSignupModal(1, el)} />

      {/* ════ HERO ════ */}
      <div className="hero">
<h1>Premium Lawn Care &amp; Pest Control Software.<br /><span>Finally at a Price That Makes Sense.</span></h1>
        <div className="hero-sub">
          ServiceTitan costs $500–$700/month and was built for HVAC companies. Jobber was built for plumbers. SprayBossPro was built for <em>you</em> — every feature purpose-built for spray routes, at $129/month flat, with nothing locked or limited.
        </div>
        <div className="hero-btns">
          <a href="#" onClick={(e) => { e.preventDefault(); openSignupModal(1, e.currentTarget as HTMLElement); }} className="btn-primary">
            Start Free — 14 Days, No Card
          </a>
          <a href="https://spraybosspro.com/features" className="btn-ghost">See All Features →</a>
        </div>
        <div className="hero-proof">
          <div className="proof-item"><div className="proof-val">$129</div><div className="proof-lbl">Flat Monthly — Everything Included</div></div>
          <div className="proof-item"><div className="proof-val">Unlimited</div><div className="proof-lbl">Users, Clients &amp; Properties</div></div>
          <div className="proof-item"><div className="proof-val">500+</div><div className="proof-lbl">SMS Alerts Included Monthly</div></div>
          <div className="proof-item"><div className="proof-val">2006</div><div className="proof-lbl">In the Industry Since</div></div>
        </div>
      </div>

      {/* ════ PREMIUM BAND ════ */}
      <div className="premium-band">
        <h2>Affordable Doesn&#39;t Mean Cheap.<br /><span>This Is Enterprise-Level Software.</span></h2>
        <p>We charged less because we&#39;ve been the customer. We know what it feels like to pay $600 a month for software that still doesn&#39;t do what your business actually needs. SprayBossPro does everything the enterprise platforms do — route mapping, chemical compliance, automated SMS, Stripe payments, role-based access, mobile app — built specifically for spray businesses, and priced for the real world.</p>
        <div className="premium-grid">
          <div className="premium-card"><div className="premium-card-icon">🗺️</div><h4>Enterprise Route Intelligence</h4><p>Live route maps, drag-and-drop stop ordering, circle-to-schedule map selection — tools that cost thousands per month at other platforms.</p></div>
          <div className="premium-card"><div className="premium-card-icon">🧪</div><h4>Full Chemical Compliance Engine</h4><p>Pesticide application logs, technician license tracking, weather conditions, print-ready compliance reports — built for state inspectors.</p></div>
          <div className="premium-card"><div className="premium-card-icon">💬</div><h4>Automated Communication Suite</h4><p>10+ automated SMS alert types, two-way texting inbox, 3-step estimate and payment follow-up sequences — all running without you.</p></div>
          <div className="premium-card"><div className="premium-card-icon">💳</div><h4>Stripe Payment Processing</h4><p>Card-on-file storage, post-service billing, partial payments, automated payment reminders — the full billing stack built in.</p></div>
          <div className="premium-card"><div className="premium-card-icon">👑</div><h4>Role-Based Access Control</h4><p>Owner, Manager, Office, Technician, and Mobile roles — same granular permission system as platforms charging 5x more.</p></div>
          <div className="premium-card"><div className="premium-card-icon">📱</div><h4>Full Mobile App for Field Techs</h4><p>Techs manage their stops, log chemicals, mark complete, and add photos from their phone — no app store download required.</p></div>
        </div>
      </div>

      {/* ════ LASSO FEATURE ════ */}
      <section>
        <div className="row">
          <div className="row-text">
            <span className="section-label">Only in SprayBossPro</span>
            <h2 className="section-title">Circle Any Area on the Map.<br />Instantly Know Everything Inside It.</h2>
            <p style={{color:'var(--muted)', fontSize:'16px', lineHeight:'1.8', marginBottom:'8px'}}>No other lawn care or pest control software has this. On the waiting list map, draw a circle around any geographic area. SprayBossPro instantly calculates every detail of what&#39;s inside — before you schedule a single stop or mix a single gallon.</p>
            <ul className="check-list">
              <li>Total sq ft and linear ft for all properties in the circle</li>
              <li>Total stop count and total number of services</li>
              <li>Breakdown by service type — Lawn Care 4, Mosquito, Insect, etc.</li>
              <li>Totals per service so you know exactly how much chemical to mix</li>
              <li>Schedule all circled stops at once — they go straight to the dispatch board with a full route map</li>
              <li>All service types are fully customizable to match your operation</li>
              <li>Know before you load the truck. Know before you mix a gallon.</li>
            </ul>
          </div>
          <div className="row-visual">
            <div style={{color:'rgba(255,255,255,.45)', fontSize:'11px', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px'}}>Waiting List Map — Circle Selection</div>
            <div className="lasso-map">
              <div className="lasso-ring"></div>
              <div className="lasso-pins">
                <div className="lpin s"></div><div className="lpin s"></div><div className="lpin u"></div>
                <div className="lpin s"></div><div className="lpin s"></div><div className="lpin u"></div>
                <div className="lpin s"></div><div className="lpin s"></div><div className="lpin s"></div>
                <div className="lpin u"></div><div className="lpin s"></div><div className="lpin s"></div>
              </div>
            </div>
            <div className="stat-grid">
              <div className="stat-cell"><div className="stat-val">14</div><div className="stat-lbl">Stops Selected</div></div>
              <div className="stat-cell"><div className="stat-val">19</div><div className="stat-lbl">Total Services</div></div>
              <div className="stat-cell"><div className="stat-val">118,400</div><div className="stat-lbl">Sq Ft</div></div>
              <div className="stat-cell"><div className="stat-val">4,200</div><div className="stat-lbl">Linear Ft</div></div>
              <div className="stat-cell full"><div className="stat-val">Lawn Care 4 · 8 &nbsp;|&nbsp; Mosquito · 6 &nbsp;|&nbsp; Insect · 5</div><div className="stat-lbl">By Service Type</div></div>
            </div>
            <button style={{width:'100%', marginTop:'12px', background:'var(--orange)', color:'#fff', border:'none', borderRadius:'8px', padding:'13px', fontSize:'14px', fontWeight:700, cursor:'pointer', fontFamily:'inherit'}}>
              Schedule These 14 Stops →
            </button>
          </div>
        </div>
      </section>

      {/* ════ EASIER TO USE ════ */}
      <section style={{background:'var(--light-bg)'}}>
        <div className="centered" style={{maxWidth:'1100px', margin:'0 auto'}}>
          <span className="section-label">Built Different</span>
          <h2 className="section-title">Powerful Doesn&#39;t Have to Mean Complicated.</h2>
          <p className="section-sub">The big enterprise platforms take weeks to learn and months to set up. SprayBossPro is designed so any owner or office manager can be running routes on day one — without training, without a consultant, without an IT department.</p>
        </div>
        <div className="simple-grid">
          <div className="simple-card"><div className="simple-num">01</div><h3>Set Up in One Afternoon</h3><p>Add your services, import your clients and properties, and configure your alerts. Most businesses are scheduling real routes within their first day. No implementation fee, no onboarding call required.</p></div>
          <div className="simple-card"><div className="simple-num">02</div><h3>One Screen Does Everything</h3><p>The dispatch board shows your waiting list, your schedule, your route map, and your day summary all in one place. Your crew gets their stops on their phone. No switching between 6 different apps.</p></div>
          <div className="simple-card"><div className="simple-num">03</div><h3>Techs Learn It in Minutes</h3><p>The mobile view is built for people in trucks, not office managers at desks. Big buttons, clear status, one tap to mark complete, log chemicals, or skip a stop. No manual needed.</p></div>
          <div className="simple-card"><div className="simple-num">04</div><h3>Automation Does the Work</h3><p>Set your alert templates once. After that, SprayBossPro texts your customers, follows up on estimates, chases unpaid invoices, and requests reviews — all automatically, every time, without you thinking about it.</p></div>
        </div>
      </section>

      {/* ════ WAITING LIST DEEP DIVE ════ */}
      <section>
        <div className="row reverse">
          <div className="row-text">
            <span className="section-label">Scheduling Intelligence</span>
            <h2 className="section-title">Know Exactly What You Have Waiting Before You Book a Single Stop</h2>
            <p style={{color:'var(--muted)', fontSize:'16px', lineHeight:'1.8'}}>The sq ft waiting list is the feature that changes how you run your day. Instead of scheduling on gut feel, you see the exact square footage waiting for every service type — so you know how much Lawn Care 4, Mosquito, or Insect Control you have before you make a single call or mix a single gallon.</p>
            <ul className="check-list">
              <li>Waiting list grouped by service type with sq ft totals</li>
              <li>Schedule directly from the list or from the map</li>
              <li>Circle a geographic area and schedule all properties inside at once</li>
              <li>Assign date, tech, and truck at scheduling time</li>
              <li>Stops appear on the dispatch board with a full route map instantly</li>
              <li>Know your chemical needs for the day before you load a single truck</li>
            </ul>
          </div>
          <div className="row-visual">
            <div style={{color:'rgba(255,255,255,.45)', fontSize:'11px', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'14px'}}>Waiting List — By Service Type</div>
            <div className="mock-item">
              <div className="mock-dot green"></div>
              <div><div className="mock-label">Lawn Care 4</div><div className="mock-sub">47 properties waiting</div></div>
              <div className="mock-badge green">384,200 ft²</div>
            </div>
            <div className="mock-item">
              <div className="mock-dot orange"></div>
              <div><div className="mock-label">Lawn Insect 3</div><div className="mock-sub">31 properties waiting</div></div>
              <div className="mock-badge">246,500 ft²</div>
            </div>
            <div className="mock-item">
              <div className="mock-dot blue"></div>
              <div><div className="mock-label">Mosquito Treatment</div><div className="mock-sub">22 properties waiting</div></div>
              <div className="mock-badge blue">118,000 ft²</div>
            </div>
            <div className="mock-item">
              <div className="mock-dot green"></div>
              <div><div className="mock-label">Flower Beds 4</div><div className="mock-sub">15 properties waiting</div></div>
              <div className="mock-badge green">42,300 ft²</div>
            </div>
            <div style={{marginTop:'14px', background:'rgba(255,255,255,.06)', borderRadius:'8px', padding:'14px', textAlign:'center'}}>
              <div style={{color:'var(--orange)', fontSize:'15px', fontWeight:700}}>Know before you dial. Know before you mix.</div>
              <div style={{color:'rgba(255,255,255,.38)', fontSize:'12px', marginTop:'4px'}}>No other software shows you this.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ VS TABLE ════ */}
      <div className="vs-band">
        <div className="vs-inner">
          <div className="centered" style={{marginBottom:'48px'}}>
            <span className="section-label">How We Compare</span>
            <h2 className="section-title">Everything the Big Platforms Have.<br />None of the Price.</h2>
            <p className="section-sub" style={{marginLeft:'auto', marginRight:'auto'}}>SprayBossPro does everything ServiceTitan, Jobber, and FieldRoutes do — and adds features they don&#39;t have — at a fraction of the cost. And it&#39;s built specifically for spray businesses, not adapted from an HVAC tool.</p>
          </div>
          <table className="vs-table">
            <thead>
              <tr>
                <th></th>
                <th className="sbp-col">SprayBossPro</th>
                <th className="other-col">Enterprise Platforms</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Monthly Price</td><td className="sbp-col">$129 flat</td><td className="other-col">$500–$700+</td></tr>
              <tr><td>Per-User Fees</td><td className="sbp-col">✓ None</td><td className="other-col">$50–$150/user</td></tr>
              <tr><td>Built for Spray Businesses</td><td className="sbp-col">✓ Yes</td><td className="other-col">No — HVAC/Plumbing</td></tr>
              <tr><td>Sq Ft Waiting List</td><td className="sbp-col">✓ Yes</td><td className="other-col">No</td></tr>
              <tr><td>Circle-to-Schedule Map Tool</td><td className="sbp-col">✓ Yes</td><td className="other-col">No</td></tr>
              <tr><td>Chemical Compliance Reports</td><td className="sbp-col">✓ Yes</td><td className="other-col">Add-on / Extra</td></tr>
              <tr><td>Automated SMS Alerts</td><td className="sbp-col">✓ 10+ types</td><td className="other-col">Limited / Extra</td></tr>
              <tr><td>Two-Way SMS Inbox</td><td className="sbp-col">✓ Yes</td><td className="other-col">Add-on</td></tr>
              <tr><td>Stripe Payments Built In</td><td className="sbp-col">✓ Yes</td><td className="other-col">Yes</td></tr>
              <tr><td>Mobile App for Techs</td><td className="sbp-col">✓ Yes</td><td className="other-col">Yes</td></tr>
              <tr><td>Contracts Required</td><td className="sbp-col">✓ None</td><td className="other-col">Annual contracts</td></tr>
              <tr><td>Setup Time</td><td className="sbp-col">✓ Same day</td><td className="other-col">Weeks + onboarding fee</td></tr>
            </tbody>
          </table>
          <p className="vs-note">Enterprise platform pricing based on publicly available estimates. SprayBossPro pricing is $129/month, all features included.</p>
        </div>
      </div>

      {/* ════ FEATURE OVERVIEW ════ */}
      <section>
        <div className="centered" style={{maxWidth:'1200px', margin:'0 auto'}}>
          <span className="section-label">Full Platform</span>
          <h2 className="section-title">Everything You Need. Nothing You Don&#39;t.</h2>
          <p className="section-sub">Every feature below is included in your $129/month. No tiers, no add-ons.</p>
        </div>
        <div className="feat-grid">
          <div className="feat-card"><span className="feat-icon">📋</span><h3>Sq Ft Waiting List</h3><p>Total sq ft waiting per service type before you build a route.</p></div>
          <div className="feat-card"><span className="feat-icon">⭕</span><h3>Circle-to-Schedule Map</h3><p>Draw a circle, get totals, schedule all properties inside at once.</p></div>
          <div className="feat-card"><span className="feat-icon">🗺️</span><h3>Live Route Map</h3><p>Every stop pinned on an interactive map with drag-and-drop reordering.</p></div>
          <div className="feat-card"><span className="feat-icon">🧪</span><h3>Chemical Tracking</h3><p>Full application log with compliance reports ready for any inspector.</p></div>
          <div className="feat-card"><span className="feat-icon">💬</span><h3>Two-Way SMS Inbox</h3><p>Send and receive texts with customers directly inside SprayBossPro.</p></div>
          <div className="feat-card"><span className="feat-icon">🔔</span><h3>10+ Automated Alerts</h3><p>Scheduled, completed, skipped, estimate, payment, review — all automatic.</p></div>
          <div className="feat-card"><span className="feat-icon">💰</span><h3>Estimates That Close</h3><p>Build, email, and auto-follow-up on estimates without leaving the app.</p></div>
          <div className="feat-card"><span className="feat-icon">💳</span><h3>Stripe Payments</h3><p>Card-on-file billing, invoices, and automated payment reminders.</p></div>
          <div className="feat-card"><span className="feat-icon">📱</span><h3>Mobile App for Techs</h3><p>Stop list, chemical logging, and status updates from the field.</p></div>
          <div className="feat-card"><span className="feat-icon">📦</span><h3>Package Programs</h3><p>Multi-treatment plans with renewal alerts and treatment tracking.</p></div>
          <div className="feat-card"><span className="feat-icon">⭐</span><h3>Review Requests</h3><p>Automated Google review requests after every completed service.</p></div>
          <div className="feat-card"><span className="feat-icon">👑</span><h3>Role-Based Access</h3><p>Owner, Manager, Office, Tech, and Mobile roles with custom permissions.</p></div>
        </div>
        <div style={{textAlign:'center', marginTop:'48px'}}>
          <a href="https://spraybosspro.com/features" style={{color:'var(--orange)', fontSize:'15px', fontWeight:700, textDecoration:'none'}}>See the full feature list →</a>
        </div>
      </section>

      {/* ════ PRICING ════ */}
      <section style={{background:'var(--light-bg)'}}>
        <div className="centered" style={{maxWidth:'580px', margin:'0 auto 48px'}}>
          <span className="section-label">Pricing</span>
          <h2 className="section-title">One Price. Everything.</h2>
          <p className="section-sub" style={{marginLeft:'auto', marginRight:'auto'}}>We were paying $500–$700/month for software that still didn&#39;t fit the way we worked. We built the pricing we always wished existed.</p>
        </div>
        <div className="price-card">
          <div className="price-badge">Everything Included — No Tiers</div>
          <div style={{fontSize:'13px', fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'10px'}}>SprayBossPro</div>
          <div className="price-amount"><sup>$</sup>129</div>
          <div className="price-period">per month · cancel anytime · no contracts</div>
          <ul className="price-includes">
            <li>Unlimited Users</li>
            <li>Unlimited Clients</li>
            <li>Unlimited Properties</li>
            <li>All Features Included</li>
            <li>Scheduling &amp; Maps</li>
            <li>Chemical Tracking</li>
            <li>Estimates &amp; Invoices</li>
            <li>Stripe Payments</li>
            <li>Two-Way SMS</li>
            <li>Mobile App</li>
            <li>500 SMS/month</li>
            <li>+$15/500 extra SMS</li>
          </ul>
          <button onClick={(e) => openSignupModal(2, e.currentTarget as HTMLElement)} className="btn-primary" style={{width:'100%', fontSize:'16px', padding:'16px'}}>
            Start Your 14-Day Free Trial
          </button>
          <p style={{textAlign:'center', color:'var(--muted)', fontSize:'13px', marginTop:'14px'}}>No credit card required. No contracts.</p>
        </div>
      </section>

      {/* ════ CTA ════ */}
      <div className="cta-band">
        <h2>Stop Paying Enterprise Prices<br />for Software That Wasn&#39;t Built for You.</h2>
        <p>SprayBossPro is built by people who&#39;ve run real spray routes. Premium tools, simple enough to use on day one, priced for the real world. Try it free for 14 days — no credit card, no commitment.</p>
        <div className="hero-btns" style={{justifyContent:'center'}}>
          <a href="#" onClick={(e) => { e.preventDefault(); openSignupModal(3, e.currentTarget as HTMLElement); }} className="btn-primary" style={{fontSize:'17px', padding:'18px 48px'}}>
            Start Free — No Card Required
          </a>
        </div>
      </div>

      {/* ════ SIGNUP FORMS ════ */}
      <div id="sbp-backdrop" className="sbp-backdrop" onClick={() => closeAllModals()}></div>
      <SignupForm n={1} />
      <SignupForm n={2} />
      <SignupForm n={3} />
    </>
  );
}
