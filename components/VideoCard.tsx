import { displayTitle, formatPublished, videoUrl, type Video, type VideoKind } from "@/lib/videos";
import TrackLink from "./TrackLink";
import Glyph from "./Glyph";

export default function VideoCard({ video, kind }: { video: Video; kind: VideoKind }) {
  const label = kind === "episodes" ? "Episode" : kind === "shorts" ? "Short" : "Clip";
  return (
    <article className={"video-card " + (kind === "shorts" ? "short-card" : "")}>
      <TrackLink className="video-link" href={videoUrl(video, kind)} target="_blank" rel="noreferrer" event="video_click"
        params={{ video_id: video.id, title: video.title, list: kind }}>
        <div className="video-art">
          <img src={video.thumbnail} alt="" width={640} height={360} loading="lazy" decoding="async" />
          {video.liveNow ? <span className="runtime live">Live now</span> : video.duration && <span className="runtime">{video.duration}</span>}
          <span className="video-play"><Glyph name="play" /></span>
        </div>
        <div className="video-info">
          <div className="video-meta">
            <span>{label}{kind === "episodes" && video.episodeNumber ? " " + video.episodeNumber : ""}</span>
            <span aria-hidden="true" className="meta-dot" />
            <time dateTime={video.published}>{formatPublished(video.published)}</time>
          </div>
          <h3>{displayTitle(video)}</h3>
          {video.guest && <p>With {video.guest}</p>}
        </div>
      </TrackLink>
    </article>
  );
}
