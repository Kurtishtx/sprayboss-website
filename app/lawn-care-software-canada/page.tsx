'use client';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import SignupModal from '../components/SignupModal';
import HeroDemo from '../components/HeroDemo';

/* Long-form Canada landing page — same depth and section rhythm as the homepage, but every
   section answers the one question a Canadian owner actually has: "does this US-looking
   software really work HERE?" The honest answers (CAD customer billing is native; the
   subscription bills in USD; texting needs a Canadian number registered during onboarding)
   live in plain sight instead of in fine print. */

const faqs = [
  {
    q: 'Does SprayBossPro actually work for Canadian lawn care companies?',
    a: 'Yes. Scheduling, routing, customer records, estimates, invoicing in Canadian dollars, the crew app and the customer app all work in Canada today. You connect your own Canadian Stripe account and your customers are billed in CAD.',
  },
  {
    q: 'Do my customers get charged in Canadian dollars?',
    a: 'Yes. Set your country to Canada on the Company Info page and every invoice, card-on-file charge, and payment link goes out in CAD automatically. Your customers see plain Canadian dollars on their statements — no US-dollar line items, no conversion complaints.',
  },
  {
    q: 'Do I need a special Stripe setup for Canada?',
    a: 'No — you connect your own Canadian Stripe account, the same free Stripe account any Canadian business can open. Payments land in your Canadian bank account in CAD. SprayBossPro never touches your money; Stripe pays you directly.',
  },
  {
    q: 'What does the subscription itself cost in Canada?',
    a: 'Plans are priced in US dollars — from $59 USD a month with every feature included, no add-ons and no per-user pricing. Your card is charged in USD and your bank converts. We say this plainly because surprise conversion is exactly the kind of thing software companies hide.',
  },
  {
    q: 'Does the automated texting work in Canada?',
    a: 'Texting in Canada requires registering a Canadian sending number with the carriers, which takes some setup — it is not flip-a-switch on day one. We help you through it during onboarding. Email alerts and the customer-app notifications work everywhere immediately.',
  },
  {
    q: 'Can it handle a May-to-October season?',
    a: 'That is exactly what the recurring program engine is for. Set your treatment intervals, and the waiting list shows who is due and who is slipping — so in a 24-week season you are never burning a week figuring out what to schedule. Off-season, your data, programs and card-on-file billing all carry over to spring.',
  },
  {
    q: 'Does the application logging cover provincial record-keeping?',
    a: 'Every application is logged with product, rate, area treated, conditions and technician, and you can filter and print the history for any date range. It is generic record-keeping — you stay responsible for your own provincial requirements, but the records themselves are captured automatically on every stop.',
  },
  {
    q: 'Do I have to book a demo or talk to a salesperson?',
    a: 'No. The demo on this page is the real software connected to a live demo company. Nobody is notified you looked, and nobody will call you. If you want a human, the owner personally texts new companies — the opposite arrangement of most software.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes — 14 days, no credit card required to start. Set your country to Canada during setup and your account bills customers in CAD from the first invoice.',
  },
];

export default function Page() {
  const openTrial = (el: HTMLElement) => { (window as any).__openSignup?.(1, el); };

  /* FAQPage structured data, built from the same FAQ array rendered below so the two can never
     drift apart — same pattern as the demo pages. */
  useEffect(() => {
    const ID = 'canada-lawn-faq-ld';
    if (document.getElementById(ID)) return;
    const s = document.createElement('script');
    s.id = ID;
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
    document.head.appendChild(s);
    return () => { document.getElementById(ID)?.remove(); };
  }, []);

  return (
    <>
      <Navbar onTrialClick={openTrial} />

      {/* ═══ PRICE + THE LIVE DEMO — top of the fold, same as the homepage ═══ */}
      <div style={{ background: 'linear-gradient(135deg,#080010 0%,#130520 60%,#1e0a35 100%)', padding: 'clamp(76px,7vw,80px) clamp(14px,4vw,40px) 0', textAlign: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(22px,3vw,32px)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', color: '#fff' }}>
            <span style={{ fontSize: 'clamp(30px,4.6vw,46px)', fontWeight: 800, lineHeight: 1 }}>$59<span style={{ fontSize: '.46em', fontWeight: 700, color: 'rgba(255,255,255,.6)' }}>/month</span></span>
            <span style={{ fontSize: 'clamp(16px,2.2vw,22px)', fontWeight: 800, color: '#e07820' }}>&middot; 14-Day Free Trial</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,.6)', fontSize: '13px', fontWeight: 600, marginTop: '7px', letterSpacing: '.3px' }}>No credit card required &middot; Cancel anytime &middot; Bills your customers in CAD</div>
        </div>
        <HeroDemo />
      </div>

      {/* ═══ HERO ═══ */}
      <div className="hero" style={{ paddingTop: 'clamp(44px,5vw,60px)' }}>
        <div className="hero-badge">Works in Canada &middot; CAD invoicing built in</div>
        <h1>Lawn Care Software<br /><span>That Works in Canada</span></h1>
        <p className="hero-sub" style={{ marginBottom: '30px' }}>Most US lawn care platforms treat Canada as an afterthought. SprayBossPro invoices your customers in Canadian dollars, routes your crews on Canadian streets, and runs your whole season &mdash; Victoria Day to first frost &mdash; from one dashboard. The live demo above is real software; go click it.</p>
        <div className="hero-btns" style={{ marginBottom: '0' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); openTrial(e.currentTarget as HTMLElement); }} className="btn-primary">Start Your 14-Day Free Trial</a>
          <div className="hero-trust">No credit card required &nbsp;&middot;&nbsp; 14-day free trial &nbsp;&middot;&nbsp; <b>from $59/mo</b> after &nbsp;&middot;&nbsp; <b>demo needs no signup</b></div>
        </div>
        <div className="hero-stats">
          <div><div className="hero-stat-val">CAD</div><div className="hero-stat-lbl">Every Customer Invoice &amp; Charge</div></div>
          <div><div className="hero-stat-val">$59</div><div className="hero-stat-lbl">USD/Month &mdash; Every Feature</div></div>
          <div><div className="hero-stat-val">2</div><div className="hero-stat-lbl">Apps Included: Crew &amp; Customer</div></div>
          <div><div className="hero-stat-val">0</div><div className="hero-stat-lbl">Sales Calls Required</div></div>
        </div>
      </div>

      {/* ═══ THE CANADA PROBLEM — comparison band ═══ */}
      <div className="vs-band">
        <div className="vs-inner" style={{ textAlign: 'center' }}>
          <span className="section-label">The difference</span>
          <h2 className="section-title">Most US software &ldquo;works&rdquo; in Canada. Barely.</h2>
          <p className="section-sub" style={{ margin: '0 auto 44px' }}>
            You can log in to almost any US platform from Kelowna or Kitchener. The question is what
            happens when you try to bill a customer, map a route, or read your own pricing page.
            Here is the honest version of that table &mdash; including the two things we make you
            aware of up front.
          </p>
          <table className="vs-table">
            <thead>
              <tr>
                <th></th>
                <th className="sbp-col">SprayBossPro</th>
                <th className="other-col">Typical US lawn software</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Customer invoices &amp; charges</td><td className="sbp-col">Native CAD</td><td className="other-col">USD, or a workaround</td></tr>
              <tr><td>Card-on-file billing</td><td className="sbp-col">Your Canadian Stripe</td><td className="other-col">US processor, if at all</td></tr>
              <tr><td>Routing on Canadian streets</td><td className="sbp-col">Full Google mapping</td><td className="other-col">Varies by platform</td></tr>
              <tr><td>Subscription currency</td><td className="sbp-col">USD &mdash; stated up front</td><td className="other-col">USD &mdash; found on your statement</td></tr>
              <tr><td>Texting in Canada</td><td className="sbp-col">Set up during onboarding</td><td className="other-col">Often not addressed at all</td></tr>
              <tr><td>See it before you commit</td><td className="sbp-col">Live demo, right now</td><td className="other-col">Book a sales call</td></tr>
            </tbody>
          </table>
          <p className="vs-note">Two honest caveats, stated here instead of hidden: the subscription bills in US dollars (your bank converts), and automated texting needs a Canadian sending number registered with carriers during onboarding.</p>
        </div>
      </div>

      {/* ═══ CAD INVOICING — the differentiator, full section ═══ */}
      <section id="cad-billing">
        <div className="highlight-row">
          <div className="highlight-text">
            <span className="section-label">Canadian Dollars, Native</span>
            <h2>Your customers pay in CAD. Full stop.</h2>
            <p>This is the part most US platforms fumble. In SprayBossPro you set your country to Canada on the Company Info page &mdash; one field, once &mdash; and from that moment every invoice, every card-on-file charge, and every Pay Now link bills your customers in Canadian dollars through your own Canadian Stripe account.</p>
            <p style={{ marginTop: '12px' }}>No customer ever sees a US-dollar line item on their statement. No conversion fee complaints. No explaining to Mrs. Tremblay why her $65 lawn treatment showed up as $47.20 USD plus a foreign transaction fee. Stripe deposits your money in CAD, into your Canadian bank account, and SprayBossPro never touches it in between.</p>
            <ul className="check-list">
              <li>Set Country = Canada in Company Info &mdash; that is the whole setup</li>
              <li>Every invoice, card charge, and payment link issued in CAD automatically</li>
              <li>Connect your own Canadian Stripe account &mdash; payouts land in your bank in CAD</li>
              <li>Card-on-file: charge after service without chasing anyone</li>
              <li>Estimates, invoices, discounts, and sales tax all in Canadian dollars</li>
              <li>Automated payment reminders chase unpaid invoices for you &mdash; in CAD</li>
              <li>Full payment history with method, date, and amount on every client</li>
            </ul>
          </div>
          <div className="highlight-visual">
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>A Real CAD Payment Page</div>
            {/* Genuine, uncropped Stripe checkout from the founder's own Canada-set company. */}
            <img src="/cad-checkout.png" alt="Stripe payment page for Hamann Lawn Care Invoice #459 charging CA$9.74 in Canadian dollars"
                 style={{ width: '100%', maxWidth: '100%', display: 'block', borderRadius: '10px', border: '1px solid rgba(255,255,255,.14)', boxShadow: '0 12px 36px rgba(0,0,0,.35)', background: '#fff' }} />
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '12px', lineHeight: 1.6, margin: '10px 0 16px', textAlign: 'center' }}>A real payment page from the platform &mdash; a Canada-set company&apos;s customer pays in Canadian dollars. (The founder&apos;s own company.)</div>
            <div className="mock-item"><div className="mock-dot green"></div><div><div className="mock-label">Lawn Fertilization &mdash; Round 3</div><div className="mock-sub">Card on file &middot; charged after service</div></div><div className="mock-badge green">$89.00 CAD</div></div>
            <div className="mock-item"><div className="mock-dot green"></div><div><div className="mock-label">Weed Control Application</div><div className="mock-sub">Pay Now link &middot; paid same day</div></div><div className="mock-badge green">$74.00 CAD</div></div>
            <div className="mock-item"><div className="mock-dot orange"></div><div><div className="mock-label">Aeration &amp; Overseed</div><div className="mock-sub">Invoice emailed &middot; reminder queued</div></div><div className="mock-badge">$189.00 CAD</div></div>
            <div className="mock-item"><div className="mock-dot blue"></div><div><div className="mock-label">Season Program &mdash; Prepay</div><div className="mock-sub">Estimate accepted &middot; converted to invoice</div></div><div className="mock-badge blue">$486.00 CAD</div></div>
            <div style={{ marginTop: '16px', background: 'rgba(255,255,255,.07)', borderRadius: '8px', padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ color: 'var(--orange)', fontSize: '16px', fontWeight: 700 }}>One setting. Every charge in CAD.</div>
              <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '12px', marginTop: '4px' }}>Country = Canada in Company Info, connected to your own Canadian Stripe.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SCHEDULING & RECURRING PROGRAMS ═══ */}
      <section id="programs" style={{ background: 'var(--light-bg)' }}>
        <div className="highlight-row reverse">
          <div className="highlight-text">
            <span className="section-label">Scheduling &amp; Programs</span>
            <h2>Recurring rounds that schedule themselves back</h2>
            <p>Canadian lawn care is program work &mdash; fertilizer rounds, weed control, aeration, fall cleanup &mdash; on repeat across hundreds of properties. SprayBossPro runs on a waiting list: set the treatment interval per service, and every property drops back onto the list when it is due. You are never rebooking anyone by hand.</p>
            <p style={{ marginTop: '12px' }}>The waiting list totals the square footage per service type before you schedule a single stop, so you know exactly how much work fits in a day &mdash; and how much product to mix &mdash; before anyone loads a truck.</p>
            <ul className="check-list">
              <li>Set recurring intervals per service &mdash; each round comes due automatically</li>
              <li>Waiting list shows who is due and who is slipping, by service type</li>
              <li>Square-footage totals per service so you can plan a full day at a glance</li>
              <li>One-click scheduling with date picker and crew assignment</li>
              <li>Dispatch board with stops, revenue, and sq ft summarized across the top</li>
              <li>Mark complete, skipped, or rescheduled with one click &mdash; alerts follow automatically</li>
              <li>Service types fully customizable to however your operation runs</li>
            </ul>
          </div>
          <div className="highlight-visual">
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Waiting List &mdash; Due This Week</div>
            <div className="svc-row"><div><div className="svc-name">Fertilizer &mdash; Round 3</div><div className="svc-sub">42 properties due</div></div><div className="svc-ft">318,200 ft&sup2;</div></div>
            <div className="svc-row"><div><div className="svc-name">Weed Control</div><div className="svc-sub">27 properties due</div></div><div className="svc-ft">204,600 ft&sup2;</div></div>
            <div className="svc-row"><div><div className="svc-name">Aeration &amp; Overseed</div><div className="svc-sub">11 properties due</div></div><div className="svc-ft">86,900 ft&sup2;</div></div>
            <div className="svc-row"><div><div className="svc-name">Grub Control</div><div className="svc-sub">8 properties due</div></div><div className="svc-ft">61,400 ft&sup2;</div></div>
            <div style={{ marginTop: '16px', background: 'rgba(255,255,255,.07)', borderRadius: '8px', padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ color: 'var(--orange)', fontSize: '15px', fontWeight: 700 }}>Everything due. Nothing missed.</div>
              <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '12px', marginTop: '4px' }}>Schedule straight from the waiting list in one click.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CIRCLE-MAP ROUTING ═══ */}
      <section id="routing" className="dark-section">
        <div className="highlight-row">
          <div className="highlight-text">
            <span className="section-label">Circle-Map Routing</span>
            <h2 style={{ color: '#fff' }}>Draw a circle around a neighbourhood. Schedule everything inside it.</h2>
            <p style={{ color: 'rgba(255,255,255,.65)' }}>Full Google mapping works across Canada, so the circle-map scheduler works exactly the way it does everywhere else: draw a circle around any area on the waiting-list map &mdash; a subdivision in Brampton, a crescent maze in Burnaby, a corridor of acreages outside Red Deer &mdash; and SprayBossPro totals everything inside it before you commit to a single stop.</p>
            <p style={{ color: 'rgba(255,255,255,.65)', marginTop: '12px' }}>Stops, service counts, square footage per service type &mdash; you know whether the circle is worth a truck, and what to load on it, before you drive out there. One click drops every circled stop onto the dispatch board with a full route in drive order.</p>
            <ul className="check-list" style={{ marginTop: '20px' }}>
              <li style={{ color: 'rgba(255,255,255,.75)' }}>Draw any size circle &mdash; instantly see every property inside</li>
              <li style={{ color: 'rgba(255,255,255,.75)' }}>Totals sq ft and service counts by type before you schedule</li>
              <li style={{ color: 'rgba(255,255,255,.75)' }}>One click schedules all circled stops to a date and crew</li>
              <li style={{ color: 'rgba(255,255,255,.75)' }}>Stops drop to the dispatch board in drive order on a live map</li>
              <li style={{ color: 'rgba(255,255,255,.75)' }}>Drag to reorder stops &mdash; tight routes, less fuel, more stops per day</li>
              <li style={{ color: 'rgba(255,255,255,.75)' }}>Works the same in a dense subdivision or on rural routes</li>
            </ul>
          </div>
          <div className="highlight-visual">
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Waiting List Map &mdash; Circle Selection</div>
            <div className="lasso-map">
              <div className="lasso-ring"></div>
              <div className="lasso-pins">
                {['s','s','u','s','s','s','u','s','s','u','s','s','s','u','s','s','s','u','s'].map((t, i) => (
                  <div key={i} className={`lpin ${t}`}></div>
                ))}
              </div>
            </div>
            <div className="stat-grid">
              <div className="stat-cell"><div className="stat-val">16</div><div className="stat-lbl">Stops Selected</div></div>
              <div className="stat-cell"><div className="stat-val">21</div><div className="stat-lbl">Total Services</div></div>
              <div className="stat-cell"><div className="stat-val">131,700</div><div className="stat-lbl">Sq Ft</div></div>
              <div className="stat-cell"><div className="stat-val">3,900</div><div className="stat-lbl">Linear Ft</div></div>
              <div className="stat-cell full"><div className="stat-val">Fertilizer &middot; 9 &nbsp;|&nbsp; Weed Control &middot; 7 &nbsp;|&nbsp; Aeration &middot; 5</div><div className="stat-lbl">Breakdown by Service Type</div></div>
            </div>
            <button style={{ width: '100%', marginTop: '12px', background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: '8px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Schedule These 16 Stops →</button>
            <div style={{ marginTop: '10px', textAlign: 'center', color: 'rgba(255,255,255,.35)', fontSize: '11px' }}>Drops to the dispatch board with a full route map</div>
          </div>
        </div>
      </section>

      {/* ═══ THE CANADIAN SEASON ═══ */}
      <section id="season" style={{ background: 'var(--light-bg)' }}>
        <div className="centered" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <span className="section-label">May to October</span>
          <h2 className="section-title">A 24-week season leaves no room for wasted weeks</h2>
          <p className="section-sub">A lawn care company in Georgia gets ten months to make its year. You get roughly May to October. Every scheduling mistake, every missed round, every week spent chasing invoices instead of spraying comes straight out of a season that is already half the length. The software has to squeeze more out of fewer weeks &mdash; that is the whole job.</p>
        </div>
        <div className="simple-grid">
          <div className="simple-card"><div className="simple-num">01</div><h3>Spring: load the season in a day</h3><p>Import your client list, set each property&apos;s program, and the waiting list builds your first rounds for you. Prepay customers? Send season estimates in bulk, let them accept online, and convert accepted estimates to invoices &mdash; in CAD &mdash; before the first truck rolls.</p></div>
          <div className="simple-card"><div className="simple-num">02</div><h3>Summer: keep every round on schedule</h3><p>The waiting list shows who is due and who is slipping, per service. When rain eats a Tuesday, reschedule the whole day in a few clicks and the alerts go out to customers automatically. No round quietly falls five weeks behind without you seeing it.</p></div>
          <div className="simple-card"><div className="simple-num">03</div><h3>Fall: finish strong, get paid in full</h3><p>Aeration, overseed, fall fertilizer, cleanups &mdash; the busiest stretch of the year. Card-on-file billing charges after each service so your receivables do not snowball into November. Automated reminders chase the stragglers so you close the season collected, not chasing.</p></div>
          <div className="simple-card"><div className="simple-num">04</div><h3>Winter: your book of business waits for you</h3><p>Every client, property, program, and card on file carries over. Renewal estimates for next season go out from your couch in January, customers accept online, and your spring schedule is half-built before the snow melts.</p></div>
        </div>
      </section>

      {/* ═══ APPLICATION LOGGING ═══ */}
      <section id="records">
        <div className="highlight-row reverse">
          <div className="highlight-text">
            <span className="section-label">Record-Keeping</span>
            <h2>Application records kept for you, on every stop</h2>
            <p>Provincial pesticide regulations mean Canadian applicators keep records &mdash; and a binder in the truck is a bad system for it. SprayBossPro logs every application as your crew works: product, rate, area treated, conditions, and who applied it, all tied to the property and the date.</p>
            <p style={{ marginTop: '12px' }}>It is generic record-keeping, done automatically &mdash; you stay responsible for knowing your own province&apos;s requirements, but the records themselves are captured on every job and printable for any date range whenever you need them.</p>
            <ul className="check-list">
              <li>Product, rate, area treated, and gallons logged per application</li>
              <li>Weather conditions recorded at time of application</li>
              <li>Technician recorded on every entry automatically</li>
              <li>Everything tied to the property address and date for fast lookup</li>
              <li>Filter by product, property, technician, or date range</li>
              <li>Print-ready application reports in seconds &mdash; no formatting</li>
              <li>Daily mix calculator totals what to mix before the truck leaves</li>
            </ul>
          </div>
          <div className="highlight-visual">
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Application Log &mdash; Today</div>
            <div className="log-row"><div className="log-label">Product / Rate</div><div className="log-value">Broadleaf herbicide &middot; label rate per 1,000 ft&sup2;</div></div>
            <div className="log-row"><div className="log-label">Area Treated</div><div className="log-value">Front + back lawn &middot; 7,400 ft&sup2;</div></div>
            <div className="log-row"><div className="log-label">Conditions</div><div className="log-value">Sunny &middot; 21&deg;C &middot; light wind</div></div>
            <div className="log-row"><div className="log-label">Technician</div><div className="log-value">Logged automatically from the crew app</div></div>
            <div style={{ marginTop: '16px', background: 'rgba(255,255,255,.07)', borderRadius: '8px', padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ color: 'var(--orange)', fontSize: '15px', fontWeight: 700 }}>Logged as the work happens.</div>
              <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '12px', marginTop: '4px' }}>Filter and print your records for any date range.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CREW APP ═══ */}
      <section id="crew-app" style={{ background: 'var(--light-bg)' }}>
        <div className="highlight-row">
          <div className="highlight-text">
            <span className="section-label">The Crew App</span>
            <h2>Your crew gets the day on their phone</h2>
            <p>Every technician opens the crew app and sees today&apos;s route in drive order &mdash; the map, the stop list, the gate codes, the property notes. They start a stop, do the work, log the application, and mark it complete. The office sees it the moment they tap done, and the customer&apos;s alert goes out automatically.</p>
            <ul className="check-list">
              <li>Today&apos;s stops in drive order, on a live map</li>
              <li>Gate codes, unit numbers, and property notes on every stop</li>
              <li>Mark complete, skip, or reschedule from the truck &mdash; no calls to the office</li>
              <li>Log applications right on the stop as the work happens</li>
              <li>Before-and-after photos attached to the visit</li>
              <li>Arrival alerts to the customer fire automatically as the crew works</li>
              <li>Role-based access &mdash; crews see their stops, not your books</li>
            </ul>
            <p style={{ marginTop: '16px' }}>It is a web app &mdash; nothing to install from an app store, nothing to update, works on whatever phone your crew already carries.</p>
          </div>
          <div className="highlight-visual">
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Crew App &mdash; Today&apos;s Route</div>
            <div className="mock-item"><div className="mock-dot green"></div><div><div className="mock-label">Stop 1 &mdash; Maple Cres.</div><div className="mock-sub">Fertilizer R3 &middot; completed &middot; app logged</div></div><div className="mock-badge green">Done</div></div>
            <div className="mock-item"><div className="mock-dot green"></div><div><div className="mock-label">Stop 2 &mdash; Birchwood Dr.</div><div className="mock-sub">Weed control &middot; photos attached</div></div><div className="mock-badge green">Done</div></div>
            <div className="mock-item"><div className="mock-dot orange"></div><div><div className="mock-label">Stop 3 &mdash; Lakeshore Rd.</div><div className="mock-sub">Gate code 4418 &middot; dog in yard &mdash; check gate</div></div><div className="mock-badge">Up Next</div></div>
            <div className="mock-item"><div className="mock-dot blue"></div><div><div className="mock-label">Stop 4 &mdash; Rosewood Bay</div><div className="mock-sub">Aeration &middot; customer notified</div></div><div className="mock-badge blue">Queued</div></div>
            <div style={{ marginTop: '16px', background: 'rgba(255,255,255,.07)', borderRadius: '8px', padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ color: 'var(--orange)', fontSize: '15px', fontWeight: 700 }}>Tap done. Everything else follows.</div>
              <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '12px', marginTop: '4px' }}>Office updated, application logged, customer alerted.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CUSTOMER APP ═══ */}
      <section id="customer-app" className="dark-section">
        <div className="centered" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <span className="section-label">The Customer App</span>
          <h2 className="section-title">Your customers get their own app &mdash; and it works in Canada day one</h2>
          <p className="section-sub">Most software this powerful stops at you and your crew. SprayBossPro gives your customers their own branded app they install right from a secure text or email link &mdash; no app store, no password. They see their visits, pay their invoices in Canadian dollars, and pick their own alerts. In-app and email notifications work in Canada immediately, before texting registration even completes.</p>
        </div>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px 40px' }}>
          {[
            'See upcoming visits and full history — what was done, crew notes, and before/after photos',
            'View and pay invoices right from their phone — card on file, one-tap Pay Now, all in CAD',
            'Sign up for new services with live pricing figured from their own property',
            'Update their card, reschedule or skip a visit, contact you, or refer a neighbour',
            'Pick their own alerts — email or in-app from day one; text once your Canadian number is registered',
            'Live tracking on service day — customers see how many stops away the crew is',
            'Leave a review — or a private rating that sends only your happy customers to Google',
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: 'rgba(255,255,255,.82)', fontSize: '15px', lineHeight: 1.6 }}>
              <span style={{ color: 'var(--orange)', fontWeight: 800, flexShrink: 0 }}>✓</span><span>{t}</span>
            </div>
          ))}
        </div>
        <p style={{ maxWidth: '900px', margin: '34px auto 0', textAlign: 'center', color: '#fff', fontSize: '18px', fontWeight: 700, lineHeight: 1.5 }}>You decide exactly what every customer can see and do &mdash; every feature flips on or off with a single switch.</p>
      </section>

      {/* ═══ EVERYTHING ELSE ═══ */}
      <section id="features" style={{ background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <span className="section-label">The Rest of the Platform</span>
          <h2 className="section-title">Everything a Canadian lawn care company runs on</h2>
          <p className="section-sub" style={{ margin: '0 auto 56px' }}>One flat price, every feature. These all work in Canada today &mdash; no regional edition, no stripped-down version.</p>
          <div className="feat-grid">
            <div className="feat-card"><span className="feat-icon">💰</span><h3>Estimates that chase themselves</h3><p>Build an estimate in minutes, email it in CAD, and let clients accept with one click. Automated follow-ups go out if they sit on it &mdash; then one click converts accepted estimates to invoices.</p></div>
            <div className="feat-card"><span className="feat-icon">🏠</span><h3>Clients &amp; properties, unlimited</h3><p>Every property gets its own profile &mdash; square footage, coordinates, notes, photos, and full service history. No per-client charges at 50 accounts or 5,000.</p></div>
            <div className="feat-card"><span className="feat-icon">🔔</span><h3>Automated alerts</h3><p>Scheduled, on-the-way, completed, rescheduled, review requests, payment reminders &mdash; each with its own email and in-app switch, and text once your Canadian number is live.</p></div>
            <div className="feat-card"><span className="feat-icon">⚗️</span><h3>Daily mix calculator</h3><p>Every morning, see how much of each mix the day&apos;s route needs &mdash; per product, tank math done &mdash; before anyone loads a truck.</p></div>
            <div className="feat-card"><span className="feat-icon">👑</span><h3>Roles for the whole team</h3><p>Owner, manager, office, technician, and mobile-only roles. Your office runs billing, your crew sees stops, and nobody deletes a client by accident.</p></div>
            <div className="feat-card"><span className="feat-icon">📦</span><h3>Package &amp; prepay plans</h3><p>Season packages with treatments tracked automatically and renewal reminders before they lapse &mdash; the backbone of a prepay spring.</p></div>
            <div className="feat-card"><span className="feat-icon">🏷️</span><h3>Sales tax &amp; discounts</h3><p>Set your tax rates once and every invoice calculates and tracks tax automatically. Percentage or flat discounts on any estimate.</p></div>
            <div className="feat-card"><span className="feat-icon">📊</span><h3>Dashboard &amp; reports</h3><p>Today&apos;s revenue, completed stops, money owed, and more the moment you log in &mdash; custom stat cards show what matters to you.</p></div>
            <div className="feat-card"><span className="feat-icon">🚛</span><h3>Trucks &amp; hours</h3><p>Assign vehicles to routes, track employee hours, and pull payroll-ready reports without a separate system.</p></div>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" style={{ background: 'var(--light-bg)' }}>
        <div className="centered" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <span className="section-label">Simple Pricing</span>
          <h2 className="section-title">One price you can read in one screen</h2>
          <p className="section-sub">We have been the customer &mdash; paying $500 to $700 a month for software where every feature was an add-on and every user cost more. SprayBossPro is priced the way we always wished software was priced: flat, honest, and stated in full on the landing page.</p>
        </div>
        <div className="price-card">
          <div className="price-badge">Every Feature Included</div>
          <div className="price-amount"><sup>$</sup>59<span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--muted)' }}>/month</span></div>
          <div className="price-period">from $59 USD per month &middot; 14-day free trial &middot; no credit card to start</div>
          <ul className="price-includes">
            <li>CAD invoicing &amp; card-on-file billing</li>
            <li>Circle-map routing &amp; dispatch</li>
            <li>Recurring program scheduling</li>
            <li>Application record-keeping</li>
            <li>Crew app for your technicians</li>
            <li>Branded customer app</li>
            <li>Estimates with auto follow-up</li>
            <li>Unlimited clients &amp; properties</li>
            <li>Automated alerts &amp; reminders</li>
            <li>Dashboard, reports &amp; roles</li>
          </ul>
          <button className="price-btn price-btn-primary" onClick={(e) => openTrial(e.currentTarget)}>Start Your 14-Day Free Trial</button>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '18px', textAlign: 'center', lineHeight: 1.6 }}>Straight answer for Canadian owners: the subscription bills in US dollars and your bank converts. Your customers, though, are always billed in CAD. Larger plans ($89 and $199 USD) only change size &mdash; users, trucks, texts &mdash; never features.</p>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px', marginTop: '32px' }}>No contracts. Cancel anytime. No hidden fees &mdash; ever.</p>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ background: '#fff' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <span className="section-label">Canada FAQ</span>
            <h2 className="section-title">Straight answers for Canadian lawn care companies</h2>
          </div>
          <div style={{ marginTop: '48px' }}>
            {faqs.map(f => (
              <div key={f.q} style={{ borderBottom: '1px solid var(--border)', padding: '24px 0' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px', lineHeight: 1.4 }}>{f.q}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '40px', color: 'var(--muted)', fontSize: '15px', lineHeight: 1.7 }}>SprayBossPro runs lawn care alongside pest control, mosquito, and every other spray service from one platform &mdash; <a href="/" style={{ color: 'var(--orange)', fontWeight: 600 }}>see the full platform overview</a> or the <a href="/pest-control-software-canada" style={{ color: 'var(--orange)', fontWeight: 600 }}>Canadian pest control page</a>.</p>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <div className="cta-band">
        <h2>Run Your Canadian Lawn Care Business<br />on Software That Actually Bills in CAD.</h2>
        <p>The demo above is the same software you get. Try it free for 14 days &mdash; no credit card, no sales call, and your customers billed in Canadian dollars from the first invoice.</p>
        <div className="hero-btns" style={{ marginBottom: 0 }}>
          <button className="btn-primary" style={{ fontSize: '17px', padding: '18px 44px' }} onClick={(e) => openTrial(e.currentTarget)}>Start Your 14-Day Free Trial</button>
          <div className="hero-trust">No credit card required &nbsp;&middot;&nbsp; 14-day free trial &nbsp;&middot;&nbsp; <b>from $59/mo</b> after</div>
        </div>
      </div>

      <SignupModal />
    </>
  );
}
