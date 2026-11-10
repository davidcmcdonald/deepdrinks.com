"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FeedRefresh() {
  const router = useRouter();
  useEffect(() => {
    const interval = 5 * 60 * 1000;
    let lastCheck = Date.now();
    function refreshWhenDue() {
      if (!document.hidden && Date.now() - lastCheck >= interval) {
        lastCheck = Date.now();
        router.refresh();
      }
    }
    const timer = window.setInterval(refreshWhenDue, interval);
    document.addEventListener("visibilitychange", refreshWhenDue);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshWhenDue);
    };
  }, [router]);
  return null;
}
