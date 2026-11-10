"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SITE } from "@/site.config";
import { videoUrl, type VideoLibrary } from "@/lib/videos";
import VideoCard from "./VideoCard";
import Clips from "./Clips";
import Glyph from "./Glyph";
import TrackLink from "./TrackLink";
import JsonLd from "./JsonLd";

const Feed = createContext<VideoLibrary | null>(null);

export default function FeedRefresh({ initial, children }: { initial: VideoLibrary; children: ReactNode }) {
  const [library, setLibrary] = useState(initial);
  useEffect(() => {
    const controller = new AbortController();
    const interval = 5 * 60 * 1000;
    let lastCheck = 0;
    let requesting = false;
    async function refreshWhenDue() {
      if (document.hidden || requesting || Date.now() - lastCheck < interval) return;
      requesting = true;
      lastCheck = Date.now();
      try {
        const response = await fetch("/api/videos", { signal: controller.signal });
        if (!response.ok) return;
        const next: VideoLibrary = await response.json();
        if (Array.isArray(next.episodes) && Array.isArray(next.clips) && next.saved) setLibrary(next);
      } catch {
        // Keep the most recently rendered feed when the visitor is offline.
      } finally {
        requesting = false;
      }
    }
    void refreshWhenDue();
    const timer = window.setInterval(refreshWhenDue, interval);
    document.addEventListener("visibilitychange", refreshWhenDue);
    return () => {
      clearInterval(timer);
      controller.abort();
      document.removeEventListener("visibilitychange", refreshWhenDue);
    };
  }, []);
  return <Feed.Provider value={library}>{children}</Feed.Provider>;
}

export function LatestVideoLink() {
  const latest = useContext(Feed)!.episodes[0];
  return (
    <TrackLink className="button primary" href={latest ? videoUrl(latest) : SITE.playlist} target="_blank" rel="noreferrer"
      event="video_click" params={{ video_id: latest?.id, list: "hero" }}>
      <Glyph name="play" /> {latest?.liveNow ? "Watch live" : latest ? "Watch latest episode" : "Watch episodes"}
    </TrackLink>
  );
}

export function HomeVideos() {
  const { episodes, clips, saved } = useContext(Feed)!;
  return (
    <>
      <JsonLd json={{
        "@context": "https://schema.org", "@type": "CollectionPage", url: SITE.url, name: "Recent Deep Drinks episodes",
        hasPart: episodes.filter(video => video.published).map(video => ({
          "@type": "VideoObject", name: video.title, description: video.description || video.title,
          thumbnailUrl: new URL(video.thumbnail, SITE.url).href, uploadDate: video.published, url: videoUrl(video),
          embedUrl: "https://www.youtube.com/embed/" + video.id,
        })),
      }} />
      <section id="episodes" className="section episodes-section shell" aria-labelledby="episodes-heading">
        <div className="section-heading">
          <div><h2 id="episodes-heading">Recent episodes<span className="heading-period">.</span></h2>
            <p>Full-length interviews with David and his guests.</p></div>
          <a href={SITE.playlist} className="text-action" target="_blank" rel="noreferrer">All episodes <Glyph name="out" /></a>
        </div>
        {saved.episodes && <p className="feed-note">Showing the last saved YouTube listings.</p>}
        <div className="video-grid">{episodes.map(video => <VideoCard key={video.id} video={video} kind="episodes" />)}</div>
        {!episodes.length && <p className="feed-note">There are no public episodes in this feed yet.</p>}
      </section>
      <Clips clips={clips} saved={saved.clips} />
    </>
  );
}
