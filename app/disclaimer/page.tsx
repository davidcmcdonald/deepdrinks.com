import { pageMetadata, pageSchema } from "@/lib/metadata";
import JsonLd from "@/components/JsonLd";

export const metadata = pageMetadata("/disclaimer");

export default function Disclaimer() {
  return <section className="shell inner-page legal">
    <JsonLd json={pageSchema("/disclaimer")} />
    <a className="back-link" href="/">Deep Drinks <span>/</span></a>
    <h1>Disclaimer<span className="heading-period">.</span></h1>
    <p className="page-lead">Deep Drinks Podcast (DDP) does not endorse the views or statements of any guest. DDP strives for deep conversations about deep topics. Some episodes discuss harmful ideologies or sensitive themes. Listener discretion is advised.</p>
  </section>;
}
