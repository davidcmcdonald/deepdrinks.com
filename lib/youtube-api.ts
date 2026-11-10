import { SITE } from "../site.config";
import { guests } from "./video-snapshot";
import { episodeNumber, type Video } from "./videos";

export const tabs = {
  playlist: SITE.playlist,
  uploads: SITE.youtubeChannel + "/videos",
  streams: SITE.youtubeChannel + "/streams",
  clips: SITE.clips,
};
export type Source = keyof typeof tabs;
export type Groups = Partial<Record<Source, Video[]>>;
export const channels = { main: "UCB9JcmYVd-oHcZyCNraCiug", clips: "UCGxCnL5ls8n4QvAJkrrDDXQ" };

export function durationLabel(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 1) return "";
  const mins = Math.floor(seconds / 60);
  const tail = String(seconds % 60).padStart(2, "0");
  return mins >= 60 ? Math.floor(mins / 60) + ":" + String(mins % 60).padStart(2, "0") + ":" + tail : mins + ":" + tail;
}

type ListItem = { snippet?: { title?: string; resourceId?: { videoId?: string } } };
type ApiVideo = {
  id: string;
  snippet: { title: string; channelId: string; publishedAt: string; description: string; liveBroadcastContent?: string };
  status: { privacyStatus: string; uploadStatus?: string };
  contentDetails: { duration?: string };
  liveStreamingDetails?: { actualStartTime?: string; actualEndTime?: string; scheduledStartTime?: string };
};

async function list<T>(key: string, endpoint: string, params: Record<string, string>): Promise<T[]> {
  const response = await fetch("https://www.googleapis.com/youtube/v3/" + endpoint + "?" + new URLSearchParams(params), {
    headers: { "X-Goog-Api-Key": key }, cache: "no-store", signal: AbortSignal.timeout(6000),
  });
  if (!response.ok) throw new Error("YouTube Data API returned " + response.status);
  const result = await response.json();
  if (!Array.isArray(result.items)) throw new Error("YouTube Data API omitted its items");
  return result.items;
}

async function apiCandidates(key: string, source: Source) {
  const channel = source === "clips" ? channels.clips : channels.main;
  const playlistId = source === "playlist" ? new URL(tabs.playlist).searchParams.get("list")!
    : (source === "streams" ? "UULV" : "UULF") + channel.slice(2);
  const getItems = (id: string) => list<ListItem>(key, "playlistItems", {
    part: "snippet", playlistId: id, maxResults: "50", fields: "items(snippet(title,resourceId/videoId))",
  });
  let items: ListItem[];
  let allUploads = false;
  try {
    // YouTube's Videos and Live playlists correspond to the two public channel tabs.
    items = await getItems(playlistId);
  } catch (error) {
    if (source !== "uploads" && source !== "clips") throw error;
    // The documented uploads playlist also contains Shorts. Check those candidates individually.
    items = await getItems("UU" + channel.slice(2));
    allUploads = true;
  }
  const ids = items.flatMap(({ snippet }) => {
    if (!snippet?.resourceId?.videoId || !/^[\w-]{11}$/.test(snippet.resourceId.videoId)) return [];
    if ((source === "uploads" || source === "streams") && !episodeNumber(snippet.title || "")) return [];
    return [snippet.resourceId.videoId];
  });
  return { source, ids: ids.slice(0, allUploads ? 35 : 8), allUploads };
}

function secondsFromIso(iso = "") {
  const parts = iso.match(/^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  return parts ? Number(parts[1] || 0) * 86400 + Number(parts[2] || 0) * 3600 + Number(parts[3] || 0) * 60 + Number(parts[4] || 0) : 0;
}

export async function confirmedLandscape(id: string) {
  try {
    const response = await fetch("https://www.youtube.com/shorts/" + id, {
      method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(3000),
    });
    const location = response.headers.get("location");
    if (!location || response.status < 300 || response.status >= 400) return false;
    const url = new URL(location, "https://www.youtube.com");
    return url.origin === "https://www.youtube.com" && url.pathname === "/watch" && url.searchParams.get("v") === id;
  } catch { return false; }
}

function asVideo(item: ApiVideo, source: Source, known: Map<string, Video>): Video | null {
  const { snippet, status, liveStreamingDetails: broadcast } = item;
  if (!snippet || status?.privacyStatus !== "public" || snippet.channelId !== (source === "clips" ? channels.clips : channels.main)) return null;
  if (snippet.liveBroadcastContent === "upcoming" || (broadcast?.scheduledStartTime && !broadcast.actualStartTime)) return null;
  const liveNow = snippet.liveBroadcastContent === "live" || Boolean(broadcast?.actualStartTime && !broadcast.actualEndTime);
  const published = broadcast?.actualStartTime || snippet.publishedAt;
  const millis = Date.parse(published);
  if (!Number.isFinite(millis) || millis > Date.now()) return null;
  const previous = known.get(item.id);
  const number = episodeNumber(snippet.title) || Number((snippet.title + " " + snippet.description).match(/\bEp(?:isode)?\.?\s*#?\s*(\d+)/i)?.[1]) || previous?.episodeNumber || null;
  return {
    id: item.id, title: snippet.title, description: (snippet.description || "").split(/\n\s*\n/)[0].slice(0, 500),
    thumbnail: previous?.thumbnail || "https://i.ytimg.com/vi/" + item.id + "/hqdefault.jpg",
    published: new Date(millis).toISOString(), duration: durationLabel(secondsFromIso(item.contentDetails?.duration)),
    episodeNumber: number, guest: (number && guests.get(number)) || null, liveNow,
  };
}

export async function readOfficial(key: string, known: Map<string, Video>): Promise<Groups> {
  const sources = Object.keys(tabs) as Source[];
  const candidates = (await Promise.allSettled(sources.map(source => apiCandidates(key, source))))
    .flatMap(value => value.status === "fulfilled" ? [value.value] : []);
  const ids = [...new Set(candidates.flatMap(group => group.ids))];
  const details = new Map<string, ApiVideo>();
  for (let i = 0; i < ids.length; i += 50) {
    const items = await list<ApiVideo>(key, "videos", {
      id: ids.slice(i, i + 50).join(","), part: "snippet,contentDetails,status,liveStreamingDetails",
      fields: "items(id,snippet(title,channelId,publishedAt,description,liveBroadcastContent),contentDetails/duration,status/privacyStatus,liveStreamingDetails(actualStartTime,actualEndTime,scheduledStartTime))",
    });
    items.forEach(item => details.set(item.id, item));
  }
  const groups: Groups = {};
  await Promise.all(candidates.map(async ({ source, ids: candidateIds, allUploads }) => {
    const videos: Video[] = [];
    for (const id of candidateIds) {
      const item = details.get(id);
      if (!item) continue;
      const video = asVideo(item, source, known);
      if (!video) continue;
      if ((allUploads || source === "playlist") && !known.has(id) && !video.liveNow &&
          secondsFromIso(item.contentDetails?.duration) <= 180 && !await confirmedLandscape(id)) continue;
      videos.push(video);
      if (videos.length >= 5) break;
    }
    groups[source] = videos;
  }));
  return groups;
}
