'use client';
import DemoPageTemplate, { DemoPageCopy } from '../components/DemoPageTemplate';

const copy: DemoPageCopy = {
  vertical: 'lawn care',
  Vertical: 'Lawn Care',
  badge: 'Live demo · nobody to talk to',
  h1a: 'The Lawn Care Software Demo',
  h1b: 'That Isn’t a Sales Call',
  sub: 'It’s already running below. A full lawn care company — routes, customers, invoices, crew app — loaded and mid-season. Scroll it, tap it, break it.',
  demoIncludes: [
    { icon: '🗺️', title: 'A real route',        body: 'Twenty stops in service order with a map, gate codes, and property notes — not three demo customers named Test.' },
    { icon: '🌱', title: 'Recurring programs',  body: 'Lawn treatments on a min-day cycle, with the waiting-list map showing who is due, who is late, and by how long.' },
    { icon: '📐', title: 'Circle-map pricing',  body: 'Draw a circle on a map and get square footage, stop count, and what the chemical actually costs you.' },
    { icon: '🧾', title: 'Invoices and payments', body: 'Real invoices against real properties, card-on-file billing, and the automated follow-ups when one goes unpaid.' },
    { icon: '💬', title: 'Automated texting',   body: 'The night-before alert, the “you’re next” text, the “tech has arrived” — all wired, all customer-controlled.' },
    { icon: '🧪', title: 'Chemical logging',    body: 'Product, rate, and area applied recorded per stop, because the state will eventually ask.' },
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
      q: 'Do I need a credit card?',
      a: 'Not for the demo, and not for the 14-day free trial either. A card is only needed if you decide to keep going after the trial ends.',
    },
    {
      q: 'Can I see the crew and customer apps too?',
      a: 'Yes. The picker above the demo switches between the office dashboard, the crew app your technicians carry, and the customer app your clients get. All three are live in the demo.',
    },
    {
      q: 'Will I break anything if I click around?',
      a: 'No. The demo company resets on its own, so change whatever you like. That is the point of loading it with data instead of handing you an empty system.',
    },
    {
      q: 'What does it cost after the demo?',
      a: '$59 a month, flat, with every feature included — office software, crew app, customer app, texting, and billing. No hidden add-on pricing and no feature tiers.',
    },
  ],
};

export default function Page() {
  return <DemoPageTemplate copy={copy} />;
}
