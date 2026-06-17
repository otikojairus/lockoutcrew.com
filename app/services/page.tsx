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
    q: "Does this index include every generated locksmith page?",
    a: "Yes. Service, near-me, city, emergency, roadside, lockout, key cutting, duplicate key, and key fob pages are all linked from this index.",
  },
  {
    q: "Should I start with a city page or a service page?",
    a: "Use a city page when location matters most. Use a service page when the lock type, vehicle problem, key issue, or business access concern is the clearest starting point.",
  },
  {
    q: "Are city links intentionally short?",
    a: "Yes. City links use city names only so the page does not become a repeated keyword list. The destination page carries the specific service context.",
  },
];

export const metadata: Metadata = {
  title: `Locksmith Services Index | ${SITE_NAME}`,
  description:
    "Browse every Lockout Crew locksmith, lockout, roadside, key cutting, vehicle, commercial, and city page. Call for direct intake.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: `${SITE_NAME} Service Index`,
    description: "Complete locksmith and lockout page index for Canada-wide and city-specific service routes.",
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
        <p className="crew-kicker">Complete index</p>
        <h1>Locksmith Services and City Routes</h1>
        <p>
          Use this index to move from an urgent lockout to the right service page, or from a city to the right local
          route. The labels are intentionally clean so the index stays readable instead of repeating the same locksmith
          keywords across every link.
        </p>
      </section>

      <section className="crew-section">
        <div className="crew-shell">
          <h2>Service Pillars</h2>
          <div className="crew-card-grid crew-card-grid-4">
            {SERVICE_PILLARS.map((page) => (
              <Link className="crew-card crew-card-link" href={toPath(page.PageSlug)} key={page.PageSlug}>
                <span>{page.Priority}</span>
                <h3>{pageListLabel(page)}</h3>
                <p>{page.SearchIntent} page for {page.TargetArea.toLowerCase()}.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="crew-section crew-section-dark">
        <div className="crew-shell">
          <h2>City Pages</h2>
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
          <h2>Emergency, Near-Me and Service Pages</h2>
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
          <h2>All Pages</h2>
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
