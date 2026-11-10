import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/site.config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: "%s | Deep Drinks Podcast" },
  description: SITE.description,
  authors: [{ name: "David McDonald" }],
  openGraph: { type: "website", title: SITE.title, description: SITE.description, siteName: SITE.title,
    locale: "en_AU", images: [{ url: "/images/social.jpg", width: 1200, height: 630, alt: "David McDonald in the Deep Drinks studio" }] },
  twitter: { card: "summary_large_image", images: ["/images/social.jpg"] },
  icons: { icon: "/favicon.ico", apple: "/apple-icon.png" },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU"><body>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <Suspense fallback={null}><Analytics /></Suspense>
      <JsonLd json={{ "@context": "https://schema.org", "@type": "PodcastSeries", name: SITE.title,
        url: SITE.url, image: SITE.url + SITE.logo, description: SITE.description,
        author: { "@type": "Person", name: "David McDonald" },
        sameAs: [SITE.socials.youtube, SITE.socials.spotify, SITE.socials.apple, SITE.socials.hub] }} />
      <main id="main">{children}</main>
      <Footer />
    </body></html>
  );
}
