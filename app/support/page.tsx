import { pageMetadata, pageSchema } from "@/lib/metadata";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/site.config";
import Glyph from "@/components/Glyph";
import { PatreonIcon, YouTubeIcon, PayPalIcon, CoffeeIcon } from "@/components/Icons";
import TrackLink from "@/components/TrackLink";

export const metadata = pageMetadata("/support");

const options = [
  { title: "Patreon", text: "Explore David’s supporter tiers and choose a membership that works for you.", href: SITE.socials.patreon, action: "Support on Patreon", event: "patreon", icon: PatreonIcon },
  { title: "Channel memberships", text: "Become a member on the Deep Drinks YouTube channel, right where you watch the show.", href: SITE.socials.members, action: "Join on YouTube", event: "members", icon: YouTubeIcon },
  { title: "PayPal", text: "Send David a one-off contribution in an amount you choose.", href: SITE.socials.paypal, action: "Support with PayPal", event: "paypal", icon: PayPalIcon },
  { title: "Buy Me a Coffee", text: "Enjoyed an interview? Send David a coffee and leave a note about the episode.", href: SITE.socials.coffee, action: "Buy David a coffee", event: "coffee", icon: CoffeeIcon },
];

export default function Support() {
  return <section className="shell inner-page support-page">
    <JsonLd json={pageSchema("/support")} />
    <a className="back-link" href="/">Deep Drinks <span>/</span></a>
    <div className="page-heading"><h1>Support Deep Drinks<span className="heading-period">.</span></h1>
      <p className="page-lead">Help David keep the conversations going with a membership or a one-off contribution.</p>
    </div>
    <div className="support-grid">
      {options.map(({ title, text, href, action, event, icon: Icon }) => <article className="support-card" key={event}>
        <span className="platform-mark"><Icon width={34} height={34} /></span>
        <h2>{title}</h2>
        <p>{text}</p>
        <TrackLink className="button secondary" href={href} target="_blank" rel="noreferrer" event="support_click" params={{type: event}}>
          {action} <Glyph name="out" />
        </TrackLink>
      </article>)}
    </div>
  </section>;
}
