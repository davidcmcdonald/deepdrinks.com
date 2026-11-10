import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/site.config";
import Glyph from "./Glyph";

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="shell footer-main">
        <div className="footer-brand">
          <Link href="/" aria-label="Deep Drinks home"><Image src={SITE.logo} alt="Deep Drinks" width={126} height={65} unoptimized /></Link>
          <span>© {new Date().getFullYear()} Deep Drinks Podcast</span>
        </div>
        <nav aria-label="Explore Deep Drinks">
          <a href="/#episodes">Recent episodes</a>
          <a href="/#clips">Latest clips</a>
          <a href="/#about">About the show</a>
          <Link href="/about/david">About David</Link>
        </nav>
        <nav aria-label="Resources and support">
          <Link href="/recommended-reading">Recommended reading</Link>
          <Link href="/equipment">Equipment I use</Link>
          <Link href="/support">Support</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/disclaimer">Disclaimer</Link>
        </nav>
        <nav aria-label="Follow Deep Drinks">
          <a href={SITE.socials.twitter} rel="noreferrer" target="_blank">X (Twitter) <Glyph name="out" /></a>
          <a href={SITE.socials.instagram} rel="noreferrer" target="_blank">Instagram <Glyph name="out" /></a>
          <a href={SITE.socials.bluesky} rel="noreferrer" target="_blank">Bluesky <Glyph name="out" /></a>
          <a href={SITE.socials.hub} rel="noreferrer" target="_blank">All social links <Glyph name="out" /></a>
        </nav>
      </div>
    </footer>
  );
}
