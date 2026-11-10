"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debug = process.env.NODE_ENV !== "production";

  useEffect(() => {
    if (!id || typeof window === "undefined" || !window.gtag) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    window.gtag("event", "page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
      ...(debug ? { debug_mode: true } : {}),
    });
    if (debug) console.debug("[GA] page_view →", url);
  }, [id, pathname, searchParams, debug]);

  if (!id) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', {
            anonymize_ip: true,
            send_page_view: false
          });
        `}
      </Script>
    </>
  );
}
