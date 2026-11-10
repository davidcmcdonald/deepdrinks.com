"use client";

import { useEffect, useRef, useState } from "react";
import Glyph from "./Glyph";

export default function InterviewPlayer({ id, title, posterAlt }: { id: string; title: string; posterAlt: string }) {
  const [playing, setPlaying] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (playing) frame.current?.focus({ preventScroll: true });
  }, [playing]);

  return (
    <div className="interview-screen">
      {playing ? (
        <iframe ref={frame} src={"https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&playsinline=1&rel=0"}
          title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      ) : (
        <button type="button" className="interview-poster" aria-label={"Play " + title} onClick={() => setPlaying(true)}>
          <img src={"/images/interviews/" + id + ".webp"} width={720} height={405} alt={posterAlt} loading="lazy" />
          <span className="interview-play"><Glyph name="play" /></span>
        </button>
      )}
    </div>
  );
}
