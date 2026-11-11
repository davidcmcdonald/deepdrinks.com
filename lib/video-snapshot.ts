import snapshot from "../data/youtube.json";
import { withPodcasts, type Video, type VideoLibrary } from "./videos";

export const snapshotVideos = snapshot;
export const guests = new Map(snapshot.episodes.flatMap(video =>
  video.episodeNumber && video.guest ? [[video.episodeNumber, video.guest] as const] : []));

export function latest(videos: Video[]) {
  const unique = new Map<string, Video>();
  for (const video of videos) {
    const existing = unique.get(video.id);
    if (!existing || (!existing.liveNow && video.liveNow) || (existing.liveNow === video.liveNow && !existing.published && video.published)) {
      unique.set(video.id, video);
    }
  }
  const time = (video: Video) => Date.parse(video.published) || video.sortTime || 0;
  return [...unique.values()].sort((a, b) => Number(b.liveNow) - Number(a.liveNow) || time(b) - time(a)).slice(0, 3);
}

export function savedLibrary(): VideoLibrary {
  return { episodes: latest(snapshot.episodes).map(video => withPodcasts(video)), clips: latest(snapshot.clips), saved: { episodes: true, clips: true } };
}
