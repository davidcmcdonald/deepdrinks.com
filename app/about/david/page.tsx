import { absoluteUrl, pageMetadata, pageSchema, profilePhoto } from "@/lib/metadata";
import Link from "next/link";
import Glyph from "@/components/Glyph";
import InterviewPlayer from "@/components/InterviewPlayer";
import JsonLd from "@/components/JsonLd";
import "./profile.css";

export const metadata = pageMetadata("/about/david");

const interviews = [
  { id: "U7H8xYa8iWM", anchor: "healed-ish", show: "Healed-ish with Jubilee Dawn", title: "A Bill Nye Debate Sparked My Deconstruction", detail: "David’s Story, Part 1 · Episode 69", posterAlt: "David McDonald beside the Healed-ish title “David’s Story, Part 1”." },
  { id: "JQcMJKOzm8o", anchor: "harmonic-atheist", show: "Harmonic Atheist", title: "Deep Drinks, Deep Questions, and my Deconversion Story", detail: "An interview with David McDonald", posterAlt: "David McDonald beside the words “It just doesn’t make sense anymore”." },
];

export default function AboutDavid() {
  return <div className="shell inner-page david-page">
    <JsonLd json={{ ...pageSchema("/about/david", "ProfilePage"), mainEntity: {
      "@type": "Person", "@id": absoluteUrl("/about/david#person"), name: "David McDonald",
      url: absoluteUrl("/about/david"), image: profilePhoto.url, jobTitle: "Podcast host",
      description: "Former Pentecostal youth pastor and host of Deep Drinks Podcast.",
    } }} />
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Deep Drinks</Link><span>/</span><Link href="/#about">About the show</Link></nav>
    <article className="david-story">
      <header className="david-title">
        <h1>About David<span className="heading-period">.</span></h1>
        <blockquote className="bio-opening">
          <p>When Aimee and I were planning our wedding, we considered “Here Comes the Sun” for the walk down the aisle. We opted not to include it because I worried we’d be giving each other the glory that belonged to God. Years later, it was the first song I danced to with our son, Atlas. I held him and swayed, and he looked me in the eyes.</p>
        </blockquote>
        <a className="text-action" href="#interviews">Watch the interviews <Glyph name="down" /></a>
      </header>
      <div className="bio-body">
        <p>David McDonald is a former Pentecostal youth pastor and the host of <em>Deep Drinks Podcast</em>. How do you see the world, and what shaped that view? Over a drink, David puts those questions to Bible scholars, philosophers, former cult members, religious leaders, war reporters and everyday people with a story to tell. He’s especially interested in what it takes to change a belief you once felt certain about.</p>
        <p>David was still a Christian when he began researching creation and evolution as a side project. He expected the evidence to confirm his understanding of the world. As he worked through his questions, his faith slowly unravelled. Today he describes himself as a rationalist. He continues to pursue objective truth, but the evidence he’s seen no longer convinces him that God exists.</p>
        <p>David speaks openly about living with anxiety and depression. He advocates for LGBTQ rights, women’s rights, rationality, kindness and intellectual honesty, all of which he finds too often missing from Sunday services.</p>
        <p>Away from the microphone, David is Aimee’s husband, Atlas’s dad and a co-founder of Posty. He sometimes makes video games, loves to travel and considers himself a professional amateur photographer.</p>
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
          <InterviewPlayer id={interview.id} title={interview.title} posterAlt={interview.posterAlt} />
          <p className="video-meta">{interview.show}</p>
          <h3>{interview.title}</h3><p className="interview-detail">{interview.detail}</p>
          <a className="text-action" href={"https://www.youtube.com/watch?v=" + interview.id} target="_blank" rel="noreferrer">Watch on YouTube <Glyph name="out" /></a>
        </article>)}
      </div>
    </section>
  </div>;
}
