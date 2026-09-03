'use client';
import { useEffect } from 'react';
import Navbar from './Navbar';
import SignupModal from './SignupModal';
import HeroDemo from './HeroDemo';

/* Landing page for demo-INTENT search ("lawn care software demo", "pest control CRM demo").
   Those searchers are not browsing — they want to look at the product right now. Every
   competitor ranking for these terms answers with a booked call: Service Autopilot's
   "personalized demo and consultation", CLIP's "book a demo with their team". The ones that
   skip the call offer a free trial into an EMPTY system you then have to populate yourself.
   So the page leads with the demo itself and the whole argument is "nobody to talk to". */

export type DemoPageCopy = {
  vertical: string;          // "lawn care"  — used mid-sentence, lowercase
  Vertical: string;          // "Lawn Care"  — used in headings
  badge: string;
  h1a: string;
  h1b: string;               // rendered in orange
  sub: string;
  demoIncludes: { icon: string; title: string; body: string }[];
  faqs: { q: string; a: string }[];
};

export default function DemoPageTemplate({ copy }: { copy: DemoPageCopy }) {
  const openTrial = (el: HTMLElement) => { (window as any).__openSignup?.(1, el); };

  /* FAQPage structured data, built from the same FAQ list rendered below so the two can never
     drift apart. Demo-intent queries are exactly the kind Google answers with FAQ rich results. */
  useEffect(() => {
    const ID = 'demo-faq-ld';
    if (document.getElementById(ID)) return;
    const s = document.createElement('script');
    s.id = ID;
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: copy.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
    document.head.appendChild(s);
    return () => { document.getElementById(ID)?.remove(); };
  }, [copy.faqs]);

  return (
    <>
      <Navbar onTrialClick={openTrial} />

      {/* ═══ PRICE + THE DEMO ITSELF ═══
          Same order as the home page, and for the same reason: on a phone the first screen is the
          whole decision, and paid traffic arrives from the Facebook in-app browser and leaves in
          seconds. A three-line headline about not being a sales call filled that screen and pushed
          the running product below the fold, with the price nowhere on the page at all. Price,
          trial terms and the live demo now take the fold; the argument for it reads underneath,
          where it convinces the people who stayed instead of costing the ones who didn't. */}
      <div style={{ background: 'linear-gradient(135deg,#080010 0%,#130520 60%,#1e0a35 100%)', padding: 'clamp(76px,7vw,80px) clamp(14px,4vw,40px) 0', textAlign: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(22px,3vw,32px)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', color: '#fff' }}>
            <span style={{ fontSize: 'clamp(30px,4.6vw,46px)', fontWeight: 800, lineHeight: 1 }}>$59<span style={{ fontSize: '.46em', fontWeight: 700, color: 'rgba(255,255,255,.6)' }}>/month</span></span>
            <span style={{ fontSize: 'clamp(16px,2.2vw,22px)', fontWeight: 800, color: '#e07820' }}>&middot; 14-Day Free Trial</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,.6)', fontSize: '13px', fontWeight: 600, marginTop: '7px', letterSpacing: '.3px' }}>No credit card required &middot; Cancel anytime</div>
        </div>
        <HeroDemo />
      </div>

      {/* ═══ HERO — now sits under the demo the visitor has already started poking at ═══ */}
      <div className="hero" style={{ paddingTop: 'clamp(44px,5vw,60px)', paddingBottom: '0' }}>
        <div className="hero-badge">{copy.badge}</div>
        <h1>{copy.h1a}<br /><span>{copy.h1b}</span></h1>
        <p className="hero-sub" style={{ marginBottom: '30px' }}>{copy.sub}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px 26px', flexWrap: 'wrap', color: 'rgba(255,255,255,.72)', fontSize: '14px', fontWeight: 600, marginBottom: '44px' }}>
          <span>✓ No sales call</span>
          <span>✓ No signup</span>
          <span>✓ No credit card</span>
          <span>✓ Already loaded with a real company</span>
        </div>
      </div>

      {/* ═══ WHAT "DEMO" MEANS EVERYWHERE ELSE ═══ */}
      <div className="vs-band">
        <div className="vs-inner" style={{ textAlign: 'center' }}>
          <span className="section-label">The difference</span>
          <h2 className="section-title">Most &ldquo;demos&rdquo; are a phone call</h2>
          <p className="section-sub" style={{ margin: '0 auto 44px' }}>
            Search for {copy.vertical} software and every demo button asks for your name, your
            number, and a slot on someone&rsquo;s calendar. Ours is the thing above &mdash; it is
            already running.
          </p>
          <table className="vs-table">
            <thead>
              <tr>
                <th></th>
                <th className="sbp-col">SprayBossPro</th>
                <th className="other-col">Typical {copy.vertical} software</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>See the software</td><td className="sbp-col">Right now</td><td className="other-col">After a scheduled call</td></tr>
              <tr><td>Give your phone number</td><td className="sbp-col">Never</td><td className="other-col">Required</td></tr>
              <tr><td>Credit card</td><td className="sbp-col">Never</td><td className="other-col">Often, for the trial</td></tr>
              <tr><td>Data in the demo</td><td className="sbp-col">A full company</td><td className="other-col">Empty, or a slide deck</td></tr>
              <tr><td>Crew &amp; customer apps</td><td className="sbp-col">Both, live</td><td className="other-col">Screenshots</td></tr>
              <tr><td>Sales follow-up</td><td className="sbp-col">None</td><td className="other-col">Expect it</td></tr>
            </tbody>
          </table>
          <p className="vs-note">No form stands between you and the demo above. There is nothing to fill in.</p>
        </div>
      </div>

      {/* ═══ WHAT IS ACTUALLY IN IT ═══ */}
      <div style={{ background: '#fff', padding: '96px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <span className="section-label">Loaded and running</span>
          <h2 className="section-title">A real {copy.vertical} company, not an empty screen</h2>
          <p className="section-sub" style={{ margin: '0 auto 56px' }}>
            A free trial hands you a blank system and a weekend of data entry before you can tell
            whether you like it. The demo is a company mid-season, with the mess already in it.
          </p>
          <div className="feat-grid">
            {copy.demoIncludes.map(f => (
              <div className="feat-card" key={f.title}>
                <span className="feat-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ THREE APPS ═══ */}
      <div style={{ background: 'var(--light-bg)', padding: '96px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <span className="section-label">All three, in the demo</span>
          <h2 className="section-title">Office, crew, and customer &mdash; switch between them</h2>
          <p className="section-sub" style={{ margin: '0 auto 56px' }}>
            The picker above the demo swaps between the three apps that make up the system. They
            share one backend, so a stop your crew finishes shows up in the office and on the
            customer&rsquo;s phone.
          </p>
          <div className="steps-grid">
            <div className="step-box">
              <div className="step-circle">1</div>
              <h3>The office</h3>
              <p>Scheduling, the circle-map route builder, invoicing, chemical logs. What you run the business from.</p>
            </div>
            <div className="step-box">
              <div className="step-circle">2</div>
              <h3>The crew app</h3>
              <p>Today&rsquo;s stop list, gate codes, property notes, arrival alerts, before-and-after photos.</p>
            </div>
            <div className="step-box">
              <div className="step-circle">3</div>
              <h3>The customer app</h3>
              <p>What your customers get &mdash; visits, invoices, pay a bill, and alerts they choose themselves.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FAQ ═══ */}
      <div style={{ background: '#fff', padding: '96px 40px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <span className="section-label">Questions</span>
            <h2 className="section-title">About the demo</h2>
          </div>
          <div style={{ marginTop: '48px' }}>
            {copy.faqs.map(f => (
              <div key={f.q} style={{ borderBottom: '1px solid var(--border)', padding: '22px 0' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' }}>{f.q}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.7 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CTA ═══ */}
      <div className="cta-band">
        <h2>Seen enough?</h2>
        <p>
          The demo is the same software you get. from $59/month, every feature included, and a
          14-day free trial with no card up front.
        </p>
        <button className="btn-primary" onClick={(e) => openTrial(e.currentTarget)}>
          Start Your 14-Day Free Trial
        </button>
      </div>

      <SignupModal />
    </>
  );
}
