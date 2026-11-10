import { SITE } from "@/site.config";
import type { Video } from "@/lib/videos";
import VideoCard from "./VideoCard";
import Glyph from "./Glyph";

export default function Clips({ clips, saved }: { clips: Video[]; saved: boolean }) {
  return (
    <section className="section clips-section" id="clips" aria-labelledby="clips-heading">
      <div className="shell">
        <div className="section-heading">
          <div><h2 id="clips-heading">Latest clips<span className="heading-period">.</span></h2>
            <p>Highlights from the conversations.</p></div>
          <a className="text-action" href={SITE.clips} target="_blank" rel="noreferrer">
            All clips <Glyph name="out" />
          </a>
        </div>
        {saved && <p className="feed-note">Showing the last saved YouTube listings.</p>}
        <div className="video-grid clip-grid">
          {clips.map(video => <VideoCard key={video.id} video={video} kind="clips" />)}
          {!clips.length && <p className="feed-note">There are no public clips in this feed yet.</p>}
        </div>
      </div>
    </section>
  );
}
