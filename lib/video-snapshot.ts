import snapshot from "../data/youtube.json";
import { newestFirst, withPodcasts, type Video, type VideoLibrary } from "./videos";

export const snapshotVideos = snapshot;
export const guests = new Map(snapshot.episodes.flatMap(video =>
  video.episodeNumber && video.guest ? [[video.episodeNumber, video.guest] as const] : []));

export function latest(videos: Video[]) {
  return newestFirst(videos).slice(0, 3);
}

export function savedLibrary(): VideoLibrary {
  return { episodes: latest(snapshot.episodes).map(video => withPodcasts(video)), clips: latest(snapshot.clips), saved: { episodes: true, clips: true } };
}
