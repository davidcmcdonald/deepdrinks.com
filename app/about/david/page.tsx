import type { Metadata } from "next";
import Link from "next/link";
import Glyph from "@/components/Glyph";
import InterviewPlayer from "@/components/InterviewPlayer";
import "./profile.css";

export const metadata: Metadata = {
  title: "About David",
  description: "Meet David McDonald, host of Deep Drinks. Watch his conversations with Jubilee Dawn and Harmonic Atheist, and browse his headshots.",
  alternates: { canonical: "/about/david" },
};

const interviews = [
  { id: "U7H8xYa8iWM", anchor: "healed-ish", show: "Healed-ish with Jubilee Dawn", title: "A Bill Nye Debate Sparked My Deconstruction", detail: "David’s Story, Part 1 · Episode 69" },
  { id: "JQcMJKOzm8o", anchor: "harmonic-atheist", show: "Harmonic Atheist", title: "Deep Drinks, Deep Questions, and my Deconversion Story", detail: "An interview with David McDonald" },
];

export default function AboutDavid() {
  return <div className="shell inner-page david-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Deep Drinks</Link><span>/</span><Link href="/#about">About the show</Link></nav>
    <article className="david-story">
      <header className="david-title">
        <h1>About David<span className="heading-period">.</span></h1>
        <p className="page-lead">David McDonald is the host of Deep Drinks.</p>
        <a className="text-action" href="#interviews">Watch the interviews <Glyph name="down" /></a>
      </header>
      <div className="bio-body" lang="la">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam. Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
        <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident. Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p>
      </div>
      <aside className="profile-aside">
        <Link href="/about/david/headshots" className="headshots-teaser">
          <img src="/images/headshots/outdoors.webp" alt="David McDonald outdoors in a white shirt" width={640} height={640} />
          <span>View David’s headshots <Glyph name="right" /></span>
        </Link>
      </aside>
    </article>
    <section className="interviews-section" id="interviews" aria-labelledby="interviews-title">
      <div className="section-heading"><h2 id="interviews-title">David in conversation<span className="heading-period">.</span></h2></div>
      <div className="interview-grid">
        {interviews.map(interview => <article key={interview.id} id={interview.anchor} className="interview-card">
          <InterviewPlayer id={interview.id} title={interview.title} />
          <p className="video-meta">{interview.show}</p>
          <h3>{interview.title}</h3><p className="interview-detail">{interview.detail}</p>
          <a className="text-action" href={"https://www.youtube.com/watch?v=" + interview.id} target="_blank" rel="noreferrer">Watch on YouTube <Glyph name="out" /></a>
        </article>)}
      </div>
    </section>
  </div>;
}
