import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import HeadshotGallery from "@/components/HeadshotGallery";
import "../profile.css";

export const metadata = pageMetadata("/about/david/headshots");

export default function Headshots() {
  return <section className="shell inner-page headshots-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Deep Drinks</Link><span>/</span><Link href="/about/david">About David</Link></nav>
    <h1>David’s headshots<span className="heading-period">.</span></h1>
    <p className="page-lead">Select a photo to view it full size, or download the original JPEG.</p>
    <HeadshotGallery />
  </section>;
}
