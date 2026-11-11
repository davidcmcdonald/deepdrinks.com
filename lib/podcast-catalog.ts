import { SITE } from "../site.config";
import { savedPodcasts, type PodcastCatalog, type Video } from "./videos";

const showId = SITE.socials.apple.split("/id").at(-1)!;

// Deep Drinks prefixes its audio releases with the episode number. Release dates and titles
// can differ from YouTube, especially when older interviews are published to audio later.
function audioNumber(title: string) {
  return title.trim().match(/^#(\d+)\b/)?.[1];
}

async function listing(url: string) {
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(4500) });
  if (!response.ok) throw new Error("Podcast listing returned " + response.status);
  return response;
}

async function appleEpisodes() {
  const response = await listing("https://itunes.apple.com/lookup?id=" + showId + "&country=au&entity=podcastEpisode&limit=25");
  const { results } = await response.json() as { results: { wrapperType: string; collectionId?: number; trackId: number; trackName: string }[] };
  const ids: Record<string, string> = {};
  for (const episode of results) {
    if (episode.wrapperType !== "podcastEpisode" || String(episode.collectionId) !== showId || !Number.isSafeInteger(episode.trackId)) continue;
    const number = audioNumber(episode.trackName);
    if (number) ids[number] = String(episode.trackId);
  }
  return ids;
}

async function spotifyEpisodes() {
  const html = await (await listing(SITE.socials.spotify)).text();
  const ids: Record<string, string> = {};
  const episodeAnchor = /<a\b[^>]*?\shref="(?:https:\/\/open\.spotify\.com)?\/episode\/([a-zA-Z0-9]{22})"[^>]*>([\s\S]*?)<\/a>/gi;
  for (const [, id, label] of html.matchAll(episodeAnchor)) {
    const number = audioNumber(label.replace(/<[^>]+>/g, ""));
    if (number) ids[number] = id;
  }
  return ids;
}

export async function refreshPodcasts(episodes: Video[], previous = savedPodcasts): Promise<PodcastCatalog> {
  const numbers = episodes.flatMap(video => video.episodeNumber && !video.liveNow ? [video.episodeNumber] : []);
  async function update(ids: Record<number, string>, load: () => Promise<Record<string, string>>) {
    if (numbers.every(number => ids[number])) return ids;
    try {
      return { ...ids, ...await load() };
    } catch {
      return ids;
    }
  }
  const [apple, spotify] = await Promise.all([update(previous.apple, appleEpisodes), update(previous.spotify, spotifyEpisodes)]);
  return { apple, spotify };
}
