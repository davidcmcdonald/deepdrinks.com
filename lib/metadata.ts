import type { Metadata } from "next";
import { SITE } from "@/site.config";

export const pageDetails = {
  "/": {
    title: "Deep Drinks Podcast with David McDonald",
    description: "Watch Deep Drinks interviews and clips with David McDonald. Explore religion, philosophy, science and human rights over a drink with each guest.",
  },
  "/about/david": {
    title: "About David McDonald",
    description: "Meet David McDonald, former Pentecostal youth pastor and host of Deep Drinks. Read his story and watch his interviews with Jubilee Dawn and Harmonic Atheist.",
  },
  "/about/david/headshots": {
    title: "David McDonald Headshots",
    description: "View studio and outdoor portraits of Deep Drinks host David McDonald. Open each photograph at full size or download one of the four original JPEGs.",
  },
  "/support": {
    title: "Support the Show",
    description: "Support David McDonald’s interviews with a Patreon or YouTube membership, or make a one-off contribution through PayPal or Buy Me a Coffee.",
  },
  "/contact": {
    title: "Contact David McDonald",
    description: "Get in touch with Deep Drinks host David McDonald. Send a guest suggestion, ask about an episode or enquire about a podcast collaboration.",
  },
  "/recommended-reading": {
    title: "Recommended Reading",
    description: "Explore David McDonald’s reading list on religion, philosophy and history, including books by Deep Drinks guests. Search by title or author.",
  },
  "/equipment": {
    title: "Podcast Equipment I Use",
    description: "See the microphone, recorder, camera, lens and lighting David McDonald uses to make Deep Drinks, with links to the equipment in his studio.",
  },
  "/disclaimer": {
    title: "Listener Disclaimer",
    description: "Read the Deep Drinks listener disclaimer about guest opinions, sensitive topics and the range of perspectives discussed on the podcast.",
  },
};

export type PagePath = keyof typeof pageDetails;

export function absoluteUrl(path: string) {
  return new URL(path, SITE.url).href;
}

export function pageSchema(path: Exclude<PagePath, "/">, type = "WebPage") {
  const details = pageDetails[path];
  const trail: PagePath[] = path === "/about/david/headshots" ? ["/", "/about/david", path] : ["/", path];
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": absoluteUrl(path + "#webpage"),
    url: absoluteUrl(path),
    name: details.title,
    description: details.description,
    isPartOf: { "@id": absoluteUrl("/#website") },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: trail.map((page, i) => ({
        "@type": "ListItem", position: i + 1,
        name: page === "/" ? SITE.title : pageDetails[page].title, item: absoluteUrl(page),
      })),
    },
  };
}

export const studioPhoto = {
  url: absoluteUrl("/images/social.jpg"),
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "David McDonald at the Deep Drinks studio microphone in front of a bookshelf.",
};

export const profilePhoto = {
  url: absoluteUrl("/images/David-Mcdonald-of-Deep-Drinks-Podcast_Profile.jpg"),
  width: 1200,
  height: 1200,
  type: "image/jpeg",
  alt: "David McDonald wearing a brown jacket beneath the illuminated Deep Drinks sign.",
};

export function pageMetadata(path: PagePath): Metadata {
  const page = pageDetails[path];
  const title = path === "/" ? page.title : `${page.title} | ${SITE.title}`;
  const url = absoluteUrl(path);
  const photo = path.startsWith("/about/david") ? profilePhoto : studioPhoto;
  return {
    title: { absolute: title },
    description: page.description,
    robots: { index: true, follow: true, "max-image-preview": "large" },
    alternates: { canonical: url },
    openGraph: {
      type: path === "/about/david" ? "profile" : "website",
      siteName: SITE.title,
      locale: "en_AU",
      title,
      description: page.description,
      url,
      images: [photo],
    },
    twitter: {
      card: photo === profilePhoto ? "summary" : "summary_large_image",
      site: "@deepdrinkspod",
      title,
      description: page.description,
      images: [{ url: photo.url, alt: photo.alt }],
    },
  };
}
