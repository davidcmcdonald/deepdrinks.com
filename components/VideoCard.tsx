import { displayTitle, formatPublished, videoUrl, withPodcasts, type Video, type VideoKind } from "@/lib/videos";
import { SITE } from "@/site.config";
import TrackLink from "./TrackLink";
import Glyph from "./Glyph";

export default function VideoCard({ video, kind }: { video: Video; kind: VideoKind }) {
  const label = kind === "episodes" ? "Episode" : "Clip";
  const title = displayTitle(video);
  const detailsId = kind + "-" + video.id + "-details";
  // A returning visitor may still have a feed response cached before listening links were added.
  const podcasts = kind === "episodes" && (video.podcastIds ?? withPodcasts(video).podcastIds);
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
      {podcasts && <div className="episode-platforms">
        {podcasts.apple && <TrackLink href={SITE.socials.apple + "?i=" + podcasts.apple} target="_blank" rel="noreferrer"
          event="podcast_click" params={{ platform: "apple", episode: video.episodeNumber }}>
          <img src="/images/apple-podcasts-badge.svg" alt={`Listen to ${title} on Apple Podcasts`} width={113} height={36} />
        </TrackLink>}
        {podcasts.spotify && <TrackLink href={"https://open.spotify.com/episode/" + podcasts.spotify} target="_blank" rel="noreferrer"
          event="podcast_click" params={{ platform: "spotify", episode: video.episodeNumber }}>
          <img className="spotify-logo" src="/images/spotify-logo.svg" alt={`Listen to ${title} on Spotify`} width={103} height={36} />
        </TrackLink>}
      </div>}
    </article>
  );
}
