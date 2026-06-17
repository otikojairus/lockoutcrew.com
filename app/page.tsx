import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BoltIcon, KeyIcon, PhoneIcon, ShieldIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import {
  EMERGENCY_PAGES,
  PHONE_DISPLAY,
  PHONE_E164,
  SERVICE_PILLARS,
  SITE_NAME,
  SUPPORT_PAGES,
  UNIQUE_CITY_PAGES,
  absoluteUrl,
  linkLabel,
  pageListLabel,
  toPath,
} from "@/lib/site-data";
import { breadcrumbSchema } from "@/lib/schema";

const homeFaqs = [
  {
    q: "What kinds of locksmith calls does Lockout Crew help route?",
    a: "The site is built around emergency lockouts, car lockouts, mobile locksmith service, roadside access problems, commercial locksmith requests, key cutting, duplicate keys, and key fob replacement pages.",
  },
  {
    q: "Can I call if I am not sure which locksmith page fits?",
    a: "Yes. Use the call button and describe the locked door, vehicle, key, fob, business, or roadside situation. The first call can sort urgency, location, access constraints, and the likely service path.",
  },
  {
    q: "Why are there separate city and service pages?",
    a: "City pages keep local timing, routes, and parking context visible. Service pages keep the lock type and access problem clear. Together they help callers explain the issue faster.",
  },
];

export const metadata: Metadata = {
  title: `${SITE_NAME} | Emergency Locksmith and Lockout Help`,
  description:
    "Emergency locksmith, car lockout, key cutting, mobile locksmith, and roadside lockout pages across Canada. Call 1-888-320-3769 for direct intake.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} | Emergency Locksmith and Lockout Help`,
    description: "Fast locksmith and lockout call routing for vehicles, homes, businesses, and keys.",
    url: absoluteUrl("/"),
    type: "website",
    siteName: SITE_NAME,
  },
};

export default function HomePage() {
  return (
    <main className="crew-main">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: homeFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          },
        ]}
      />
      <section className="crew-hero">
        <Image
          className="crew-hero-image"
          src="/lockout-hero.png"
          alt="Locksmith responding to a nighttime vehicle lockout"
          fill
          priority
          sizes="100vw"
        />
        <div className="crew-hero-scrim" />
        <div className="crew-shell crew-hero-grid">
          <div className="crew-hero-copy">
            <p className="crew-kicker">24/7 locksmith intake</p>
            <h1>{SITE_NAME}</h1>
            <p>
              Lockouts get stressful quickly: a running car in a parking lot, keys on the seat, a storefront that will
              not open, a tenant waiting outside, or a fob that stops responding at the worst moment. Lockout Crew keeps
              the service path direct so callers can explain the lock, the location, the urgency, and the access issue
              without sorting through generic pages first.
            </p>
            <div className="crew-actions">
              <a className="crew-call crew-call-large" href={`tel:${PHONE_E164}`}>
                <PhoneIcon />
                <span>Call {PHONE_DISPLAY}</span>
              </a>
              <Link className="crew-secondary" href="/services">
                Service Index
              </Link>
            </div>
          </div>
          <div className="crew-hero-panel" aria-label="Locksmith dispatch status">
            <div className="crew-status-top">
              <span>Access queue</span>
              <strong>LIVE</strong>
            </div>
            <div className="crew-lock-visual">
              <div className="crew-lock-shackle" />
              <div className="crew-lock-body">
                <ShieldIcon />
              </div>
            </div>
            <div className="crew-status-grid">
              <span>Vehicle</span>
              <b>Unlocked routing</b>
              <span>Business</span>
              <b>Access review</b>
              <span>Keys</span>
              <b>Cut + replace</b>
            </div>
          </div>
        </div>
      </section>

      <section className="crew-strip">
        <div className="crew-shell crew-strip-grid">
          <div>
            <BoltIcon />
            <span>Emergency lockouts</span>
          </div>
          <div>
            <KeyIcon />
            <span>Keys and fobs</span>
          </div>
          <div>
            <ShieldIcon />
            <span>Home and business access</span>
          </div>
        </div>
      </section>

      <section className="crew-section">
        <div className="crew-shell">
          <div className="crew-section-head">
            <p className="crew-kicker">Main routes</p>
            <h2>Service Hubs</h2>
          </div>
          <div className="crew-card-grid crew-card-grid-4">
            {SERVICE_PILLARS.map((page) => (
              <Link className="crew-card crew-card-link" href={toPath(page.PageSlug)} key={page.PageSlug}>
                <span>{page.PageType}</span>
                <h3>{pageListLabel(page)}</h3>
                <p>{page.SearchIntent} intake for lockouts, access issues, and related local pages.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="crew-section crew-section-dark">
        <div className="crew-shell">
          <div className="crew-section-head">
            <p className="crew-kicker">Urgent calls</p>
            <h2>High-Priority Locksmith Pages</h2>
          </div>
          <div className="crew-chip-grid">
            {[...EMERGENCY_PAGES, ...SUPPORT_PAGES.slice(0, 10)].map((page) => (
              <Link className="crew-chip" href={toPath(page.PageSlug)} key={page.PageSlug}>
                {linkLabel(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="crew-section">
        <div className="crew-shell">
          <div className="crew-section-head">
            <p className="crew-kicker">Local pages</p>
            <h2>City Coverage</h2>
          </div>
          <div className="crew-city-grid">
            {UNIQUE_CITY_PAGES.slice(0, 36).map((page) => (
              <Link className="crew-city-tile" href={toPath(page.PageSlug)} key={page.PageSlug}>
                {linkLabel(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="crew-section crew-faq-band">
        <div className="crew-shell">
          <div className="crew-section-head">
            <p className="crew-kicker">Questions</p>
            <h2>Before You Call</h2>
          </div>
          <div className="crew-card-grid crew-card-grid-3">
            {homeFaqs.map((faq) => (
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
