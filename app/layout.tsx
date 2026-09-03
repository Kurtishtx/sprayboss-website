import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import Footer from "./components/Footer";
import "./globals.css";
import MetaPixel from './components/MetaPixel';

export const metadata: Metadata = {
  title: "SprayBossPro | Lawn Care, Pest Control & Spray Software",
  description: "SprayBossPro is premium lawn care, pest control, and spray software built by people who've run real routes. Circle a map area and instantly know sq ft, stops, and chemical needs. from $59/month, everything included.",
  /* Google's search results still show Vercel's default triangle for this domain, cached from
     before the crown existed. The files themselves have been correct for a month — /favicon.ico
     contains the crown at 16, 32 and 48px — but Google has no reason to refetch a URL it already
     has, so the stale copy just sits there.

     Versioning the URLs gives it something it has never seen. Paired with Request Indexing in
     Search Console, that is what actually breaks the cache; waiting does not. */
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/icon.png?v=2", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: "/apple-icon.png?v=2",
  },
};


const structuredData = {"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://spraybosspro.com/#organization","name":"SprayBossPro","url":"https://spraybosspro.com","logo":"https://spraybosspro.com/icon.png","description":"Lawn care, pest control, and spray software with recurring scheduling, map-based routing, chemical and compliance logging, automated SMS, and Stripe billing."},{"@type":"WebSite","@id":"https://spraybosspro.com/#website","url":"https://spraybosspro.com","name":"SprayBossPro","publisher":{"@id":"https://spraybosspro.com/#organization"}},{"@type":"SoftwareApplication","name":"SprayBossPro","applicationCategory":"BusinessApplication","operatingSystem":"Web, iOS, Android","description":"Lawn care, pest control, and spray software with recurring scheduling, map-based routing, chemical and compliance logging, automated SMS, and Stripe billing.","offers":{"@type":"Offer","price":"129","priceCurrency":"USD","description":"from $59/month — everything included, 14-day free trial."},"publisher":{"@id":"https://spraybosspro.com/#organization"}}]};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {children}
        {/* Meta Pixel — builds the retargeting audience. Inert until
            NEXT_PUBLIC_META_PIXEL_ID is set on the Vercel project. */}
        <MetaPixel />
        <Footer />
        <Script
          src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
          strategy="afterInteractive"
        />
        {/* Google tag (gtag.js) — Ads conversion tracking base */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-97QJVSZQ1M"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-97QJVSZQ1M');
            gtag('config', 'AW-994175437');`}
        </Script>
        <Analytics />
      </body>
    </html>
  );
}
