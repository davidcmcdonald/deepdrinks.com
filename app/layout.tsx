import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { SITE } from "@/site.config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  authors: [{ name: "David McDonald", url: SITE.url + "/about/david" }],
  icons: { icon: "/favicon.ico", apple: "/apple-icon.png" },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU"><body>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <Suspense fallback={null}><Analytics /></Suspense>
      <main id="main">{children}</main>
      <Footer />
    </body></html>
  );
}
