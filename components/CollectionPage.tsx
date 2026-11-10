import Link from "next/link";
import type { Collection } from "@/data/resources";
import CatalogShelf from "./CatalogShelf";
import Glyph from "./Glyph";

export default function CollectionPage({ collection, books }: { collection: Collection; books?: boolean }) {
  return <div className="shell inner-page collection-page">
    <a className="back-link" href="/">Deep Drinks <span>/</span></a>
    <header className="collection-intro">
      <div>
        <h1>{collection.title}<span className="heading-period">.</span></h1>
        <p className="page-lead">{collection.intro}</p>
        <p className="affiliate-note">As an Amazon Associate I earn from qualifying purchases.</p>
      </div>
      <a className="button secondary" href={collection.listUrl} target="_blank" rel="sponsored noopener">Open list on Amazon <Glyph name="out" /></a>
    </header>
    <CatalogShelf items={collection.items} books={books} />
    <Link className="text-action collection-crosslink" href={books ? "/equipment" : "/recommended-reading"}>
      {books ? "Equipment I use" : "Recommended reading"} <Glyph name="right" />
    </Link>
  </div>;
}
