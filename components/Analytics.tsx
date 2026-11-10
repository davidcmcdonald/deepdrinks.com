"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

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
  const lastPage = useRef<string | null>(null);

  useEffect(() => {
    if (!id) return;
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", id, { send_page_view: false });
    }
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    if (lastPage.current === url) return;
    lastPage.current = url;
    window.gtag("event", "page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
      ...(debug ? { debug_mode: true } : {}),
    });
    if (debug) console.debug("[GA] page_view →", url);
  }, [id, pathname, searchParams, debug]);

  if (!id) return null;

  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />;
}
