import { unstable_cache } from "next/cache";
import snapshot from "@/data/youtube.json";
import { SITE } from "@/site.config";
import { fetchAtom } from "./playlist";
import { episodeNumber, type Video, type VideoLibrary } from "./videos";

// YouTube currently returns HTML for its public tabs even when the Atom feeds return 404.
const sources = {
  playlist: SITE.playlist,
  uploads: SITE.youtubeChannel + "/videos",
  streams: SITE.youtubeChannel + "/streams",
  clips: SITE.clips,
  shorts: SITE.shorts,
};
type Source = keyof typeof sources;
const channelIds = { main: "UCB9JcmYVd-oHcZyCNraCiug", clips: "UCGxCnL5ls8n4QvAJkrrDDXQ" };
const known = new Map<string, Video>(Object.values(snapshot).flat().map(video => [video.id, video]));
const guestByEpisode = new Map(snapshot.episodes.flatMap(v => v.guest && v.episodeNumber ? [[v.episodeNumber, v.guest] as const] : []));
type Listing = { id: string; title: string; live: boolean };
// The watch and browse pages embed different renderer trees. All data crossing out of this module is checked below.
type YtObject = Record<string, any>;

async function readPage(url: string, variable: "ytInitialData" | "ytInitialPlayerResponse"): Promise<YtObject> {
  const res = await fetch(url, {
    cache: "no-store",
    headers: { "Accept-Language": "en-US,en;q=0.9", "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(6500),
  });
  if (!res.ok) throw new Error("YouTube returned " + res.status);
  const html = await res.text();
  const match = html.match(new RegExp("\\b" + variable + "\\s*=\\s*(\\{[\\s\\S]*?\\});\\s*</script>"));
  if (!match) throw new Error("YouTube omitted " + variable);
  return JSON.parse(match[1]);
}

function listings(data: YtObject, source: Source): Listing[] {
  const browser = data.contents?.twoColumnBrowseResultsRenderer ?? data.contents?.singleColumnBrowseResultsRenderer;
  const tab = browser?.tabs?.map((entry: YtObject) => entry.tabRenderer).find((item?: YtObject) => item?.selected);
  if (!tab?.content) throw new Error("YouTube listing unavailable");

  const rows = new Map<string, Listing>();
  let recognised = false;
  function scan(node: YtObject) {
    if (!node || typeof node !== "object") return;
    const item = node.lockupViewModel ?? node.playlistVideoRenderer ?? node.videoRenderer ?? node.shortsLockupViewModel ?? node.reelItemRenderer;
    if (!item) {
      Object.values(node).forEach(scan);
      return;
    }
    if (item.contentType && item.contentType !== "LOCKUP_CONTENT_TYPE_VIDEO") return;
    const id = item.contentId ?? item.videoId ?? item.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId;
    const title = item.metadata?.lockupMetadataViewModel?.title?.content ?? item.overlayMetadata?.primaryText?.content
      ?? item.title?.simpleText ?? item.headline?.simpleText ?? item.title?.runs?.map((run: YtObject) => run.text).join("");
    if (typeof id !== "string" || !/^[\w-]{11}$/.test(id) || typeof title !== "string") return;
    recognised = true;
    const badges = JSON.stringify([item.badges, item.contentImage?.thumbnailViewModel?.overlays, item.thumbnailOverlays, item.metadata?.lockupMetadataViewModel?.metadata]);
    if (item.isPlayable === false || item.upcomingEventData || /UPCOMING|BADGE_MEMBERS_ONLY|MEMBERS_ONLY|"text":"Upcoming"|Members only/i.test(badges)) return;
    if ((source === "uploads" || source === "streams") && !episodeNumber(title)) return;
    if (/^\[(Private|Deleted) video\]$/i.test(title)) return;
    rows.set(id, { id, title, live: /BADGE_STYLE_LIVE|STYLE_TYPE_LIVE_NOW|"text":"LIVE"/i.test(badges) });
  }
  scan(tab.content);
  if (!recognised) throw new Error("No recognisable YouTube listings");
  return [...rows.values()].slice(0, 5);
}

function durationLabel(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 1) return "";
  const mins = Math.floor(seconds / 60);
  const tail = String(seconds % 60).padStart(2, "0");
  return mins >= 60 ? Math.floor(mins / 60) + ":" + String(mins % 60).padStart(2, "0") + ":" + tail : mins + ":" + tail;
}

const readWatch = unstable_cache(async (id: string, channelId: string, short: boolean): Promise<Video | null> => {
  const data = await readPage("https://www.youtube.com/watch?v=" + id, "ytInitialPlayerResponse");
  const details = data.videoDetails;
  const meta = data.microformat?.playerMicroformatRenderer;
  const broadcast = meta?.liveBroadcastDetails;
  const liveNow = broadcast?.isLiveNow === true;
  const playback = data.playabilityStatus;
  if (!playback || /confirm you.re not a bot|try again later|temporarily unavailable/i.test(playback.reason ?? "")) {
    throw new Error("YouTube playback metadata temporarily unavailable");
  }
  if (playback.status !== "OK") return null;
  if (!details || !meta) throw new Error("YouTube omitted public video metadata");
  if (details.videoId !== id || details.channelId !== channelId || details.isPrivate || details.isUpcoming || meta.isUnlisted) return null;
  if (!liveNow && broadcast && !broadcast.endTimestamp && Date.parse(broadcast.startTimestamp) > Date.now()) return null;
  const published = broadcast?.startTimestamp || meta.publishDate || meta.uploadDate;
  if (!published || !Number.isFinite(Date.parse(published)) || Date.parse(published) > Date.now()) return null;
  const title = String(details.title || "");
  const description = String(details.shortDescription || "").trim();
  const ep = episodeNumber(title) ?? (Number((title + "\n" + description)
    .match(/\b(?:Ep\.?|Episode)\s*#?\s*(\d+)\b/i)?.[1]) || null);
  const thumbnails = Array.isArray(details.thumbnail?.thumbnails) ? details.thumbnail.thumbnails : [];
  const thumbnail = thumbnails.filter((image: YtObject) => /^https:\/\/i\d*\.ytimg\.com\//.test(image.url)).at(-1)?.url;
  return {
    id, title, description: description.split(/\n\s*\n/)[0].slice(0, 500) || title,
    published: new Date(published).toISOString(), duration: durationLabel(Number(details.lengthSeconds)),
    episodeNumber: ep, guest: ep ? guestByEpisode.get(ep) ?? null : null, liveNow,
    thumbnail: short ? "https://i.ytimg.com/vi/" + id + "/frame0.jpg" : thumbnail || "https://i.ytimg.com/vi/" + id + "/mqdefault.jpg",
  };
}, ["deep-drinks-watch-v1"], { revalidate: 300 });

const readSource = unstable_cache(async (source: Source, url: string) => {
  let candidates: Listing[];
  try {
    const data = await readPage(url + (url.includes("?") ? "&" : "?") + "hl=en", "ytInitialData");
    candidates = listings(data, source);
  } catch {
    const query = source === "playlist"
      ? new URLSearchParams({ playlist_id: new URL(url).searchParams.get("list")! })
      : new URLSearchParams({ channel_id: source === "clips" ? channelIds.clips : channelIds.main });
    const entries = await fetchAtom(query);
    candidates = entries.filter(entry => {
      if (source === "shorts") return entry.short;
      if (source === "uploads" || source === "streams") return !entry.short && Boolean(episodeNumber(entry.title));
      return !entry.short;
    }).slice(0, 5).map(entry => ({ ...entry, live: false }));
  }
  const results = await Promise.allSettled(candidates.map(row => {
    const historic = known.get(row.id);
    if (historic && !historic.liveNow && !row.live) return { ...historic, title: row.title };
    return readWatch(row.id, source === "clips" ? channelIds.clips : channelIds.main, source === "shorts");
  }));
  const videos: Video[] = [];
  for (const result of results) if (result.status === "fulfilled" && result.value) videos.push(result.value);
  if (!videos.length && results.some(result => result.status === "rejected")) throw new Error("YouTube details unavailable");
  return videos;
}, ["deep-drinks-source-v1"], { revalidate: 300 });

function recent(groups: Video[][]) {
  const unique = new Map<string, Video>();
  for (const video of groups.flat()) unique.set(video.id, video);
  return [...unique.values()].sort((a, b) => Number(b.liveNow) - Number(a.liveNow) || Date.parse(b.published) - Date.parse(a.published)).slice(0, 3);
}

export async function getVideoLibrary(): Promise<VideoLibrary> {
  const names = Object.keys(sources) as Source[];
  const results = await Promise.allSettled(names.map(name => readSource(name, sources[name])));
  const groups = {} as Record<Source, Video[]>;
  const failed = new Set<Source>();
  names.forEach((name, index) => {
    const result = results[index];
    if (result.status === "fulfilled") groups[name] = result.value;
    else {
      failed.add(name);
      groups[name] = [];
    }
  });
  const saved = { episodes: failed.has("playlist") && failed.has("uploads") && failed.has("streams"), clips: failed.has("clips"), shorts: failed.has("shorts") };
  return {
    episodes: recent(saved.episodes ? [snapshot.episodes] : [groups.playlist, groups.uploads, groups.streams]),
    clips: recent([saved.clips ? snapshot.clips : groups.clips]),
    shorts: recent([saved.shorts ? snapshot.shorts : groups.shorts]),
    saved,
  };
}
