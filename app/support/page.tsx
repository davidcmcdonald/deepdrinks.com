import type { Metadata } from "next";
import { SITE } from "@/site.config";
import Glyph from "@/components/Glyph";
import { PatreonIcon, YouTubeIcon } from "@/components/Icons";
import TrackLink from "@/components/TrackLink";

export const metadata: Metadata = { title: "Support", description: "Support the Deep Drinks podcast on Patreon or through a YouTube channel membership.", alternates: { canonical: "/support" } };

export default function Support() {
  return <section className="shell inner-page support-page">
    <a className="back-link" href="/">Deep Drinks <span>/</span></a>
    <div className="page-heading"><h1>Support Deep Drinks<span className="heading-period">.</span></h1>
      <p className="page-lead">Help David keep the conversations going. Choose a membership through Patreon or join the show on YouTube.</p>
    </div>
    <div className="support-grid">
      <article className="support-card">
        <span className="platform-mark"><PatreonIcon width="32" height="32" /></span>
        <h2>Patreon</h2>
        <p>Explore David’s supporter tiers and choose a membership that works for you.</p>
        <TrackLink className="button primary" href={SITE.socials.patreon} target="_blank" rel="noreferrer" event="support_click" params={{type:"patreon"}}>Support on Patreon <Glyph name="out" /></TrackLink>
      </article>
      <article className="support-card">
        <span className="platform-mark"><YouTubeIcon width="38" height="38" /></span>
        <h2>Channel memberships</h2>
        <p>Become a member on the Deep Drinks YouTube channel, right where you watch the show.</p>
        <TrackLink className="button secondary" href={SITE.socials.members} target="_blank" rel="noreferrer" event="support_click" params={{type:"members"}}>Join on YouTube <Glyph name="out" /></TrackLink>
      </article>
    </div>
  </section>;
}
