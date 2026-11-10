import { displayTitle, formatPublished, videoUrl, type Video, type VideoKind } from "@/lib/videos";
import TrackLink from "./TrackLink";
import Glyph from "./Glyph";

export default function VideoCard({ video, kind }: { video: Video; kind: VideoKind }) {
  const label = kind === "episodes" ? "Episode" : "Clip";
  const title = displayTitle(video);
  const detailsId = kind + "-" + video.id + "-details";
  return (
    <article className="video-card">
      <TrackLink className="video-link" href={videoUrl(video)} target="_blank" rel="noreferrer" event="video_click"
        params={{ video_id: video.id, title: video.title, list: kind }}
        aria-label={"Watch " + title + (video.liveNow ? " live on YouTube" : " on YouTube")}
        aria-describedby={detailsId}>
        <div className="video-art">
          <img src={video.thumbnail} alt={label + " artwork for “" + title + "”"} width={640} height={360} loading="lazy" decoding="async" />
          {video.liveNow ? <span className="runtime live">Live now</span> : video.duration && <span className="runtime">{video.duration}</span>}
          <span className="video-play"><Glyph name="play" /></span>
        </div>
        <div className="video-info">
          <div className="video-meta" id={detailsId}>
            <span>{label}{kind === "episodes" && video.episodeNumber ? " " + video.episodeNumber : ""}</span>
            <span aria-hidden="true" className="meta-dot" />
            {video.published
              ? <time dateTime={video.published}>{formatPublished(video.published)}</time>
              : <span>{video.publishedLabel || "On YouTube"}</span>}
          </div>
          <h3>{title}</h3>
          {video.guest && <p>With {video.guest}</p>}
        </div>
      </TrackLink>
    </article>
  );
}
