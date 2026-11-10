import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/metadata";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
  robots: { index: false, follow: true },
};

export default function About() {
  permanentRedirect("/#about");
}
