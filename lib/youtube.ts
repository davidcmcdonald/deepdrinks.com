import { fetchAtom } from "./playlist";
import { episodeNumber, newestFirst, withPodcasts, type PodcastCatalog, type Video, type VideoLibrary } from "./videos";
import { refreshPodcasts } from "./podcast-catalog";
import { guests, latest, snapshotVideos } from "./video-snapshot";
import { channels, confirmedLandscape, durationLabel, readOfficial, tabs, type Groups, type Source } from "./youtube-api";

type Listing = { id: string; title: string; live: boolean; duration?: string; publishedLabel?: string; sortTime?: number; mixedFormats?: boolean };
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
  const match = html.match(new RegExp("\\b" + variable + "\\s*=\\s*(\\{[\\s\\S]*?\\});\\s*(?:</script>|var\\s)"));
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
    if (node.shortsLockupViewModel || node.reelItemRenderer || node.reelShelfRenderer) return;
    const item = node.lockupViewModel ?? node.playlistVideoRenderer ?? node.videoRenderer;
    if (!item) {
      Object.values(node).forEach(scan);
      return;
    }
    if (item.contentType && item.contentType !== "LOCKUP_CONTENT_TYPE_VIDEO") return;
    const destination = item.rendererContext?.commandContext?.onTap?.innertubeCommand ?? item.navigationEndpoint;
    if (destination?.reelWatchEndpoint || destination?.commandMetadata?.webCommandMetadata?.url?.startsWith("/shorts/")) return;
    const id = item.contentId ?? item.videoId;
    const title = item.metadata?.lockupMetadataViewModel?.title?.content ?? item.overlayMetadata?.primaryText?.content
      ?? item.title?.simpleText ?? item.headline?.simpleText ?? item.title?.runs?.map((run: YtObject) => run.text).join("");
    if (typeof id !== "string" || !/^[\w-]{11}$/.test(id) || typeof title !== "string") return;
    recognised = true;
    const badges = JSON.stringify([item.badges, item.contentImage?.thumbnailViewModel?.overlays, item.thumbnailOverlays, item.metadata?.lockupMetadataViewModel?.metadata]);
    if (item.isPlayable === false || item.upcomingEventData || /UPCOMING|MEMBERS_ONLY|SHORTS|"text":"Upcoming"|Members only/i.test(badges)) return;
    if ((source === "uploads" || source === "streams") && !episodeNumber(title)) return;
    if (/^\[(Private|Deleted) video\]$/i.test(title)) return;
    const meta = item.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel;
    const parts: YtObject[] = (meta?.metadataRows ?? []).flatMap((row: YtObject) => row.metadataParts ?? []);
    const ownerId = parts.flatMap(part => part.text?.commandRuns ?? [])
      .map(run => run.onTap?.innertubeCommand?.browseEndpoint?.browseId).find(id => typeof id === "string" && id.startsWith("UC"))
      ?? item.shortBylineText?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId;
    if (ownerId && ownerId !== (source === "clips" ? channels.clips : channels.main)) return;
    const times = parts.flatMap(part => [part.accessibilityLabel, part.text?.content]);
    times.push(item.publishedTimeText?.simpleText, item.publishedTimeText?.runs?.[0]?.text);
    const publishedLabel = times.find(value => typeof value === "string" && /ago$/i.test(value));
    const duration = badges.match(/"text":"((?:\d+:){1,2}\d\d)"/)?.[1] ?? item.lengthText?.simpleText;
    rows.set(id, { id, title, duration, publishedLabel, sortTime: estimatedTime(publishedLabel), mixedFormats: source === "playlist",
      live: /BADGE_STYLE_LIVE|STYLE_TYPE_LIVE_NOW|"text":"LIVE"/i.test(badges) });
  }
  scan(tab.content);
  if (!recognised) throw new Error("No recognisable YouTube listings");
  return [...rows.values()].slice(0, 5);
}

function estimatedTime(label = "") {
  const match = label.match(/(\d[\d,]*)\s*(second|sec|s|minute|min|m|hour|hr|h|day|d|week|w|month|mo|year|yr|y)s?\s+ago/i);
  if (!match) return undefined;
  const units: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400, w: 604800, mo: 2629800, y: 31557600 };
  const unit = match[2].toLowerCase();
  return Date.now() - Number(match[1].replace(/,/g, "")) * units[unit.startsWith("mo") ? "mo" : unit[0]] * 1000;
}

function couldBeShort(duration: string) {
  const seconds = duration.split(":").reduce((total, field) => total * 60 + Number(field), 0);
  return seconds <= 180;
}

async function readWatch(id: string, channelId: string): Promise<Video | null> {
  const data = await readPage("https://www.youtube.com/watch?v=" + id, "ytInitialPlayerResponse");
  const details = data.videoDetails;
  const meta = data.microformat?.playerMicroformatRenderer;
  const broadcast = meta?.liveBroadcastDetails;
  const liveNow = broadcast?.isLiveNow === true;
  const playback = data.playabilityStatus;
  if (!playback || /not a bot|try again later|temporarily unavailable/i.test(playback.reason ?? "")) {
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
    episodeNumber: ep, guest: ep ? guests.get(ep) ?? null : null, liveNow,
    thumbnail: thumbnail || "https://i.ytimg.com/vi/" + id + "/mqdefault.jpg",
  };
}

async function readSource(source: Source, known: Map<string, Video>, watching: Map<string, Promise<Video | null>>) {
  const url = tabs[source];
  let candidates: Listing[];
  try {
    try {
      const data = await readPage(url + (url.includes("?") ? "&" : "?") + "hl=en", "ytInitialData");
      candidates = listings(data, source);
    } catch (tabError) {
      if (source === "playlist") throw tabError;
      const channel = source === "clips" ? channels.clips : channels.main;
      const listId = (source === "streams" ? "UULV" : "UULF") + channel.slice(2);
      const data = await readPage("https://www.youtube.com/playlist?hl=en&list=" + listId, "ytInitialData");
      candidates = listings(data, source);
    }
  } catch (error) {
    // A channel-wide Atom feed may expose Shorts using regular watch URLs.
    if (source === "clips") throw error;
    const query = source === "playlist"
      ? new URLSearchParams({ playlist_id: new URL(url).searchParams.get("list")! })
      : new URLSearchParams({ channel_id: channels.main });
    const entries = await fetchAtom(query);
    candidates = entries.filter(entry => !entry.short && (source === "playlist" || Boolean(episodeNumber(entry.title))))
      .slice(0, 5).map(entry => ({ ...entry, live: false, mixedFormats: true }));
  }
  const results = await Promise.allSettled(candidates.map(async row => {
    const previous = known.get(row.id);
    if (previous?.published && !previous.liveNow && !row.live) return { ...previous, title: row.title };
    if (row.mixedFormats && !row.live && row.duration && couldBeShort(row.duration) && !await confirmedLandscape(row.id)) return null;
    if (!watching.has(row.id)) watching.set(row.id, readWatch(row.id, source === "clips" ? channels.clips : channels.main));
    try {
      const video = await watching.get(row.id)!;
      if (video && row.mixedFormats && !row.duration && !video.liveNow && couldBeShort(video.duration) && !await confirmedLandscape(row.id)) return null;
      return video;
    } catch (error) {
      // The public tab can announce a new upload even when watch metadata is bot-gated.
      // A relative YouTube label may be used for ordering, never as an exact upload date.
      if (!row.live && (!row.duration || !row.publishedLabel)) throw error;
      const number = episodeNumber(row.title) ?? previous?.episodeNumber ?? null;
      return { id: row.id, title: row.title, published: "", publishedLabel: row.publishedLabel, sortTime: row.sortTime,
        duration: row.duration || "", episodeNumber: number, guest: (number && guests.get(number)) || null,
        liveNow: row.live, thumbnail: previous?.thumbnail || "https://i.ytimg.com/vi/" + row.id + "/hqdefault.jpg" };
    }
  }));
  const videos = results.flatMap(result => result.status === "fulfilled" && result.value ? [result.value] : []);
  if (!videos.length && results.some(result => result.status === "rejected")) throw new Error("YouTube details unavailable");
  return videos;
}

export const REFRESH_MS = 5 * 60 * 1000;
export type FeedState = { checkedAt: number; groups: Groups; failed: Source[]; podcasts?: PodcastCatalog; archiveAdditions?: Video[] };
const bundledEpisodeIds = new Set(snapshotVideos.episodes.map(video => video.id));

export async function refreshFeeds(previous?: FeedState, apiKey?: string): Promise<FeedState> {
  const names = Object.keys(tabs) as Source[];
  const known = new Map<string, Video>();
  const historic = [...Object.values(snapshotVideos).flat(), ...Object.values(previous?.groups ?? {}).flat()];
  for (const video of historic) known.set(video.id, video);
  const official: Groups = apiKey ? await readOfficial(apiKey, known).catch(() => ({})) : {};
  const watching = new Map<string, Promise<Video | null>>();
  const results = await Promise.allSettled(names.map(name => official[name] ?? readSource(name, known, watching)));
  const groups: Groups = { ...previous?.groups };
  const failed: Source[] = [];
  names.forEach((name, index) => {
    const result = results[index];
    if (result.status === "fulfilled") groups[name] = result.value;
    else failed.push(name);
  });
  // Keep newly discovered episodes in the archive after they leave the homepage's latest three.
  const archiveAdditions = newestFirst([
    ...(groups.playlist ?? []), ...(groups.uploads ?? []), ...(groups.streams ?? []), ...(previous?.archiveAdditions ?? []),
  ].filter(video => !video.liveNow && !bundledEpisodeIds.has(video.id)));
  const state: FeedState = { groups, failed, archiveAdditions, checkedAt: Date.now(), podcasts: previous?.podcasts };
  state.podcasts = await refreshPodcasts([...videoLibrary(state).episodes, ...archiveAdditions], state.podcasts);
  return state;
}

export function videoLibrary(state: FeedState): VideoLibrary {
  function from(source: Source) {
    const videos = state.groups[source] ?? (source === "playlist" ? snapshotVideos.episodes : source === "clips" ? snapshotVideos.clips : []);
    return state.failed.includes(source) ? videos.map(video => ({ ...video, liveNow: false })) : videos;
  }
  return {
    episodes: latest([...from("playlist"), ...from("uploads"), ...from("streams")]).map(video => withPodcasts(video, state.podcasts)),
    clips: latest(from("clips")),
    archiveAdditions: state.archiveAdditions?.map(video => withPodcasts(video, state.podcasts)),
    saved: { episodes: (["playlist", "uploads", "streams"] as Source[]).every(name => state.failed.includes(name)), clips: state.failed.includes("clips") },
  };
}
