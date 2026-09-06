'use client';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import SignupModal from '../components/SignupModal';
import HeroDemo from '../components/HeroDemo';

/* Long-form Canada landing page for pest control — homepage-depth, built around what a
   Canadian pest operator actually runs: recurring residential programs, monthly and
   quarterly commercial accounts, a pest calendar that swings from wasps to mice, and
   customers who expect to be billed in Canadian dollars. The honest caveats (USD
   subscription, texting registered during onboarding) stay in plain sight. */

const faqs = [
  {
    q: 'Is SprayBossPro available for pest control companies in Canada?',
    a: 'Yes — Canadian pest control companies can run the full product today: scheduling, routing, customer management, application logging, estimates, and invoicing in Canadian dollars, plus the technician app and the branded customer app.',
  },
  {
    q: 'How does Canadian dollar billing work?',
    a: 'You connect your own Canadian Stripe account and set your country to Canada in Company Info. From then on, every customer charge and payment link is issued in CAD automatically. There is nothing to configure per invoice.',
  },
  {
    q: 'Can it run quarterly, monthly, and seasonal programs at the same time?',
    a: 'Yes. Every property can be on its own cycle — a quarterly residential perimeter program, a monthly commercial account, and a spring-to-fall wasp program can all run side by side. When a treatment is completed, the next one comes due at the correct interval automatically, and the waiting list shows everything that is due across all program types.',
  },
  {
    q: 'What about my subscription — is that in CAD too?',
    a: 'The subscription is billed in US dollars — from $59 USD a month, everything included. Your bank handles the conversion. We would rather tell you that on the landing page than have you discover it on a statement.',
  },
  {
    q: 'Does two-way texting work with Canadian carriers?',
    a: 'It works, but Canadian carriers require registering a Canadian sending number first — that takes some onboarding time rather than being instant. Email alerts and customer-app notifications work from day one while texting registration completes.',
  },
  {
    q: 'Does the application logging cover provincial record-keeping?',
    a: 'Every treatment is logged with product, rate, area treated, conditions, and technician, tied to the property and date, and printable for any range. It is generic record-keeping — you stay responsible for your own provincial requirements, but the records themselves are captured automatically on every stop.',
  },
  {
    q: 'Can it handle commercial pest accounts?',
    a: 'Yes. Monthly and quarterly commercial accounts are just recurring programs on a tighter cycle — set the interval, and the account comes due on schedule with its full service and application history tied to the property. Card-on-file billing charges after each visit so commercial receivables do not pile up.',
  },
  {
    q: 'Can I try it without talking to anyone?',
    a: 'Yes. The live demo on this page is the actual software connected to a loaded demo company — routes, customers, invoices, technician app. Click anything. Nobody calls you afterward.',
  },
  {
    q: 'What does it cost after the trial?',
    a: 'From $59 USD a month flat with every feature — no per-technician pricing, no feature tiers, no add-on modules. The 14-day trial needs no credit card.',
  },
];

export default function Page() {
  const openTrial = (el: HTMLElement) => { (window as any).__openSignup?.(1, el); };

  /* FAQPage structured data, built from the same FAQ array rendered below so the two can never
     drift apart — same pattern as the demo pages. */
  useEffect(() => {
    const ID = 'canada-pest-faq-ld';
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
        <div className="hero-badge">Works in Canada &middot; bills your customers in CAD</div>
        <h1>Pest Control Software<br /><span>Built to Run in Canada</span></h1>
        <p className="hero-sub" style={{ marginBottom: '30px' }}>Route technicians, schedule recurring pest programs, log every application, and bill your customers in Canadian dollars &mdash; one dashboard, one price, every feature. The demo above is the real product running live. No form between you and it.</p>
        <div className="hero-btns" style={{ marginBottom: '0' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); openTrial(e.currentTarget as HTMLElement); }} className="btn-primary">Start Your 14-Day Free Trial</a>
          <div className="hero-trust">No credit card required &nbsp;&middot;&nbsp; 14-day free trial &nbsp;&middot;&nbsp; <b>from $59/mo</b> after &nbsp;&middot;&nbsp; <b>demo needs no signup</b></div>
        </div>
        <div className="hero-stats">
          <div><div className="hero-stat-val">CAD</div><div className="hero-stat-lbl">Every Customer Charge &amp; Invoice</div></div>
          <div><div className="hero-stat-val">$59</div><div className="hero-stat-lbl">USD/Month &mdash; Every Feature</div></div>
          <div><div className="hero-stat-val">∞</div><div className="hero-stat-lbl">Program Intervals, Side by Side</div></div>
          <div><div className="hero-stat-val">0</div><div className="hero-stat-lbl">Sales Calls Required</div></div>
        </div>
      </div>

      {/* ═══ THE CANADA PROBLEM — comparison band ═══ */}
      <div className="vs-band">
        <div className="vs-inner" style={{ textAlign: 'center' }}>
          <span className="section-label">The difference</span>
          <h2 className="section-title">Pest control software that treats Canada as a market, not an edge case</h2>
          <p className="section-sub" style={{ margin: '0 auto 44px' }}>
            Plenty of US pest platforms will happily take a Canadian signup. Then the currency is
            wrong, the payment processor will not connect, and the sales rep is not sure about
            texting. Here is the same table with straight answers &mdash; caveats included.
          </p>
          <table className="vs-table">
            <thead>
              <tr>
                <th></th>
                <th className="sbp-col">SprayBossPro</th>
                <th className="other-col">Typical US pest software</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Customer billing currency</td><td className="sbp-col">Native CAD</td><td className="other-col">USD, or a workaround</td></tr>
              <tr><td>Card-on-file after each treatment</td><td className="sbp-col">Your Canadian Stripe</td><td className="other-col">US processor, if at all</td></tr>
              <tr><td>Quarterly + monthly + seasonal programs</td><td className="sbp-col">All at once</td><td className="other-col">One-size recurring</td></tr>
              <tr><td>Technician routing on Canadian streets</td><td className="sbp-col">Full Google mapping</td><td className="other-col">Varies by platform</td></tr>
              <tr><td>Subscription currency</td><td className="sbp-col">USD &mdash; stated up front</td><td className="other-col">USD &mdash; found on your statement</td></tr>
              <tr><td>Texting in Canada</td><td className="sbp-col">Set up during onboarding</td><td className="other-col">Often not addressed at all</td></tr>
              <tr><td>See the product</td><td className="sbp-col">Live demo, right now</td><td className="other-col">Book a sales call</td></tr>
            </tbody>
          </table>
          <p className="vs-note">Two honest caveats, stated here instead of hidden: the subscription bills in US dollars (your bank converts), and automated texting needs a Canadian sending number registered with carriers during onboarding.</p>
        </div>
      </div>

      {/* ═══ CAD BILLING — the differentiator, full section ═══ */}
      <section id="cad-billing">
        <div className="highlight-row">
          <div className="highlight-text">
            <span className="section-label">Canadian Dollar Billing</span>
            <h2>Every charge, every invoice, every payment link &mdash; in CAD</h2>
            <p>Set your country to Canada in Company Info &mdash; one field, once &mdash; and every invoice, card-on-file charge, and Pay Now link bills your customers in Canadian dollars through your own Canadian Stripe account. Your customers never see a US-dollar charge convert on their card, and Stripe deposits your money in CAD into your Canadian bank account.</p>
            <p style={{ marginTop: '12px' }}>For a recurring business this matters twice: the quarterly card-on-file charge that runs after every treatment is in CAD, and so is the payment link on every one-off job. Nothing to configure per invoice, no per-customer currency fiddling, no explaining conversion fees to a commercial client&apos;s bookkeeper.</p>
            <ul className="check-list">
              <li>Set Country = Canada in Company Info &mdash; that is the whole setup</li>
              <li>Card-on-file charges after each treatment run in CAD automatically</li>
              <li>Pay Now links and emailed invoices issued in Canadian dollars</li>
              <li>Your own Canadian Stripe account &mdash; payouts land in your bank in CAD</li>
              <li>Estimates, discounts, and sales tax all handled in CAD</li>
              <li>Automated payment reminders chase unpaid invoices for you</li>
              <li>Full payment history &mdash; method, date, amount &mdash; on every account</li>
            </ul>
          </div>
          <div className="highlight-visual">
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>A Real CAD Payment Page</div>
            {/* Genuine, uncropped Stripe checkout from the founder's own Canada-set company. */}
            <img src="/cad-checkout.png" alt="Stripe payment page for Hamann Lawn Care Invoice #459 charging CA$9.74 in Canadian dollars"
                 style={{ width: '100%', maxWidth: '100%', display: 'block', borderRadius: '10px', border: '1px solid rgba(255,255,255,.14)', boxShadow: '0 12px 36px rgba(0,0,0,.35)', background: '#fff' }} />
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '12px', lineHeight: 1.6, margin: '10px 0 16px', textAlign: 'center' }}>A real payment page from the platform &mdash; a Canada-set company&apos;s customer pays in Canadian dollars. (The founder&apos;s own company.)</div>
            <div className="mock-item"><div className="mock-dot green"></div><div><div className="mock-label">Quarterly Perimeter &mdash; Q3</div><div className="mock-sub">Card on file &middot; charged after treatment</div></div><div className="mock-badge green">$129.00 CAD</div></div>
            <div className="mock-item"><div className="mock-dot blue"></div><div><div className="mock-label">Commercial Account &mdash; Monthly</div><div className="mock-sub">Invoice emailed &middot; paid via link</div></div><div className="mock-badge blue">$210.00 CAD</div></div>
            <div style={{ marginTop: '16px', background: 'rgba(255,255,255,.07)', borderRadius: '8px', padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ color: 'var(--orange)', fontSize: '16px', fontWeight: 700 }}>One setting. Every charge in CAD.</div>
              <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '12px', marginTop: '4px' }}>Country = Canada in Company Info, connected to your own Canadian Stripe.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ RECURRING PEST PROGRAMS ═══ */}
      <section id="programs" style={{ background: 'var(--light-bg)' }}>
        <div className="highlight-row reverse">
          <div className="highlight-text">
            <span className="section-label">Recurring Programs</span>
            <h2>Quarterly, monthly, seasonal &mdash; every cycle running at once</h2>
            <p>A Canadian pest book is never one rhythm. Residential perimeter customers on quarterly cycles, restaurants and warehouses on monthly service, wasp and ant programs that run spring to fall, rodent work that ramps when the weather turns. SprayBossPro lets every property run its own interval &mdash; and puts everything that is due on one waiting list.</p>
            <p style={{ marginTop: '12px' }}>Complete a treatment and the next one comes due at the correct interval automatically. No spreadsheet of renewal dates, no rebooking calls, no commercial account quietly missed for six weeks.</p>
            <ul className="check-list">
              <li>Per-property recurring schedules &mdash; quarterly, monthly, or custom</li>
              <li>Waiting list shows every account due, broken out by treatment type</li>
              <li>Completed treatments re-queue themselves at the right interval</li>
              <li>Package plans track remaining treatments and flag renewals</li>
              <li>Re-service callbacks logged against the original job</li>
              <li>Full treatment history on every property back to day one</li>
              <li>Treatment types fully customizable to how your operation runs</li>
            </ul>
          </div>
          <div className="highlight-visual">
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Waiting List &mdash; By Program</div>
            <div className="mock-item"><div className="mock-dot green"></div><div><div className="mock-label">General Pest &mdash; Quarterly</div><div className="mock-sub">31 properties due</div></div><div className="mock-badge green">Schedule</div></div>
            <div className="mock-item"><div className="mock-dot blue"></div><div><div className="mock-label">Commercial &mdash; Monthly</div><div className="mock-sub">12 accounts due</div></div><div className="mock-badge blue">Schedule</div></div>
            <div className="mock-item"><div className="mock-dot orange"></div><div><div className="mock-label">Wasp &amp; Hornet &mdash; Seasonal</div><div className="mock-sub">17 properties due</div></div><div className="mock-badge">Schedule</div></div>
            <div className="mock-item"><div className="mock-dot orange"></div><div><div className="mock-label">Rodent Control</div><div className="mock-sub">9 properties due</div></div><div className="mock-badge">Schedule</div></div>
            <div style={{ marginTop: '16px', background: 'rgba(255,255,255,.07)', borderRadius: '8px', padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ color: 'var(--orange)', fontSize: '15px', fontWeight: 700 }}>Everything due. Nothing missed.</div>
              <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '12px', marginTop: '4px' }}>Schedule straight from the waiting list in one click.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TECHNICIAN ROUTING ═══ */}
      <section id="routing" className="dark-section">
        <div className="highlight-row">
          <div className="highlight-text">
            <span className="section-label">Circle-Map Routing</span>
            <h2 style={{ color: '#fff' }}>Draw a circle. Route every technician stop inside it.</h2>
            <p style={{ color: 'rgba(255,255,255,.65)' }}>Full Google mapping works across Canada, so the circle-map scheduler works here the way it works everywhere: draw a circle on the waiting-list map &mdash; a block of townhouse crescents, a commercial strip, a rural run between towns &mdash; and SprayBossPro totals every property inside it before you commit a truck.</p>
            <p style={{ color: 'rgba(255,255,255,.65)', marginTop: '12px' }}>Stops and treatment counts by type, all calculated before you schedule. One click drops everything to the dispatch board in drive order, and your technician gets the route on their phone with gate codes, unit numbers, and property notes on every stop.</p>
            <ul className="check-list" style={{ marginTop: '20px' }}>
              <li style={{ color: 'rgba(255,255,255,.75)' }}>Draw any size circle &mdash; instantly see every property due inside it</li>
              <li style={{ color: 'rgba(255,255,255,.75)' }}>Breaks out stops and counts by treatment type automatically</li>
              <li style={{ color: 'rgba(255,255,255,.75)' }}>One click schedules all selected properties to a date and technician</li>
              <li style={{ color: 'rgba(255,255,255,.75)' }}>Stops land on the dispatch board in drive order on a live map</li>
              <li style={{ color: 'rgba(255,255,255,.75)' }}>Drag to reorder &mdash; tighter routes, less windshield time, more stops per day</li>
              <li style={{ color: 'rgba(255,255,255,.75)' }}>Built for townhouse crescents and rural routes alike</li>
            </ul>
          </div>
          <div className="highlight-visual">
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Waiting List Map &mdash; Circle Selection</div>
            <div className="lasso-map">
              <div className="lasso-ring"></div>
              <div className="lasso-pins">
                {['s','u','s','s','s','u','s','s','u','s','s','s','u','s','s','u','s','s','s'].map((t, i) => (
                  <div key={i} className={`lpin ${t}`}></div>
                ))}
              </div>
            </div>
            <div className="stat-grid">
              <div className="stat-cell"><div className="stat-val">13</div><div className="stat-lbl">Stops Selected</div></div>
              <div className="stat-cell"><div className="stat-val">17</div><div className="stat-lbl">Total Treatments</div></div>
              <div className="stat-cell"><div className="stat-val">7</div><div className="stat-lbl">Quarterly Perimeter</div></div>
              <div className="stat-cell"><div className="stat-val">4</div><div className="stat-lbl">Commercial Monthly</div></div>
              <div className="stat-cell full"><div className="stat-val">Quarterly &middot; 7 &nbsp;|&nbsp; Commercial &middot; 4 &nbsp;|&nbsp; Rodent &middot; 6</div><div className="stat-lbl">Breakdown by Treatment Type</div></div>
            </div>
            <button style={{ width: '100%', marginTop: '12px', background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: '8px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Schedule These 13 Stops →</button>
            <div style={{ marginTop: '10px', textAlign: 'center', color: 'rgba(255,255,255,.35)', fontSize: '11px' }}>Drops to the dispatch board with a full route map</div>
          </div>
        </div>
      </section>

      {/* ═══ THE CANADIAN PEST YEAR ═══ */}
      <section id="season" style={{ background: 'var(--light-bg)' }}>
        <div className="centered" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <span className="section-label">The Canadian Pest Year</span>
          <h2 className="section-title">The pests change with the season. Your system should not.</h2>
          <p className="section-sub">Pest control in Canada is not one busy season &mdash; it is four different businesses wearing the same uniform. The software has to carry every program through the whole year without you rebuilding the schedule each time the work changes.</p>
        </div>
        <div className="simple-grid">
          <div className="simple-card"><div className="simple-num">01</div><h3>Spring: programs come back online</h3><p>Ant and wasp programs restart, quarterly perimeter accounts come due, and renewal estimates go out in bulk &mdash; in CAD. Customers accept online, accepted estimates convert to invoices in one click, and the waiting list fills itself.</p></div>
          <div className="simple-card"><div className="simple-num">02</div><h3>Summer: peak season, tight routes</h3><p>This is when the circle-map scheduler earns its keep &mdash; dense days, stacked neighbourhoods, techs running full routes. Card-on-file charges run after each treatment so the busiest months do not become your worst receivables months.</p></div>
          <div className="simple-card"><div className="simple-num">03</div><h3>Fall: the rodent turn</h3><p>As the weather turns, exclusion and rodent work ramps while seasonal exterior programs wind down. Different treatment types, different intervals &mdash; same waiting list, same dispatch board, no system change mid-year.</p></div>
          <div className="simple-card"><div className="simple-num">04</div><h3>Winter: commercial keeps the lights on</h3><p>Monthly commercial accounts &mdash; restaurants, warehouses, property managers &mdash; run all winter on their own cycle, with the full application history tied to each property and invoices collecting themselves in CAD. Residential programs sit ready for spring.</p></div>
        </div>
      </section>

      {/* ═══ APPLICATION RECORDS ═══ */}
      <section id="records">
        <div className="highlight-row reverse">
          <div className="highlight-text">
            <span className="section-label">Record-Keeping</span>
            <h2>Application records captured on every treatment</h2>
            <p>Provincial pesticide regulations mean Canadian applicators keep records of what went down, where, and at what rate &mdash; and a binder behind the truck seat is a bad place for that to live. SprayBossPro logs every application as your technician works: product, rate, area treated, conditions, and who applied it, tied to the property and the date.</p>
            <p style={{ marginTop: '12px' }}>It is generic record-keeping, done automatically &mdash; you stay responsible for knowing your own province&apos;s requirements, but the records themselves exist for every job, filterable and printable for any date range the moment you need them.</p>
            <ul className="check-list">
              <li>Product, rate, target pest, and area treated logged per treatment</li>
              <li>Interior and exterior treatment areas recorded separately</li>
              <li>Conditions at time of application captured with the entry</li>
              <li>Technician recorded automatically from the tech app</li>
              <li>Everything tied to the property address and date for fast lookup</li>
              <li>Filter by product, property, technician, or date range</li>
              <li>Print-ready application reports in seconds &mdash; no formatting</li>
            </ul>
          </div>
          <div className="highlight-visual">
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Application Record &mdash; Today</div>
            <div className="log-row"><div className="log-label">Product / Rate</div><div className="log-value">Perimeter insecticide &middot; label rate</div></div>
            <div className="log-row"><div className="log-label">Target / Area</div><div className="log-value">Ants &middot; exterior perimeter &middot; foundation band</div></div>
            <div className="log-row"><div className="log-label">Conditions</div><div className="log-value">Overcast &middot; 17&deg;C &middot; calm</div></div>
            <div className="log-row"><div className="log-label">Technician</div><div className="log-value">Logged automatically from the tech app</div></div>
            <div style={{ marginTop: '16px', background: 'rgba(255,255,255,.07)', borderRadius: '8px', padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ color: 'var(--orange)', fontSize: '15px', fontWeight: 700 }}>Logged as the work happens.</div>
              <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '12px', marginTop: '4px' }}>Filter and print your records for any date range.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TECHNICIAN APP ═══ */}
      <section id="tech-app" style={{ background: 'var(--light-bg)' }}>
        <div className="highlight-row">
          <div className="highlight-text">
            <span className="section-label">The Technician App</span>
            <h2>Your techs run the day from their phone</h2>
            <p>Every technician opens the app to today&apos;s route in drive order &mdash; map, stop list, gate codes, unit numbers, property notes, treatment history. They start the stop, do the treatment, log the application, and mark it complete. The office sees it instantly, and the customer&apos;s completion alert goes out on its own.</p>
            <ul className="check-list">
              <li>Today&apos;s stops in drive order, on a live map</li>
              <li>Gate codes, unit numbers, and access notes on every stop</li>
              <li>Treatment history for the property right there in the truck</li>
              <li>Log the application on the stop as the work happens</li>
              <li>Mark complete, skip, or reschedule without calling the office</li>
              <li>Photos attached to the visit &mdash; entry points, bait placements, before/after</li>
              <li>Role-based access &mdash; techs see their route, not your books</li>
            </ul>
            <p style={{ marginTop: '16px' }}>It is a web app &mdash; nothing to install from an app store, nothing to update, works on whatever phone your techs already carry.</p>
          </div>
          <div className="highlight-visual">
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Tech App &mdash; Today&apos;s Route</div>
            <div className="mock-item"><div className="mock-dot green"></div><div><div className="mock-label">Stop 1 &mdash; Riverbend Plaza</div><div className="mock-sub">Commercial monthly &middot; completed &middot; app logged</div></div><div className="mock-badge green">Done</div></div>
            <div className="mock-item"><div className="mock-dot green"></div><div><div className="mock-label">Stop 2 &mdash; Aspen Crescent</div><div className="mock-sub">Quarterly perimeter &middot; photos attached</div></div><div className="mock-badge green">Done</div></div>
            <div className="mock-item"><div className="mock-dot orange"></div><div><div className="mock-label">Stop 3 &mdash; Willow Court</div><div className="mock-sub">Wasp nest removal &middot; ladder needed &mdash; see notes</div></div><div className="mock-badge">Up Next</div></div>
            <div className="mock-item"><div className="mock-dot blue"></div><div><div className="mock-label">Stop 4 &mdash; Spruce Grove Rd.</div><div className="mock-sub">Rodent follow-up &middot; customer notified</div></div><div className="mock-badge blue">Queued</div></div>
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
          <p className="section-sub">SprayBossPro gives your customers a branded app they install straight from a secure email or text link &mdash; no app store, no password. They see their visits and treatment notes, pay invoices in Canadian dollars, and choose their own alerts. In-app and email notifications work in Canada immediately, before texting registration even completes.</p>
        </div>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px 40px' }}>
          {[
            'See upcoming visits and full history — what was treated, tech notes, and photos',
            'View and pay invoices from their phone — card on file, one-tap Pay Now, all in CAD',
            'Sign up for new services with live pricing from their own property',
            'Update their card, reschedule or skip a visit, contact you, or refer a neighbour',
            'Pick their own alerts — email or in-app from day one; text once your Canadian number is registered',
            'Live tracking on service day — customers see how many stops away the tech is',
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
          <h2 className="section-title">Everything a Canadian pest control company runs on</h2>
          <p className="section-sub" style={{ margin: '0 auto 56px' }}>One flat price, every feature. These all work in Canada today &mdash; no regional edition, no stripped-down version.</p>
          <div className="feat-grid">
            <div className="feat-card"><span className="feat-icon">💰</span><h3>Estimates that chase themselves</h3><p>Build a pest estimate in minutes, email it in CAD, and let clients accept online. Automated follow-ups go out if they sit on it &mdash; then one click converts accepted estimates to invoices.</p></div>
            <div className="feat-card"><span className="feat-icon">🏠</span><h3>Property-first records</h3><p>Every property gets its own profile &mdash; treatment history, application log, notes, photos, and GPS coordinates. Tied to the address, not just the customer name.</p></div>
            <div className="feat-card"><span className="feat-icon">🔔</span><h3>Automated alerts</h3><p>Scheduled, on-the-way, completed, rescheduled, review requests, payment reminders &mdash; each with its own email and in-app switch, and text once your Canadian number is live.</p></div>
            <div className="feat-card"><span className="feat-icon">📦</span><h3>Package &amp; program plans</h3><p>Annual and multi-treatment packages with remaining treatments tracked automatically and renewal flags before anything lapses.</p></div>
            <div className="feat-card"><span className="feat-icon">👑</span><h3>Roles for the whole team</h3><p>Owner, manager, office, technician, and mobile-only roles. Office runs billing and dispatch, techs see their routes, and nobody deletes an account by accident.</p></div>
            <div className="feat-card"><span className="feat-icon">💬</span><h3>Two-way messaging inbox</h3><p>Customer conversations live in the platform with full history by contact &mdash; not scattered across your techs&apos; personal phones.</p></div>
            <div className="feat-card"><span className="feat-icon">🏷️</span><h3>Sales tax &amp; discounts</h3><p>Set your tax rates once and every invoice calculates and tracks tax automatically. Percentage or flat discounts on any estimate.</p></div>
            <div className="feat-card"><span className="feat-icon">📊</span><h3>Dashboard &amp; reports</h3><p>Today&apos;s revenue, completed stops, outstanding invoices, and more the moment you log in &mdash; custom stat cards show what matters to you.</p></div>
            <div className="feat-card"><span className="feat-icon">🚛</span><h3>Trucks &amp; hours</h3><p>Assign vehicles to routes, track technician hours, and pull payroll-ready reports without a separate system.</p></div>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" style={{ background: 'var(--light-bg)' }}>
        <div className="centered" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <span className="section-label">Simple Pricing</span>
          <h2 className="section-title">One price you can read in one screen</h2>
          <p className="section-sub">We have been the customer &mdash; paying $500 to $700 a month for software where the compliance module, the texting, and every extra user were all separate line items. SprayBossPro is priced flat, honestly, and in full on the landing page.</p>
        </div>
        <div className="price-card">
          <div className="price-badge">Every Feature Included</div>
          <div className="price-amount"><sup>$</sup>59<span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--muted)' }}>/month</span></div>
          <div className="price-period">from $59 USD per month &middot; 14-day free trial &middot; no credit card to start</div>
          <ul className="price-includes">
            <li>CAD billing &amp; card-on-file charging</li>
            <li>Recurring program engine</li>
            <li>Circle-map routing &amp; dispatch</li>
            <li>Application record-keeping</li>
            <li>Technician app for your crew</li>
            <li>Branded customer app</li>
            <li>Estimates with auto follow-up</li>
            <li>Unlimited clients &amp; properties</li>
            <li>Automated alerts &amp; reminders</li>
            <li>Dashboard, reports &amp; roles</li>
          </ul>
          <button className="price-btn price-btn-primary" onClick={(e) => openTrial(e.currentTarget)}>Start Your 14-Day Free Trial</button>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '18px', textAlign: 'center', lineHeight: 1.6 }}>Straight answer for Canadian operators: the subscription bills in US dollars and your bank converts. Your customers, though, are always billed in CAD. Larger plans ($89 and $199 USD) only change size &mdash; users, trucks, texts &mdash; never features.</p>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px', marginTop: '32px' }}>No contracts. Cancel anytime. No hidden fees &mdash; ever.</p>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ background: '#fff' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <span className="section-label">Canada FAQ</span>
            <h2 className="section-title">Straight answers for Canadian pest control companies</h2>
          </div>
          <div style={{ marginTop: '48px' }}>
            {faqs.map(f => (
              <div key={f.q} style={{ borderBottom: '1px solid var(--border)', padding: '24px 0' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px', lineHeight: 1.4 }}>{f.q}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '40px', color: 'var(--muted)', fontSize: '15px', lineHeight: 1.7 }}>SprayBossPro runs pest control alongside lawn care, mosquito, and every other spray service from one platform &mdash; <a href="/" style={{ color: 'var(--orange)', fontWeight: 600 }}>see the full platform overview</a> or the <a href="/lawn-care-software-canada" style={{ color: 'var(--orange)', fontWeight: 600 }}>Canadian lawn care page</a>.</p>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <div className="cta-band">
        <h2>Run Your Canadian Pest Control Business<br />on Software That Actually Bills in CAD.</h2>
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
