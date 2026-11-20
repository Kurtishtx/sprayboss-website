import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | SprayBossPro',
  description: 'The terms for using SprayBossPro.',
};

const SECTIONS: [string, string][] = [
  [
    "1. Agreement",
    "These Terms are an agreement between you (the business that signs up) and BossPro Enterprises (\"we\", \"us\"), which provides SprayBossPro (\"the Service\"). By creating an account or using the Service you agree to these Terms and to our Privacy Policy."
  ],
  [
    "2. Your account",
    "You must give accurate information and keep your login details secure. You are responsible for activity under your account and for the users you add. You must be at least 18 and able to enter into this agreement for your business."
  ],
  [
    "3. Free trial and billing",
    "New accounts start with a free trial. After the trial, the Service is billed monthly in advance at the price of the plan you choose, shown on our pricing page. Optional add-ons (such as extra texts or AI answering) are billed as described when you turn them on. Card processing fees are charged per transaction at the rate shown to you. Prices can change with at least 30 days' notice."
  ],
  [
    "4. Cancel anytime",
    "You can cancel at any time. Your plan stays active until the end of the period you have paid for, and we do not charge you again after you cancel. We do not give partial-month refunds unless the law requires it."
  ],
  [
    "5. Your data is yours",
    "You own all data you put into the Service, including your customers' information. You give us permission to store and process it only to provide the Service to you. We will never sell it, never contact or market to your customers, and never use it to compete with you. You can export it at any time, and our Privacy Policy explains how it is deleted when you leave."
  ],
  [
    "6. Acceptable use",
    "Do not use the Service for anything illegal, to send spam, or to send texts or emails to people who have not agreed to receive them. You are responsible for following the laws that apply to your messages (such as the TCPA and carrier rules), your business and your records. Do not try to break, overload, copy or reverse-engineer the Service, or access other accounts."
  ],
  [
    "7. Third-party services",
    "Some features use other companies' services, such as text messaging, payment processing, maps, Facebook, Instagram, Google, Zapier and Make. Your use of those features may also be subject to their terms. We are not responsible for outages or changes made by those companies."
  ],
  [
    "8. Availability and changes",
    "We work hard to keep the Service available and backed up, but we do not promise it will be uninterrupted, error-free or available at any particular time. The Service may be slow or unavailable because of maintenance, updates, bugs, outages at our hosting, texting, email, payment or map providers, internet problems, or other events outside our control. We update the Service regularly, and an update may change how a feature looks or works; we will not remove a core feature you rely on without reasonable notice. We are not responsible for losses caused by downtime, slowdowns, errors or updates, including missed or late appointments, alerts, texts, emails, invoices, payments or charges. Please keep your own copies of records you need; you can export your data at any time. If the Service is unavailable, your sole remedy is to cancel your subscription; we may choose to give a credit for the affected time."
  ],
  [
    "9. Confidentiality",
    "We keep your business information confidential and use it only to provide the Service. Anything we tell you that is marked or obviously confidential, you keep confidential too."
  ],
  [
    "10. Suspension and termination",
    "We may suspend or close an account that does not pay, breaks these Terms, or puts the Service or other customers at risk. Where reasonable we will warn you first and give you a chance to fix it and to export your data."
  ],
  [
    "11. Disclaimers",
    "The Service is provided \"as is\". To the extent the law allows, we disclaim implied warranties such as merchantability and fitness for a particular purpose. Records the Service keeps for you (for example chemical application records) are tools to help you; you remain responsible for meeting your own legal requirements."
  ],
  [
    "12. Limitation of liability",
    "To the extent the law allows, we are not liable for indirect, incidental, special or consequential damages, lost profits or revenue, lost or corrupted data, or business interruption, even if we were told they were possible. This includes claims arising from outages, downtime, updates, errors, or the failure or delay of any text, email, alert, payment or other function of the Service. Our total liability for any claim is limited to the amount you paid us in the 12 months before the claim."
  ],
  [
    "13. Indemnity",
    "You agree to cover claims brought against us that arise from your misuse of the Service, your messages to your customers, or your breach of these Terms or the law."
  ],
  [
    "14. Governing law",
    "These Terms are governed by the laws of the State of Texas, and disputes will be handled in the courts located in Tarrant County, Texas, unless the law requires otherwise."
  ],
  [
    "15. Changes to these Terms",
    "We may update these Terms. We will tell you about material changes by email or in the Service before they take effect. Continuing to use the Service after that means you accept the updated Terms."
  ],
  [
    "16. Contact",
    "BossPro Enterprises, Support@bossprohq.com."
  ]
];

export default function Page() {
  return (
    <main style={{ background: '#f6f7f9', padding: 'clamp(40px,7vw,80px) 16px', color: '#1f2937', fontFamily: "'Inter','Segoe UI',Arial,sans-serif" }}>
      <div style={{ maxWidth: 820, margin: '0 auto', background: '#fff', borderRadius: 14, padding: 'clamp(22px,4vw,44px)', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
        <h1 style={{ fontSize: 'clamp(28px,4vw,38px)', fontWeight: 800, margin: '0 0 6px', color: '#111827' }}>Terms of Service</h1>
        <p style={{ color: '#6b7280', margin: '0 0 28px', fontSize: 14 }}>SprayBossPro by BossPro Enterprises &middot; Last updated October 24, 2026</p>
        {SECTIONS.map(([h, b], i) => (
          <div key={i} style={i === 0 ? { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '16px 18px', marginBottom: 26 } : { marginBottom: 24 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 8px', color: i === 0 ? '#166534' : '#111827' }}>{h}</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.75, margin: 0, color: '#374151' }}>{b}</p>
          </div>
        ))}
        <p style={{ marginTop: 32, fontSize: 14, color: '#6b7280' }}>See also our <a href="/privacy-policy" style={{ color: '#2563eb' }}>Privacy Policy</a>. Larger company? <a href="mailto:Support@bossprohq.com?subject=Data%20Protection%20Agreement%20request" style={{ color: '#2563eb' }}>Request our signed Data Protection Agreement</a>.</p>
      </div>
    </main>
  );
}
