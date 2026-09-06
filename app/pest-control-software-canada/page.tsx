'use client';
import DemoPageTemplate, { DemoPageCopy } from '../components/DemoPageTemplate';

const copy: DemoPageCopy = {
  vertical: 'pest control',
  Vertical: 'Pest Control',
  badge: 'Works in Canada · bills your customers in CAD',
  h1a: 'Pest Control Software',
  h1b: 'Built to Run in Canada',
  sub: 'Route technicians, schedule recurring pest programs, log every application, and bill your customers in Canadian dollars — one dashboard, one price, every feature. The demo below is the real product running live. No form between you and it.',
  demoIncludes: [
    { icon: '🇨🇦', title: 'Canadian dollar billing', body: 'Pick Canada as your country and every invoice, card-on-file charge, and Pay Now link bills in CAD through your own Canadian Stripe account. Your customers never see a US-dollar charge convert on their card.' },
    { icon: '🐜', title: 'Recurring pest programs', body: 'Quarterly perimeter treatments, seasonal wasp and ant programs, monthly commercial accounts — set the cycle once and the waiting-list map shows exactly who is due.' },
    { icon: '🗺️', title: 'Technician routing', body: 'Stops in drive order on a live map, with gate codes, unit numbers and property notes on the tech’s phone — built for townhouse crescents and rural routes alike.' },
    { icon: '🧪', title: 'Application records per stop', body: 'Product, rate, area treated, and conditions logged as your techs work — the paper trail provincial regulators expect, without a binder in the truck.' },
    { icon: '💬', title: 'Customer communication', body: 'Night-before notices, on-the-way alerts, and follow-ups your customers control themselves. Email and in-app notifications work in Canada immediately; texting sets up during onboarding.' },
    { icon: '🧾', title: 'Invoices that collect themselves', body: 'Card-on-file charging after service, payment links on every invoice, and automated reminders when one goes unpaid — in Canadian dollars, end to end.' },
  ],
  faqs: [
    {
      q: 'Is SprayBossPro available for pest control companies in Canada?',
      a: 'Yes — Canadian pest control companies can run the full product today: scheduling, routing, customer management, application logging, estimates, and invoicing in Canadian dollars, plus the technician app and the branded customer app.',
    },
    {
      q: 'How does Canadian dollar billing work?',
      a: 'You connect your own Canadian Stripe account and set your country to Canada in Company Info. From then on, every customer charge and payment link is issued in CAD automatically. There is nothing to configure per invoice.',
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
      q: 'Can I try it without talking to anyone?',
      a: 'Yes. The live demo on this page is the actual software connected to a loaded demo company — routes, customers, invoices, technician app. Click anything. Nobody calls you afterward.',
    },
    {
      q: 'What does it cost after the trial?',
      a: 'From $59 USD a month flat with every feature — no per-technician pricing, no feature tiers, no add-on modules. The 14-day trial needs no credit card.',
    },
  ],
};

export default function Page() {
  return <DemoPageTemplate copy={copy} />;
}
