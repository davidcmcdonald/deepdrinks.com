import podcastSnapshot from "../data/podcast-ids.json";

export type PodcastCatalog = { apple: Record<number, string>; spotify: Record<number, string> };
export const savedPodcasts: PodcastCatalog = podcastSnapshot;

export type Video = {
  id: string;
  title: string;
  description?: string;
  published: string;
  // YouTube's public tab can still supply a relative label when its watch page is unavailable.
  publishedLabel?: string;
  sortTime?: number;
  duration: string;
  episodeNumber: number | null;
  guest: string | null;
  thumbnail: string;
  liveNow: boolean;
  podcastIds?: { apple?: string; spotify?: string };
};

export function withPodcasts(video: Video, catalog = savedPodcasts): Video {
  if (!video.episodeNumber || video.liveNow) return video;
  const apple = catalog.apple[video.episodeNumber] ?? savedPodcasts.apple[video.episodeNumber];
  const spotify = catalog.spotify[video.episodeNumber] ?? savedPodcasts.spotify[video.episodeNumber];
  return apple || spotify ? { ...video, podcastIds: { apple, spotify } } : video;
}

export type VideoKind = "episodes" | "clips";

export type VideoLibrary = Record<VideoKind, Video[]> & {
  saved: Record<VideoKind, boolean>;
  archiveAdditions?: Video[];
};

export function newestFirst(videos: Video[]) {
  const unique = new Map<string, Video>();
  for (const video of videos) {
    const existing = unique.get(video.id);
    if (!existing || (!existing.liveNow && video.liveNow) || (existing.liveNow === video.liveNow && !existing.published && video.published)) {
      unique.set(video.id, video);
    }
  }
  const time = (video: Video) => Date.parse(video.published) || video.sortTime || 0;
  return [...unique.values()].sort((a, b) => Number(b.liveNow) - Number(a.liveNow) || time(b) - time(a));
}

export function videoUrl(video: Video) {
  return "https://www.youtube.com/watch?v=" + video.id;
}

const showNumber = /\bDeep Drinks(?:\s+Podcast)?\s*(?:[|:–—-]\s*)?(?:#|Ep(?:isode)?\.?\s*#?)\s*(\d+)\b/i;

export function episodeNumber(title: string) {
  const match = title.match(showNumber);
  return match ? Number(match[1]) : null;
}

export function displayTitle(video: Video) {
  let title = video.title.replace(/\s*[\s|–—-]*Deep Drinks?(?:\s+Podcast)?\s*[|:–—-]?\s*#\s*\d+(?:\s+w(?:ith|\/)?\s+David McDonald)?\s*$/i, "");
  title = title.replace(/\s*\|\s*Ep(?:isode)?\.?\s*#?\d+\s*$/i, "");
  if (video.guest) {
    const parenthetical = title.match(/\s*\(([^)]+)\)\s*$/);
    if (parenthetical?.[1].toLowerCase().includes(video.guest.toLowerCase())) {
      title = title.slice(0, parenthetical.index);
    }
    const split = title.lastIndexOf("|");
    if (split !== -1 && title.slice(split + 1).trim() === video.guest) title = title.slice(0, split);
  }
  return title.trim() || video.title;
}

const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric", month: "short", year: "numeric", timeZone: "Australia/Brisbane",
});

export function formatPublished(iso: string) {
  return dateFormatter.format(new Date(iso));
}
