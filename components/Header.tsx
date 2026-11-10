"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/site.config";
import { track } from "@/lib/ga";
import Glyph from "./Glyph";

const groups = {
  About: [
    { href: "/#about", label: "About the show", icon: "audio" },
    { href: "/about/david", label: "About David", icon: "person" },
  ],
  Resources: [
    { href: "/recommended-reading", label: "Recommended reading", icon: "book" },
    { href: "/equipment", label: "Equipment I use", icon: "mic" },
  ],
} as const;
type Group = keyof typeof groups;

export default function Header() {
  const [menu, setMenu] = useState(false);
  const [openGroup, setOpenGroup] = useState<Group | null>(null);
  const header = useRef<HTMLElement>(null);
  const mobileButton = useRef<HTMLButtonElement>(null);
  const path = usePathname();

  useEffect(() => {
    if (!menu && !openGroup) return;
    function outside(e: PointerEvent) {
      if (!header.current?.contains(e.target as Node)) { setMenu(false); setOpenGroup(null); }
    }
    function escape(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (openGroup) {
        header.current?.querySelector<HTMLButtonElement>('[aria-controls="nav-' + openGroup + '"]')?.focus();
        setOpenGroup(null);
      } else {
        setMenu(false);
        mobileButton.current?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [openGroup, menu]);

  function closeOnLink(e: React.MouseEvent<HTMLElement>) {
    const link = (e.target as Element).closest("a");
    if (!link) return;
    setOpenGroup(null); setMenu(false);
    track("nav_click", { to: link.getAttribute("href") });
  }

  function dropdown(group: Group) {
    const open = openGroup === group;
    return (
      <div className="nav-group" onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpenGroup(current => current === group ? null : current);
      }}>
        <button type="button" className="nav-trigger" aria-expanded={open} aria-controls={"nav-" + group}
          onClick={() => setOpenGroup(open ? null : group)}>
          {group} <Glyph name="chevron" />
        </button>
        <div className={"nav-popover" + (open ? " is-open" : "")} id={"nav-" + group}>
          {groups[group].map(item => <Link key={item.href} href={item.href} aria-current={path === item.href ? "page" : undefined}>
            <Glyph name={item.icon} /> {item.label}
          </Link>)}
        </div>
      </div>
    );
  }

  return (
    <header ref={header} className="header" onClick={closeOnLink}>
      <div className="shell header-inner">
        <Link href="/" aria-label="Deep Drinks home" className="brand">
          <Image src={SITE.logo} width={720} height={371} priority unoptimized alt="Deep Drinks" />
        </Link>
        <button type="button" ref={mobileButton} className="menu-button" aria-controls="site-nav" aria-expanded={menu}
          onClick={() => { setMenu(!menu); setOpenGroup(null); }}>
          {menu ? "Close" : "Menu"} <Glyph name={menu ? "close" : "menu"} />
        </button>
        <nav id="site-nav" aria-label="Main navigation" className={"nav" + (menu ? " is-open" : "")}>
          {dropdown("About")}
          <a href={SITE.socials.spotify} target="_blank" rel="noreferrer">Listen on Spotify <Glyph name="out" /></a>
          <a href={SITE.socials.apple} target="_blank" rel="noreferrer">Listen on Apple Music <Glyph name="out" /></a>
          {dropdown("Resources")}
          <Link href="/support" aria-current={path === "/support" ? "page" : undefined}>Support</Link>
          <Link href="/contact" className="nav-contact" aria-current={path === "/contact" ? "page" : undefined}>Contact</Link>
        </nav>
      </div>
    </header>
  );
}
