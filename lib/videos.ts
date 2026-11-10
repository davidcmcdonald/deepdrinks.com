export type Video = {
  id: string;
  title: string;
  description?: string;
  published: string;
  duration: string;
  episodeNumber: number | null;
  guest: string | null;
  thumbnail: string;
  liveNow: boolean;
};

export type VideoKind = "episodes" | "clips";

export type VideoLibrary = Record<VideoKind, Video[]> & {
  saved: Record<VideoKind, boolean>;
};

export function videoUrl(video: Video) {
  return "https://www.youtube.com/watch?v=" + video.id;
}

const showNumber = /\bDeep Drinks(?:\s+Podcast)?\s*(?:[|:–—-]\s*)?(?:#|Ep(?:isode)?\.?\s*#?)\s*(\d+)\b/i;

export function episodeNumber(title: string) {
  const match = title.match(showNumber);
  return match ? Number(match[1]) : null;
}

export function displayTitle(video: Video) {
  let title = video.title.replace(/\s*[\s|–—-]*Deep Drinks(?:\s+Podcast)?\s*[|:–—-]?\s*#\s*\d+\s*$/i, "");
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
