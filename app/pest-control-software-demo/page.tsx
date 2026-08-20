'use client';
import DemoPageTemplate, { DemoPageCopy } from '../components/DemoPageTemplate';

const copy: DemoPageCopy = {
  vertical: 'pest control',
  Vertical: 'Pest Control',
  badge: 'Live demo · nobody to talk to',
  h1a: 'The Pest Control Software Demo',
  h1b: 'That Isn’t a Sales Call',
  sub: 'It’s already running below. A full pest control company — routes, customers, chemical logs, crew app — loaded and mid-season. Scroll it, tap it, break it.',
  demoIncludes: [
    { icon: '🗺️', title: 'A real route',        body: 'Twenty stops in service order with a map, gate codes, and property notes — not three demo customers named Test.' },
    { icon: '🐜', title: 'Recurring programs',  body: 'Quarterly and monthly services on a min-day cycle, with the waiting-list map showing who is due, who is late, and by how long.' },
    { icon: '🧪', title: 'Chemical logging',    body: 'Product, EPA number, rate, and area applied recorded per stop — the record you need when the state asks for it.' },
    { icon: '📐', title: 'Circle-map pricing',  body: 'Draw a circle on a map and get square footage, stop count, and what the chemical actually costs you.' },
    { icon: '🧾', title: 'Invoices and payments', body: 'Real invoices against real properties, card-on-file billing, and the automated follow-ups when one goes unpaid.' },
    { icon: '💬', title: 'Automated texting',   body: 'The night-before alert, the “you’re next” text, the “tech has arrived” — all wired, all customer-controlled.' },
  ],
  faqs: [
    {
      q: 'Do I have to book a demo or talk to anyone?',
      a: 'No. There is no form, no calendar, and no phone number to give. The demo on this page is live software and it loads on its own. Nobody is notified that you looked at it and nobody will call you.',
    },
    {
      q: 'Is this a real product or a video walkthrough?',
      a: 'It is the real software running in your browser, connected to a demo company with real data. Anything you click actually does what it does in the paid product.',
    },
    {
      q: 'Does it handle chemical and compliance records?',
      a: 'Yes, and they are in the demo. Applications are logged per stop with product, rate, and area treated, and the chemical report pulls it back out in the format an inspector expects.',
    },
    {
      q: 'Do I need a credit card?',
      a: 'Not for the demo, and not for the 14-day free trial either. A card is only needed if you decide to keep going after the trial ends.',
    },
    {
      q: 'Can I see the crew and customer apps too?',
      a: 'Yes. The picker above the demo switches between the office dashboard, the crew app your technicians carry, and the customer app your clients get. All three are live in the demo.',
    },
    {
      q: 'What does it cost after the demo?',
      a: '$129 a month, flat, with every feature included — office software, crew app, customer app, texting, and billing. No per-user pricing and no feature tiers.',
    },
  ],
};

export default function Page() {
  return <DemoPageTemplate copy={copy} />;
}
