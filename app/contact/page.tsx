import type { Metadata } from "next";
import { SITE } from "@/site.config";
import Glyph from "@/components/Glyph";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact", description: "Contact David McDonald about Deep Drinks guest pitches, collaborations or general enquiries.", alternates: { canonical: "/contact" } };

export default function Contact() {
  return <section className="shell inner-page contact-page">
    <div className="contact-intro">
      <a className="back-link" href="/">Deep Drinks <span>/</span></a>
      <h1>Contact<span className="heading-period">.</span></h1>
      <p className="page-lead">Have a guest in mind, a question about an episode, or something you’d like to work on together?</p>
      <a className="text-action contact-mail" href={"mailto:" + SITE.email}><Glyph name="mail" /> {SITE.email}</a>
    </div>
    <ContactForm />
  </section>;
}
