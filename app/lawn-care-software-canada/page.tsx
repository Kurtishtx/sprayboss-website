'use client';
import DemoPageTemplate, { DemoPageCopy } from '../components/DemoPageTemplate';

const copy: DemoPageCopy = {
  vertical: 'lawn care',
  Vertical: 'Lawn Care',
  badge: 'Works in Canada · CAD invoicing built in',
  h1a: 'Lawn Care Software',
  h1b: 'That Works in Canada',
  sub: 'Most US lawn care platforms treat Canada as an afterthought. SprayBossPro invoices your customers in Canadian dollars, routes your crews on Canadian streets, and runs your whole season — Victoria Day to first frost — from one dashboard. The live demo below is real software; go click it.',
  demoIncludes: [
    { icon: '🇨🇦', title: 'CAD invoicing, native', body: 'Set your country to Canada in Company Info and every invoice, card charge, and payment link bills your customers in Canadian dollars. No USD surprises on their statements, no conversion complaints.' },
    { icon: '🗺️', title: 'Routing that knows your streets', body: 'Full Google mapping across Canada — build morning routes, draw a circle around a neighbourhood, and dispatch stops in drive order whether you run Brampton, Burnaby, or Beddington Heights.' },
    { icon: '🌱', title: 'Recurring programs for a short season', body: 'Min-day treatment cycles with a waiting-list map that shows who is due and who is slipping — when your season runs May to October, wasted weeks are wasted revenue.' },
    { icon: '🧾', title: 'Card-on-file billing', body: 'Connect your own Canadian Stripe account. Charge cards after service, send Pay Now links, and let the automated follow-ups chase unpaid invoices for you — all in CAD.' },
    { icon: '📱', title: 'Crew app and customer app', body: 'Your technicians get their stops, notes and gate codes on their phones; your customers get their own branded app for visits, invoices and payments. Both included, both work anywhere in Canada.' },
    { icon: '🧪', title: 'Application logging', body: 'Product, rate, and area treated recorded on every stop — the record-keeping backbone you need under provincial pesticide regulations, without extra paperwork at the truck.' },
  ],
  faqs: [
    {
      q: 'Does SprayBossPro actually work for Canadian lawn care companies?',
      a: 'Yes. Scheduling, routing, customer records, estimates, invoicing in Canadian dollars, the crew app and the customer app all work in Canada today. You connect your own Canadian Stripe account and your customers are billed in CAD.',
    },
    {
      q: 'Do my customers get charged in Canadian dollars?',
      a: 'Yes. Set your country to Canada on the Company Info page and every invoice charge and payment link goes out in CAD automatically. Your customers see plain Canadian dollars on their statements.',
    },
    {
      q: 'What does the subscription itself cost in Canada?',
      a: 'Plans are priced in US dollars — from $59 USD a month with every feature included, no add-ons and no per-user pricing. Your card is charged in USD and your bank converts. We say this plainly because surprise conversion is exactly the kind of thing software companies hide.',
    },
    {
      q: 'Does the automated texting work in Canada?',
      a: 'Texting in Canada requires registering a Canadian sending number with the carriers, which takes some setup — it is not flip-a-switch on day one. We help you through it during onboarding. Email alerts and the customer app notifications work everywhere immediately.',
    },
    {
      q: 'Do I have to book a demo or talk to a salesperson?',
      a: 'No. The demo on this page is the real software connected to a live demo company. Nobody is notified you looked, and nobody will call you. If you want a human, the owner personally texts new companies — the opposite arrangement of most software.',
    },
    {
      q: 'Is there a free trial?',
      a: 'Yes — 14 days, no credit card required to start. Set your country to Canada during setup and your account bills customers in CAD from the first invoice.',
    },
  ],
};

export default function Page() {
  return <DemoPageTemplate copy={copy} />;
}
