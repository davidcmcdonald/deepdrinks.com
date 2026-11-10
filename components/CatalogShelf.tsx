"use client";

import { useState } from "react";
import type { Pick } from "@/data/resources";
import Glyph from "./Glyph";

export default function CatalogShelf({ items, books = false }: { items: Pick[]; books?: boolean }) {
  const [query, setQuery] = useState("");
  const term = query.trim().toLocaleLowerCase();
  const results = term ? items.filter(item => (item.name + " " + item.detail).toLocaleLowerCase().includes(term)) : items;
  return <section className="collection-items" aria-label={books ? "Reading list" : "Equipment list"}>
    <div className="collection-label">
      <p className="catalog-count" role="status">{term ? results.length + " of " : ""}{items.length} {books ? "books" : "items"}</p>
      {books && <label className="catalog-search">
        <Glyph name="search" /><input type="search" aria-label="Search books by title or author" placeholder="Search books or authors" value={query} onChange={e => setQuery(e.target.value)} />
      </label>}
    </div>
    <ul className="pick-list">{results.map(item => <li key={item.asin}>
      <a href={item.url} target="_blank" rel="sponsored noopener" aria-label={item.name + " on Amazon"} title={item.name}>
        <div className="pick-art">
          <img src={item.image} alt="" width={320} height={320} loading="lazy" decoding="async"
            onError={e => e.currentTarget.setAttribute("data-unavailable", "true")} />
          <span className="art-fallback">See {books ? "cover" : "photo"} on Amazon <Glyph name="out" /></span>
        </div>
        <div className="pick-caption">
          {item.detail && <p>{item.detail}</p>}
          <h3>{item.name}</h3>
          <span className="pick-destination">View on Amazon <Glyph name="out" /></span>
        </div>
      </a>
    </li>)}</ul>
    {!results.length && <div className="catalog-empty"><p>No books match “{query}”.</p><button type="button" className="button secondary" onClick={() => setQuery("")}>Clear search</button></div>}
  </section>;
}
