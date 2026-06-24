import type { Metadata } from "next";
import Link from "next/link";
import { PhoneIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import {
  CITY_PAGES,
  EMERGENCY_PAGES,
  PHONE_DISPLAY,
  PHONE_E164,
  SERVICE_PILLARS,
  SITE_NAME,
  SUPPORT_PAGES,
  absoluteUrl,
  linkLabel,
  provinceFromTargetArea,
  toPath,
} from "@/lib/site-data";
import { breadcrumbSchema } from "@/lib/schema";

const serviceFaqs = [
  {
    q: "Should I start with a service page or a city page?",
    a: "Start with a service page when the problem itself is the clearest detail, such as a car lockout, key issue, or emergency access concern. Start with a city page when location, traffic, building access, or local context matters most.",
  },
  {
    q: "Why does this directory include emergency, city, and specialist pages?",
    a: "People search in different ways. Some know the city first, some know the exact problem first, and some only know the situation feels urgent. This directory is meant to support all three without sending people into dead ends.",
  },
  {
    q: "Can I call even if I am not sure which page fits best?",
    a: "Yes. If you are unsure, use the call button and describe what is locked, where you are, and what is making the issue urgent. The point of this site is to help that conversation start clearly, not to make you diagnose the problem alone.",
  },
];

export const metadata: Metadata = {
  title: `Locksmith Services Canada Guide | ${SITE_NAME}`,
  description:
    "Locksmith services Canada pages for lockouts, key issues, roadside help, and city-specific support. Call Lockout Crew now and find the right page fast.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: `Locksmith Services Canada Guide | ${SITE_NAME}`,
    description: "Browse locksmith, emergency, and city pages built to help customers find the right service fast.",
    url: absoluteUrl("/services"),
  },
};

export default function ServicesPage() {
  const cityGroups = Object.entries(
    CITY_PAGES.reduce<Record<string, typeof CITY_PAGES>>((groups, page) => {
      const area = provinceFromTargetArea(page.TargetArea);
      (groups[area] ||= []).push(page);
      return groups;
    }, {}),
  );

  return (
    <main className="crew-main crew-page">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: serviceFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          },
        ]}
      />

      <section className="crew-page-hero">
        <div className="crew-shell crew-page-hero-grid">
          <div>
            <p className="crew-kicker">Service directory</p>
            <h1>Locksmith Services Canada</h1>
            <p>
              This page is the main directory for the site, built for people who want one clear place to compare city
              pages, broad service categories, urgent landing pages, and more specific lock or key topics. Some visitors
              know the city first. Others know the exact problem first. Others just know they are stuck and need to call.
              The goal here is to make every one of those paths easy to follow, with no orphan pages and no vague links
              that force you to guess where to go next.
            </p>
            <div className="crew-actions">
              <a className="crew-call crew-call-large" href={`tel:${PHONE_E164}`}>
                <PhoneIcon />
                <span>Call {PHONE_DISPLAY}</span>
              </a>
              <Link className="crew-secondary" href="/">
                Back to Home
              </Link>
            </div>
          </div>
          <aside className="crew-page-meter" aria-label="Directory summary">
            <span>National service pages</span>
            <b>{SERVICE_PILLARS.length + SUPPORT_PAGES.length}</b>
            <span>City pages</span>
            <b>{CITY_PAGES.length}</b>
            <span>Emergency pages</span>
            <b>{EMERGENCY_PAGES.length}</b>
            <span>Purpose</span>
            <b>Help customers reach the right page without guesswork</b>
          </aside>
        </div>
      </section>

      <section className="crew-section">
        <div className="crew-shell">
          <div className="crew-section-head">
            <p className="crew-kicker">Core categories</p>
            <h2>Start with the broad service you need</h2>
          </div>
          <div className="crew-card-grid crew-card-grid-4">
            {SERVICE_PILLARS.map((page) => (
              <Link className="crew-card crew-card-link" href={toPath(page.PageSlug)} key={page.PageSlug}>
                <h3>{linkLabel(page)}</h3>
                <p>Use this page when you want the main service family before choosing a more specific city or symptom page.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="crew-section crew-local-band">
        <div className="crew-shell">
          <div className="crew-section-head">
            <p className="crew-kicker">Urgent and specialist pages</p>
            <h2>Find the exact problem faster</h2>
          </div>
          <div className="crew-card-grid crew-card-grid-3">
            {[...EMERGENCY_PAGES, ...SUPPORT_PAGES].map((page) => (
              <Link className="crew-card crew-card-link" href={toPath(page.PageSlug)} key={page.PageSlug}>
                <h3>{linkLabel(page)}</h3>
                <p>Open this page for a narrower customer problem, a more urgent situation, or a more specific search intent.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="crew-section crew-section-dark">
        <div className="crew-shell">
          <div className="crew-section-head">
            <p className="crew-kicker">Cities</p>
            <h2>Browse city locksmith pages by area</h2>
          </div>
          {cityGroups.map(([area, pages]) => (
            <div key={area} className="crew-area-block">
              <h3>{area}</h3>
              <div className="crew-city-grid">
                {pages.map((page) => (
                  <Link className="crew-city-tile" href={toPath(page.PageSlug)} key={page.PageSlug}>
                    {linkLabel(page)}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="crew-section crew-faq-band">
        <div className="crew-shell">
          <div className="crew-section-head">
            <p className="crew-kicker">Questions</p>
            <h2>How to use this directory</h2>
          </div>
          <div className="crew-card-grid crew-card-grid-3">
            {serviceFaqs.map((faq) => (
              <article className="crew-card" key={faq.q}>
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
