import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import {
  CITY_PAGES,
  SEO_PAGES,
  SERVICE_PILLARS,
  SITE_NAME,
  SUPPORT_PAGES,
  absoluteUrl,
  linkLabel,
  pageListLabel,
  toPath,
} from "@/lib/site-data";
import { breadcrumbSchema } from "@/lib/schema";

const serviceFaqs = [
  {
    q: "Can I find the right locksmith service here?",
    a: "Yes. You can choose the service, city, emergency, roadside, lockout, key cutting, duplicate key, or key fob page that matches your need.",
  },
  {
    q: "Should I start with a city page or a service page?",
    a: "Use a city page when location matters most. Use a service page when the lock type, vehicle problem, key issue, or business access concern is the clearest starting point.",
  },
  {
    q: "Are the city links easy to scan?",
    a: "Yes. City links use city names only so you can get to the right local service quickly.",
  },
];

export const metadata: Metadata = {
  title: `Locksmith Services | ${SITE_NAME}`,
  description:
    "Browse locksmith help for lockouts, roadside problems, key cutting, vehicle access, commercial locks, and local service needs.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: `${SITE_NAME} Locksmith Services`,
    description: "Locksmith help for Canada-wide and local service needs.",
    url: absoluteUrl("/services"),
  },
};

export default function ServicesPage() {
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
      <section className="crew-shell crew-page-head">
        <p className="crew-kicker">Service directory</p>
        <h1>Locksmith Services and City Pages</h1>
        <p>Find the right help for a lockout, key issue, roadside problem, or local visit.</p>
      </section>

      <section className="crew-section">
        <div className="crew-shell">
          <h2>Popular services</h2>
          <div className="crew-card-grid crew-card-grid-4">
            {SERVICE_PILLARS.map((page) => (
              <Link className="crew-card crew-card-link" href={toPath(page.PageSlug)} key={page.PageSlug}>
                <h3>{pageListLabel(page)}</h3>
                <p>Choose this service when you need direct help with the issue.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="crew-section crew-section-dark">
        <div className="crew-shell">
          <h2>City help</h2>
          <div className="crew-city-grid">
            {CITY_PAGES.map((page) => (
              <Link className="crew-city-tile" href={toPath(page.PageSlug)} key={page.PageSlug}>
                {linkLabel(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="crew-section">
        <div className="crew-shell">
          <h2>Urgent help</h2>
          <div className="crew-chip-grid">
            {SUPPORT_PAGES.map((page) => (
              <Link className="crew-chip" href={toPath(page.PageSlug)} key={page.PageSlug}>
                {linkLabel(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="crew-section crew-index-band">
        <div className="crew-shell">
          <h2>All services</h2>
          <div className="crew-index-list">
            {SEO_PAGES.map((page) => (
              <Link href={toPath(page.PageSlug)} key={page.PageSlug}>
                {pageListLabel(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="crew-section">
        <div className="crew-shell">
          <h2>Common Questions</h2>
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
