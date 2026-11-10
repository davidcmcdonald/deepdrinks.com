import { XMLParser } from "fast-xml-parser";

type Entry = {
  "yt:videoId"?: string;
  id?: string;
  title?: string;
  link?: { "@_href"?: string } | { "@_href"?: string }[];
};

export type AtomVideo = { id: string; title: string; short: boolean };

const parser = new XMLParser({
  ignoreAttributes: false, attributeNamePrefix: "@_", parseTagValue: false,
  isArray: (_name, path) => path === "feed.entry",
});

export async function fetchAtom(query: URLSearchParams): Promise<AtomVideo[]> {
  const res = await fetch("https://www.youtube.com/feeds/videos.xml?" + query, {
    cache: "no-store", signal: AbortSignal.timeout(4500),
  });
  if (!res.ok) throw new Error("YouTube Atom returned " + res.status);
  const { feed } = parser.parse(await res.text());
  if (!feed || !Array.isArray(feed.entry)) throw new Error("YouTube Atom has no public entries");
  return feed.entry.flatMap((entry: Entry) => {
    const id = entry["yt:videoId"] ?? entry.id?.split(":").pop();
    if (!id || !/^[\w-]{11}$/.test(id) || !entry.title) return [];
    const links = Array.isArray(entry.link) ? entry.link : [entry.link];
    return [{ id, title: entry.title, short: links.some(link => link?.["@_href"]?.includes("/shorts/")) }];
  });
}
