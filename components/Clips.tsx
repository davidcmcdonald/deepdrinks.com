"use client";

import { useState } from "react";
import { SITE } from "@/site.config";
import type { Video, VideoKind } from "@/lib/videos";
import VideoCard from "./VideoCard";
import Glyph from "./Glyph";

type Kind = Extract<VideoKind, "clips" | "shorts">;

export default function Clips({ clips, shorts, saved }: { clips: Video[]; shorts: Video[]; saved: Record<Kind, boolean> }) {
  const [kind, setKind] = useState<Kind>("clips");
  const items = kind === "clips" ? clips : shorts;
  return (
    <section className="section clips-section" id="clips" aria-labelledby="clips-heading">
      <div className="shell">
        <div className="section-heading">
          <div><h2 id="clips-heading">Latest clips<span className="heading-period">.</span></h2>
            <p>Highlights from the conversations.</p></div>
          <a className="text-action" href={kind === "clips" ? SITE.clips : SITE.shorts} target="_blank" rel="noreferrer">
            {kind === "clips" ? "All clips" : "All Shorts"} <Glyph name="out" />
          </a>
        </div>
        <div className="clip-toggle" role="group" aria-label="Clip format">
          <button type="button" aria-pressed={kind === "clips"} onClick={() => setKind("clips")}>Clips</button>
          <button type="button" aria-pressed={kind === "shorts"} onClick={() => setKind("shorts")}>Shorts</button>
        </div>
        {saved[kind] && <p className="feed-note">Showing the last saved YouTube listings.</p>}
        <div className="video-grid clip-grid" aria-live="polite">
          {items.map(video => <VideoCard key={video.id} video={video} kind={kind} />)}
          {!items.length && <p className="feed-note">There are no public {kind === "clips" ? "clips" : "Shorts"} in this feed yet.</p>}
        </div>
      </div>
    </section>
  );
}
