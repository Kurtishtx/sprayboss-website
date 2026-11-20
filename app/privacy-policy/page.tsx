import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | SprayBossPro',
  description: 'How SprayBossPro protects your data: we never sell it, your customers are yours, export or delete anytime.',
};

const SECTIONS: [string, string][] = [
  [
    "Our promise, in plain English",
    "SprayBossPro is run by BossPro Enterprises. You are trusting us with your business and your customers, so here is the short version: we never sell your data or your customers' data. Your customer list is yours: we never contact, market to, or sell to your customers. We never use your data to compete with you or hand it to anyone else in your industry. You can export everything at any time, and if you leave, we delete it. The rest of this policy explains the details."
  ],
  [
    "1. Who this covers",
    "This policy covers the SprayBossPro website, the SprayBossPro software (web app), the crew mobile app, and the customer app (\"the Service\"). \"You\" means the business that signs up and its users. \"Your customers\" means the people and businesses whose information you enter into the Service."
  ],
  [
    "2. Information we collect",
    "Account information you give us: your name, business name, email, phone number and billing details. Business data you enter or create: customers, properties, schedules, estimates, invoices, payments, notes, photos, chemical and service records, and messages. Technical information: IP address, browser and device type, and basic usage logs used to keep the Service secure and working. Website visits: pages viewed and the site that referred you, used only to understand which pages are useful."
  ],
  [
    "3. How we use it",
    "Only to provide, secure, support and improve the Service for you: running your account, sending the texts, emails and alerts you set up, processing payments you ask us to process, answering support requests, and telling you about your account and important changes. We do not use your business data or your customers' data for advertising, and we do not use it to train AI models."
  ],
  [
    "4. Your customers' data belongs to you",
    "Everything you enter about your customers is your property. We process it only on your instructions, to provide the Service to you. We never contact your customers for our own purposes, never market to them, never sell or rent their information, and never share it with another business. Messages the Service sends to your customers (alerts, invoices, reminders) are sent on your behalf and only because you set them up."
  ],
  [
    "5. We never sell your data",
    "We do not sell, rent or trade personal information or business data, and we never will. We do not share it with advertisers or data brokers."
  ],
  [
    "6. Who we share it with",
    "Only the service providers we need to run the Service, and only for that purpose: hosting and database, text messaging, email delivery, maps and address lookup, payment processing, and AI voice (for the optional AI answering add-on). Each is bound to protect the data and use it only to provide its service to us. We may also disclose information if the law requires it, and we would tell you first unless the law forbids it."
  ],
  [
    "7. Who at BossPro can see your account",
    "No one at BossPro Enterprises opens your account unless you ask us for help, or we must do so to keep the Service secure or comply with the law. Access is limited to the people who need it for that task."
  ],
  [
    "8. Payments",
    "Card and bank details are handled by our payment processing partner and are never stored on our servers. We keep only what is needed to show a payment record, such as the last four digits and the amount."
  ],
  [
    "9. Text messages",
    "If you give us your phone number and agree to texts, we may text you about your account. Message and data rates may apply. Reply STOP to opt out at any time. When you use the Service to text your own customers, you are responsible for having their permission to text them."
  ],
  [
    "10. Facebook, Instagram, Google and TikTok",
    "If you connect your Facebook page, Instagram account, Google Business Profile or TikTok account, we access only what is needed to show your messages, comments, lead forms and reviews in the Service, let you reply, and publish posts you create. From TikTok we receive only your basic profile (display name and username) and permission to publish the videos and photos you choose to post. We use this information only to provide those features to you, never sell it or use it for advertising, and delete it when you disconnect the account. You can disconnect at any time in Settings > Integrations, or remove SprayBossPro from your Facebook, Google or TikTok account settings. To ask us to delete data received from Facebook, Google or TikTok, email Support@bossprohq.com; we will confirm the deletion. Our use of information received from Google APIs follows the Google API Services User Data Policy, including its Limited Use requirements."
  ],
  [
    "11. Integrations you turn on",
    "If you connect Zapier, Make or another tool, the Service sends the events you choose to the address you provide. You control what is sent and can turn it off at any time."
  ],
  [
    "12. Location (crew and customer apps)",
    "The crew app can collect device location while an employee is clocked in, so the business can see where its crews are and which stops were visited. It stops when the last employee clocks out, and it can be declined. The customer app does not collect customers' location; on a service day a customer may see an anonymous marker for the crew serving them. Location is never sold or used for advertising, and crew location records are deleted after 90 days."
  ],
  [
    "13. Security",
    "Data is encrypted in transit and at rest, stored with a SOC 2 compliant database provider, and protected by access controls. Access keys for connected accounts are kept server-side and are never shown in the browser. We keep regular backups so your data can be recovered. If we learn of a breach affecting your data, we will notify you without undue delay."
  ],
  [
    "14. Export and deletion",
    "You can export your data at any time. If you cancel, your data stays available for 90 days so you can export it, then it is deleted from our live systems; backup copies are deleted as backups age out. You can ask us to delete it sooner by emailing Support@bossprohq.com."
  ],
  [
    "15. Your rights",
    "You can access, correct, export or delete your information. Depending on where you live, you may have additional rights under laws such as the CCPA or GDPR; we honor them. Email Support@bossprohq.com and we will respond promptly. If your customer asks you about their data, we will help you respond."
  ],
  [
    "16. Cookies",
    "We use cookies and local storage to keep you signed in and remember your settings. Our websites may use advertising and analytics tags (for example Google and Meta) to measure our own ads; these never receive your business data or your customers' data."
  ],
  [
    "17. Children",
    "The Service is for businesses and is not directed at anyone under 18."
  ],
  [
    "18. Changes",
    "If we make a material change to this policy we will tell you by email or in the Service before it takes effect. We will never change it to allow selling your data."
  ],
  [
    "19. Contact",
    "BossPro Enterprises, Support@bossprohq.com. Larger companies can request a Data Protection Agreement signed by us."
  ]
];

export default function Page() {
  return (
    <main style={{ background: '#f6f7f9', padding: 'clamp(40px,7vw,80px) 16px', color: '#1f2937', fontFamily: "'Inter','Segoe UI',Arial,sans-serif" }}>
      <div style={{ maxWidth: 820, margin: '0 auto', background: '#fff', borderRadius: 14, padding: 'clamp(22px,4vw,44px)', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
        <h1 style={{ fontSize: 'clamp(28px,4vw,38px)', fontWeight: 800, margin: '0 0 6px', color: '#111827' }}>Privacy Policy</h1>
        <p style={{ color: '#6b7280', margin: '0 0 28px', fontSize: 14 }}>SprayBossPro by BossPro Enterprises &middot; Last updated October 23, 2026</p>
        {SECTIONS.map(([h, b], i) => (
          <div key={i} style={i === 0 ? { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '16px 18px', marginBottom: 26 } : { marginBottom: 24 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 8px', color: i === 0 ? '#166534' : '#111827' }}>{h}</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.75, margin: 0, color: '#374151' }}>{b}</p>
          </div>
        ))}
        <p style={{ marginTop: 32, fontSize: 14, color: '#6b7280' }}>See also our <a href="/terms" style={{ color: '#2563eb' }}>Terms of Service</a>. Larger company? <a href="mailto:Support@bossprohq.com?subject=Data%20Protection%20Agreement%20request" style={{ color: '#2563eb' }}>Request our signed Data Protection Agreement</a>.</p>
      </div>
    </main>
  );
}
