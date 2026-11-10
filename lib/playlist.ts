import { XMLParser } from "fast-xml-parser";

type Entry = {
  "yt:videoId"?: string;
  id?: string;
  title?: string;
  link?: { "@_href"?: string } | { "@_href"?: string }[];
};

export type AtomVideo = { id: string; title: string; short: boolean };

const maxFeedBytes = 1024 * 1024;
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: false,
  htmlEntities: true,
  processEntities: { maxTotalExpansions: 8192, maxExpandedLength: maxFeedBytes },
  maxNestedTags: 40,
  isArray: (_name, path) => path === "feed.entry",
});

async function readFeed(response: Response) {
  if (!response.body) throw new Error("YouTube Atom returned an empty body");
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let total = 0;
  let xml = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return xml + decoder.decode();
      total += value.byteLength;
      if (total > maxFeedBytes) {
        await reader.cancel();
        throw new Error("YouTube Atom exceeded its size limit");
      }
      xml += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}

function isShortLink(href?: string) {
  if (typeof href !== "string") return false;
  try {
    const url = new URL(href, "https://www.youtube.com");
    return ["www.youtube.com", "youtube.com", "m.youtube.com"].includes(url.hostname) && url.pathname.startsWith("/shorts/");
  } catch { return false; }
}

export async function fetchAtom(query: URLSearchParams): Promise<AtomVideo[]> {
  const res = await fetch("https://www.youtube.com/feeds/videos.xml?" + query, {
    cache: "no-store", signal: AbortSignal.timeout(4500),
  });
  if (!res.ok) throw new Error("YouTube Atom returned " + res.status);
  const xml = await readFeed(res);
  // YouTube Atom uses predefined XML entities. It never needs a document type or custom entities.
  if (/<!\s*(?:DOCTYPE|ENTITY)\b/i.test(xml)) throw new Error("Unexpected declaration in YouTube Atom");
  const { feed } = parser.parse(xml, true);
  if (!Array.isArray(feed?.entry)) throw new Error("YouTube Atom has no public entries");
  const videos: AtomVideo[] = feed.entry.flatMap((entry: Entry) => {
    const id = entry?.["yt:videoId"] ?? (typeof entry?.id === "string" ? entry.id.split(":").pop() : undefined);
    if (typeof id !== "string" || !/^[\w-]{11}$/.test(id) || typeof entry?.title !== "string" || !entry.title.trim()) return [];
    const links = Array.isArray(entry.link) ? entry.link : [entry.link];
    return [{ id, title: entry.title, short: links.some(link => isShortLink(link?.["@_href"])) }];
  });
  if (!videos.length) throw new Error("YouTube Atom has no usable entries");
  return videos;
}
