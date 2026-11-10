import { absoluteUrl, pageMetadata, studioPhoto } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/site.config";
import { savedLibrary } from "@/lib/video-snapshot";
import FeedRefresh, { HomeVideos, LatestVideoLink } from "@/components/FeedRefresh";
import Glyph from "@/components/Glyph";
import JsonLd from "@/components/JsonLd";

export const metadata = pageMetadata("/");
export default function Home() {
  return (
    <FeedRefresh initial={savedLibrary()}>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-image">
          <img src="/images/david-studio-1600.webp" srcSet="/images/david-studio-800.webp 800w, /images/david-studio-1600.webp 1600w"
            sizes="(max-width: 740px) 100vw, 66vw" fetchPriority="high" alt="David McDonald at his studio microphone, with bookshelves behind him and whisky bottles on the table." width="1600" height="1095" />
        </div>
        <div className="shell hero-shell"><div className="hero-copy">
          <p className="host-line"><span className="signal" aria-hidden="true"><i/><i/><i/><i/><i/></span> With David McDonald</p>
          <h1 id="hero-title">Deep conversations<br/><em>over deep drinks.</em></h1>
          <p className="hero-description">Religion, philosophy, science and human rights, explored one conversation at a time.</p>
          <div className="hero-actions">
            <LatestVideoLink />
            <a href="#clips" className="hero-secondary">Explore clips <Glyph name="down" /></a>
          </div>
        </div></div>
      </section>

      <HomeVideos />

      <section id="about" className="section about-section shell" aria-labelledby="about-heading">
        <div className="about-image"><Image src="/images/David-Mcdonald-of-Deep-Drinks-Podcast_Profile.jpg" alt="David McDonald in a brown jacket beneath the studio’s illuminated Deep Drinks sign." width={520} height={520} sizes="(max-width: 740px) 85vw, 32vw" /></div>
        <div className="about-copy">
          <p className="section-kicker">About the show</p>
          <h2 id="about-heading">Across the table<br/> with David.</h2>
          <p>Deep Drinks is a long-form interview podcast hosted by David McDonald. Over a favourite drink, David sits down with scholars, creators and people whose lives put the big questions into focus.</p>
          <p>The conversations move between religion, philosophy, science and human rights, with room for a guest to tell the whole story.</p>
          <div className="about-links">
            <Link className="text-action" href="/about/david">David’s story <Glyph name="right"/></Link>
            <Link className="text-action" href="/about/david#harmonic-atheist">Why Deep Drinks <Glyph name="play"/></Link>
          </div>
          <div className="resource-links">
            <Link href="/recommended-reading"><Glyph name="book" /> Recommended reading <Glyph name="right" /></Link>
            <Link href="/equipment"><Glyph name="mic" /> Equipment I use <Glyph name="right" /></Link>
          </div>
        </div>
      </section>
      <JsonLd json={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite", "@id": absoluteUrl("/#website"), name: SITE.title,
            alternateName: "Deep Drinks", url: absoluteUrl("/"), inLanguage: "en-AU",
          },
          {
            "@type": "PodcastSeries", "@id": absoluteUrl("/#podcast"), name: SITE.title,
            url: absoluteUrl("/"), description: SITE.description, image: studioPhoto.url, inLanguage: "en-AU",
            author: { "@type": "Person", "@id": absoluteUrl("/about/david#person"), name: "David McDonald", url: absoluteUrl("/about/david") },
            sameAs: [SITE.socials.apple, SITE.socials.spotify, SITE.socials.youtube],
          },
        ],
      }} />
    </FeedRefresh>
  );
}
