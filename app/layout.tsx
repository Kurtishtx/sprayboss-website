import type { Metadata } from "next";
import Script from "next/script";
import Footer from "./components/Footer";
import DemoPopup from "./components/DemoPopup";
import "./globals.css";

export const metadata: Metadata = {
  title: "SprayBossPro | Lawn Care & Pest Control Software",
  description: "SprayBossPro is premium lawn care and pest control software built by people who've run real routes. Circle a map area and instantly know sq ft, stops, and chemical needs. $129/month, everything included.",
};


const structuredData = {"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://spraybosspro.com/#organization","name":"SprayBossPro","url":"https://spraybosspro.com","logo":"https://spraybosspro.com/icon.svg","description":"Lawn care and pest control software with recurring spray scheduling, map-based routing, chemical and compliance logging, automated SMS, and Stripe billing."},{"@type":"WebSite","@id":"https://spraybosspro.com/#website","url":"https://spraybosspro.com","name":"SprayBossPro","publisher":{"@id":"https://spraybosspro.com/#organization"}},{"@type":"SoftwareApplication","name":"SprayBossPro","applicationCategory":"BusinessApplication","operatingSystem":"Web, iOS, Android","description":"Lawn care and pest control software with recurring spray scheduling, map-based routing, chemical and compliance logging, automated SMS, and Stripe billing.","offers":{"@type":"Offer","price":"129","priceCurrency":"USD","description":"$129/month flat — everything included, 14-day free trial."},"publisher":{"@id":"https://spraybosspro.com/#organization"}}]};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {children}
        <DemoPopup />
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
      </body>
    </html>
  );
}
