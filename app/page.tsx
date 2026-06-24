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
  cityFromTargetArea,
  linkLabel,
  toPath,
} from "@/lib/site-data";
import { breadcrumbSchema } from "@/lib/schema";

const homeFaqs = [
  {
    q: "What kinds of situations can Lockout Crew help with?",
    a: "We help with car lockouts, home and business lockouts, key cutting, duplicate keys, fob replacement, roadside access problems, and after-hours entry. If you are not sure, just call and describe what is happening.",
  },
  {
    q: "Can I call if I am not sure what I need?",
    a: "Yes. Use the call button and describe what is locked, where you are, and what is making the situation feel urgent. We will sort out the right next step from there.",
  },
  {
    q: "What should I have ready before I call?",
    a: "Just know where you are, what is locked, and whether anything makes the situation urgent, like a running vehicle, severe weather, or someone stranded outside. You do not need to know the technical name of the lock.",
  },
];

export const metadata: Metadata = {
  title: `Emergency Locksmith Canada 24/7 | ${SITE_NAME}`,
  description:
    "Emergency locksmith Canada support for lockouts, car access, keys, and roadside help. Call Lockout Crew now for fast intake and service guidance.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `Emergency Locksmith Canada 24/7 | ${SITE_NAME}`,
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
          src="/lockout-hero.webp"
          alt="Locksmith responding to a nighttime vehicle lockout"
          fill
          priority
          sizes="100vw"
        />
        <div className="crew-hero-scrim" />
        <div className="crew-shell crew-hero-grid">
          <div className="crew-hero-copy">
            <p className="crew-kicker">Available 24/7</p>
            <h1>Emergency Locksmith Canada</h1>
            <p>
              Lockouts get stressful quickly: a running car in a parking lot, keys on the seat, a storefront that will
              not open, a tenant waiting outside, or a fob that stops responding at the worst moment. Lockout Crew is
              here when that happens. Tell us where you are, what is locked, and how urgent things feel. We will help
              you figure out the right next step so you are not wasting time trying to sort it out alone.
            </p>
            <div className="crew-actions">
              <a className="crew-call crew-call-large" href={`tel:${PHONE_E164}`}>
                <PhoneIcon />
                <span>Call {PHONE_DISPLAY}</span>
              </a>
              <Link className="crew-secondary" href="/services">
                Services
              </Link>
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
            <p className="crew-kicker">Main services</p>
            <h2>What we handle</h2>
          </div>
          <div className="crew-card-grid crew-card-grid-4">
            {SERVICE_PILLARS.map((page) => (
              <Link className="crew-card crew-card-link" href={toPath(page.PageSlug)} key={page.PageSlug}>
                <h3>{linkLabel(page)}</h3>
                <p>Fast help for lockouts, access issues, and urgent service requests.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="crew-section crew-section-dark">
        <div className="crew-shell">
          <div className="crew-section-head">
            <p className="crew-kicker">Urgent calls</p>
            <h2>When it's urgent</h2>
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
            <p className="crew-kicker">Nearby help</p>
            <h2>Find help near you</h2>
          </div>
          <div className="crew-city-grid">
            {UNIQUE_CITY_PAGES.slice(0, 36).map((page) => (
              <Link className="crew-city-tile" href={toPath(page.PageSlug)} key={page.PageSlug}>
                {cityFromTargetArea(page.TargetArea)}
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
