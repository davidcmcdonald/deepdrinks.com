"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/site.config";
import { track } from "@/lib/ga";
import Glyph from "./Glyph";

const resources = [
  { href: "/recommended-reading", label: "Recommended reading", icon: "book" },
  { href: "/equipment", label: "Equipment I use", icon: "mic" },
] as const;

export default function Header() {
  const [menu, setMenu] = useState(false);
  const [library, setLibrary] = useState(false);
  const header = useRef<HTMLElement>(null);
  const resourceButton = useRef<HTMLButtonElement>(null);
  const mobileButton = useRef<HTMLButtonElement>(null);
  const path = usePathname();

  useEffect(() => {
    if (!menu && !library) return;
    function outside(e: PointerEvent) {
      if (!header.current?.contains(e.target as Node)) { setMenu(false); setLibrary(false); }
    }
    function escape(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (library) { setLibrary(false); resourceButton.current?.focus(); }
      else { setMenu(false); mobileButton.current?.focus(); }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [library, menu]);

  function closeOnLink(e: React.MouseEvent<HTMLElement>) {
    const link = (e.target as Element).closest("a");
    if (!link) return;
    setLibrary(false); setMenu(false);
    track("nav_click", { to: link.getAttribute("href") });
  }

  return (
    <header ref={header} className="header" onClick={closeOnLink}>
      <div className="shell header-inner">
        <Link href="/" aria-label="Deep Drinks home" className="brand">
          <Image src={SITE.logo} width={720} height={371} priority unoptimized alt="Deep Drinks" />
        </Link>
        <button type="button" ref={mobileButton} className="menu-button" aria-controls="site-nav" aria-expanded={menu}
          onClick={() => { setMenu(!menu); setLibrary(false); }}>
          {menu ? "Close" : "Menu"} <Glyph name={menu ? "close" : "menu"} />
        </button>
        <nav id="site-nav" aria-label="Main navigation" className={"nav" + (menu ? " is-open" : "")}>
          <a href="/#about">About</a>
          <a href={SITE.socials.spotify} target="_blank" rel="noreferrer">Listen on Spotify <Glyph name="out" /></a>
          <a href={SITE.socials.apple} target="_blank" rel="noreferrer">Listen on Apple Music <Glyph name="out" /></a>
          <div className="resources-nav" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setLibrary(false); }}>
            <button type="button" ref={resourceButton} className="resources-trigger" aria-expanded={library} aria-controls="resource-links"
              onClick={() => setLibrary(!library)}>Resources <Glyph name="chevron" /></button>
            <div className={"resources-popover" + (library ? " is-open" : "")} id="resource-links">
              {resources.map(item => <Link key={item.href} href={item.href} aria-current={path === item.href ? "page" : undefined}>
                <Glyph name={item.icon} /> {item.label}
              </Link>)}
            </div>
          </div>
          <Link href="/support" aria-current={path === "/support" ? "page" : undefined}>Support</Link>
          <Link href="/contact" className="nav-contact" aria-current={path === "/contact" ? "page" : undefined}>Contact</Link>
        </nav>
      </div>
    </header>
  );
}
