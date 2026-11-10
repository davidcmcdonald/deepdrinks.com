import type { MetadataRoute } from "next";
import { SITE } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about/david", "/about/david/headshots", "/support", "/contact", "/recommended-reading", "/equipment", "/disclaimer"].map(path => ({
    url: SITE.url + (path || "/"),
    changeFrequency: path === "" ? "hourly" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
