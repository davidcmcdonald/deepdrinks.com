"use client";

import { useEffect, useRef, useState } from "react";
import { absoluteUrl, pageSchema } from "@/lib/metadata";
import Glyph from "./Glyph";
import JsonLd from "./JsonLd";

const headshots = [
  { slug: "studio-microphone", name: "At the microphone", alt: "David McDonald in an olive overshirt, looking across the studio microphone.", width: 1080, height: 1080 },
  { slug: "neon-studio", name: "Studio portrait", alt: "David McDonald in a brown jacket beneath the illuminated Deep Drinks sign.", width: 1200, height: 1200 },
  { slug: "outdoors", name: "Outdoor portrait", alt: "David McDonald smiling with his arms folded outdoors in a white shirt.", width: 1600, height: 1600 },
  { slug: "at-the-table", name: "At the table", alt: "David McDonald laughing at the microphone with bookshelves behind him.", width: 1728, height: 2160 },
];

function original(slug: string) {
  return slug === "neon-studio" ? "/images/David-Mcdonald-of-Deep-Drinks-Podcast_Profile.jpg" : "/images/headshots/" + slug + ".jpg";
}

const gallerySchema = {
  ...pageSchema("/about/david/headshots", "ImageGallery"),
  about: { "@id": absoluteUrl("/about/david#person") },
  image: headshots.map(photo => ({
    "@type": "ImageObject", name: photo.name, caption: photo.alt,
    contentUrl: absoluteUrl(original(photo.slug)), thumbnailUrl: absoluteUrl("/images/headshots/" + photo.slug + ".webp"),
    width: photo.width, height: photo.height, encodingFormat: "image/jpeg",
  })),
};

export default function HeadshotGallery() {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const current = index === null ? null : headshots[index];

  useEffect(() => {
    if (current && !dialog.current?.open) dialog.current?.showModal();
  }, [current]);

  function step(delta: number) {
    setIndex(previous => previous === null ? null : (previous + delta + headshots.length) % headshots.length);
  }

  return <>
    <JsonLd json={gallerySchema} />
    <div className="headshot-grid">
      {headshots.map((photo, position) => <figure key={photo.slug}>
        <a className="headshot-thumb" href={original(photo.slug)} aria-label={"View " + photo.name} onClick={event => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          setIndex(position);
        }}>
          <img src={"/images/headshots/" + photo.slug + ".webp"} width={640} height={Math.round(640 * photo.height / photo.width)} alt={photo.alt} />
        </a>
        <figcaption><h2>{photo.name}</h2>
          <a className="text-action" href={original(photo.slug)} download={"David-McDonald-" + photo.slug + ".jpg"}>
            Download JPG <Glyph name="download" />
          </a>
        </figcaption>
      </figure>)}
    </div>
    <dialog className="photo-dialog" aria-labelledby="lightbox-title" ref={dialog} onClose={() => setIndex(null)}
      onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}
      onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault(); step(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}>
      {current && <div className="lightbox">
        <div className="lightbox-bar"><h2 id="lightbox-title">{current.name}</h2>
          <button type="button" className="lightbox-button" autoFocus onClick={() => dialog.current?.close()} aria-label="Close photo"><Glyph name="close" /></button>
        </div>
        <img className="lightbox-photo" src={original(current.slug)} width={current.width} height={current.height} alt={current.alt} />
        <div className="lightbox-bar">
          <a className="text-action" href={original(current.slug)} download={"David-McDonald-" + current.slug + ".jpg"}>Download JPG <Glyph name="download"/></a>
          <div className="lightbox-controls">
            <button className="lightbox-button" type="button" aria-label="Previous headshot" onClick={() => step(-1)}><Glyph name="left" /></button>
            <button className="lightbox-button" type="button" aria-label="Next headshot" onClick={() => step(1)}><Glyph name="right" /></button>
          </div>
        </div>
      </div>}
    </dialog>
  </>;
}
