"use client";

import { useRef, useState, type FormEvent } from "react";
import { SITE } from "@/site.config";
import Glyph from "./Glyph";

type Status = "idle" | "sending" | "success" | "error";
const endpoint = "https://formsubmit.co/ajax/" + SITE.email;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const inFlight = useRef(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (String(data.get("_honey") || "")) return;
    inFlight.current = true;
    setStatus("sending");
    try {
      const response = await fetch(endpoint, {
        method: "POST", headers: { Accept: "application/json" }, body: data,
        signal: AbortSignal.timeout(20000),
      });
      const reply = await response.json();
      if (!response.ok || String(reply.success) !== "true") throw new Error("FormSubmit could not accept the message");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <form className="contact-form" action={"https://formsubmit.co/" + SITE.email} method="post" onSubmit={submit}>
      <input type="hidden" name="_subject" value="Deep Drinks website enquiry" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <div className="honey" aria-hidden="true"><label>Leave blank<input name="_honey" type="text" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="form-pair">
        <label>Your name<input name="name" autoComplete="name" required maxLength={120} /></label>
        <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
      </div>
      <label>Subject<input name="subject" required maxLength={180} /></label>
      <label>Message<textarea name="message" required rows={6} maxLength={10000} /></label>
      <div aria-live="polite" aria-atomic="true">
        {status === "success" && <p className="form-status success"><Glyph name="check" /> Thanks. Your message was submitted.</p>}
        {status === "error" && <p className="form-status error">Your message couldn’t be submitted. Try again or email <a href={"mailto:" + SITE.email}>{SITE.email}</a>.</p>}
      </div>
      <button className="button primary" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send message"} <Glyph name="right" /></button>
    </form>
  );
}
