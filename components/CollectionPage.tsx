import Image from "next/image";
import Link from "next/link";
import { amazonLink, type Collection } from "@/data/resources";
import Glyph from "./Glyph";

export default function CollectionPage({ collection, books }: { collection: Collection; books?: boolean }) {
  return <div className="shell inner-page collection-page">
    <a className="back-link" href="/">Deep Drinks <span>/</span></a>
    <header className="collection-intro">
      <div>
        <h1>{collection.title}<span className="heading-period">.</span></h1>
        <p className="page-lead">{collection.intro}</p>
        <p className="affiliate-note">As an Amazon Associate I earn from qualifying purchases.</p>
        <a className="button secondary" href={collection.listUrl} target="_blank" rel="sponsored noopener">Open list on Amazon <Glyph name="out" /></a>
      </div>
      <Image unoptimized src={collection.image} alt={collection.imageAlt} width={720} height={450} />
    </header>
    <section className="collection-items" aria-label={collection.listLabel}>
      <div className="collection-label"><h2>{books ? "On the bookshelf" : "In the studio"}</h2><span>{collection.items.length} {books ? "books" : "items"}</span></div>
      <ul className="pick-list">{collection.items.map(item => <li key={item.asin}>
        <a href={amazonLink(item.asin, collection.listId)} target="_blank" rel="sponsored noopener" aria-label={item.name + " on Amazon"}>
          <div><h3>{item.name}</h3><p>{item.detail}</p></div>
          <span className="pick-destination">Amazon <span className="pick-arrow"><Glyph name="out" /></span></span>
        </a>
      </li>)}</ul>
    </section>
    <Link className="text-action collection-crosslink" href={books ? "/equipment" : "/recommended-reading"}>
      {books ? "Equipment I use" : "Recommended reading"} <Glyph name="right" />
    </Link>
  </div>;
}
