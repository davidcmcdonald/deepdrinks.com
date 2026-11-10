import type { MetadataRoute } from "next";
import { absoluteUrl, pageDetails } from "@/lib/metadata";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.keys(pageDetails).map(path => ({ url: absoluteUrl(path) }));
}
