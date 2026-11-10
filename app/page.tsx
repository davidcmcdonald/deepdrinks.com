import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/site.config";
import { getVideoLibrary } from "@/lib/youtube";
import { videoUrl } from "@/lib/videos";
import VideoCard from "@/components/VideoCard";
import Clips from "@/components/Clips";
import FeedRefresh from "@/components/FeedRefresh";
import Glyph from "@/components/Glyph";
import TrackLink from "@/components/TrackLink";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = { alternates: { canonical: "/" } };
// The source lists cache independently. A fresh page can pick up newly published videos without a rebuild.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { episodes, clips, shorts, saved } = await getVideoLibrary();
  const latest = episodes[0];
  return (
    <>
      <FeedRefresh />
      <JsonLd json={{ "@context": "https://schema.org", "@type": "CollectionPage", url: SITE.url, name: "Recent Deep Drinks episodes",
        hasPart: episodes.map(video => ({ "@type": "VideoObject", name: video.title, description: video.description || video.title, thumbnailUrl: new URL(video.thumbnail, SITE.url).href,
          uploadDate: video.published, url: videoUrl(video, "episodes"), embedUrl: "https://www.youtube.com/embed/" + video.id })) }} />
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-image">
          <img src="/images/david-studio-1600.webp" srcSet="/images/david-studio-800.webp 800w, /images/david-studio-1600.webp 1600w"
            sizes="(max-width: 740px) 100vw, 66vw" fetchPriority="high" alt="David McDonald at the microphone in the Deep Drinks studio" width="1600" height="1095" />
        </div>
        <div className="shell hero-shell"><div className="hero-copy">
          <p className="host-line"><span className="signal" aria-hidden="true"><i/><i/><i/><i/><i/></span> With David McDonald</p>
          <h1 id="hero-title">Deep conversations<br/><em>over deep drinks.</em></h1>
          <p className="hero-description">Religion, philosophy, science and human rights, explored one conversation at a time.</p>
          <div className="hero-actions">
            <TrackLink className="button primary" href={latest ? videoUrl(latest, "episodes") : SITE.playlist} target="_blank" rel="noreferrer"
              event="video_click" params={{ video_id: latest?.id, list: "hero" }}>
              <Glyph name="play" /> {latest?.liveNow ? "Watch live" : latest ? "Watch latest episode" : "Watch episodes"}
            </TrackLink>
            <a href="#clips" className="hero-secondary">Explore clips <Glyph name="down" /></a>
          </div>
        </div></div>
      </section>

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

      <Clips clips={clips} shorts={shorts} saved={saved} />

      <section id="about" className="section about-section shell" aria-labelledby="about-heading">
        <div className="about-image"><Image src="/images/David-Mcdonald-of-Deep-Drinks-Podcast_Profile.jpg" alt="David McDonald" width={520} height={520} sizes="(max-width: 740px) 85vw, 32vw" /></div>
        <div className="about-copy">
          <p className="section-kicker">About the show</p>
          <h2 id="about-heading">Across the table<br/> with David.</h2>
          <p>Deep Drinks is a long-form interview podcast hosted by David McDonald. Over a favourite drink, David sits down with scholars, creators and people whose lives put the big questions into focus.</p>
          <p>The conversations move between religion, philosophy, science and human rights, with room for a guest to tell the whole story.</p>
          <div className="about-links">
            <a className="text-action" href="https://www.youtube.com/watch?v=_GkdkDvW_p4" target="_blank" rel="noreferrer">David’s story <Glyph name="out"/></a>
            <a className="text-action" href="https://www.youtube.com/watch?v=JQcMJKOzm8o" target="_blank" rel="noreferrer">Why Deep Drinks <Glyph name="out"/></a>
          </div>
          <div className="resource-links">
            <Link href="/recommended-reading"><Glyph name="book" /> Recommended reading <Glyph name="right" /></Link>
            <Link href="/equipment"><Glyph name="mic" /> Equipment I use <Glyph name="right" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
