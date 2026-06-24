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
  cityFromTargetArea,
  linkLabel,
  provinceFromTargetArea,
  toPath,
} from "@/lib/site-data";
import { breadcrumbSchema } from "@/lib/schema";

const serviceFaqs = [
  {
    q: "Should I describe the problem type or my location first?",
    a: "Either works. Lead with the problem if that is clearer, such as a car lockout, key issue, or after-hours entry. Lead with the city if location, traffic, or building access is the main factor. Both paths end at the same call.",
  },
  {
    q: "What if I am not sure what I need?",
    a: "Just call and describe what is happening in plain terms. You do not need to know the right category or the exact type of service before reaching out.",
  },
  {
    q: "Does it matter what time I call?",
    a: "No. Lockout situations do not follow business hours, and neither do we. Whether it is late at night, early in the morning, or a holiday weekend, reach out the same way and describe the situation.",
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
              Whether you know exactly what is wrong or just know you are stuck, this is the right place to start.
              Browse by service type if you know the problem, by city if location matters most, or just call and describe
              the situation. You do not need to have it all figured out before you reach out.
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
                <p>Start here if you know the type of help you need and want to understand what the service covers before calling.</p>
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
                <p>Use this when you know the specific situation you are dealing with, such as a car lockout, fob failure, or after-hours access issue.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="crew-section crew-section-dark">
        <div className="crew-shell">
          <div className="crew-section-head">
            <p className="crew-kicker">Cities</p>
            <h2>Browse by city</h2>
          </div>
          {cityGroups.map(([area, pages]) => (
            <div key={area} className="crew-area-block">
              <h3>{area}</h3>
              <div className="crew-city-grid">
                {pages.map((page) => (
                  <Link className="crew-city-tile" href={toPath(page.PageSlug)} key={page.PageSlug}>
                    {cityFromTargetArea(page.TargetArea)}
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
