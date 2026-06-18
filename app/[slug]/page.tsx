import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BoltIcon, KeyIcon, PhoneIcon, ShieldIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import {
  PHONE_DISPLAY,
  PHONE_E164,
  SEO_PAGES,
  bySlug,
  buildH1,
  buildMetaDescription,
  buildMetaTitle,
  cityFactsFor,
  cityFromTargetArea,
  cityPagesForPillar,
  faqsFor,
  isCityPage,
  linkLabel,
  pageLocation,
  pageListLabel,
  pillarFor,
  sameCityPages,
  serviceTopicLabel,
  supportCityLinks,
  toPath,
} from "@/lib/site-data";
import { faqSchema, locksmithServiceSchema, pageBreadcrumb } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };
type Page = NonNullable<ReturnType<typeof bySlug>>;

export const revalidate = 86400;

export async function generateStaticParams() {
  return SEO_PAGES.map((page) => ({ slug: page.PageSlug.replace(/^\//, "") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = bySlug(slug);
  if (!page) return { title: "Page Not Found" };

  return {
    title: buildMetaTitle(page),
    description: buildMetaDescription(page),
    alternates: { canonical: toPath(page.PageSlug) },
    openGraph: {
      title: buildMetaTitle(page),
      description: buildMetaDescription(page),
      url: toPath(page.PageSlug),
      type: "article",
      locale: "en_CA",
    },
  };
}

function introText(page: Page) {
  const location = pageLocation(page);
  const topic = serviceTopicLabel(page);
  const topicLower = topic.toLowerCase();
  const facts = cityFactsFor(page);
  if (isCityPage(page) && facts) {
    return `${location} calls often depend on the exact access point: roadside stops near ${facts.routes[0]}, parking around ${facts.places[0]}, buildings near ${facts.places[1]}, or routes shaped by ${facts.note}. For ${topicLower}, the first call should identify whether this is a vehicle, home, business, key, fob, or roadside issue and whether someone is waiting outside.`;
  }
  if (isCityPage(page)) {
    return `${location} locksmith calls work best when the caller can describe the lock, vehicle, door, key, fob, or business access problem before dispatch decisions are made. For ${topicLower}, the first priority is to confirm urgency, location, ownership context, and whether non-destructive entry or key service is likely needed.`;
  }
  return `${topic} requests can start in a parking lot, driveway, apartment hallway, storefront, office, or roadside shoulder. This page keeps the call path focused on access, urgency, lock type, key condition, and the fastest practical next step.`;
}

function processSteps(page: Page) {
  const location = pageLocation(page);
  return [
    {
      title: "Call Intake",
      text: `Share the ${location} location, lock type, vehicle or property details, and whether the situation is urgent or after hours.`,
      icon: PhoneIcon,
    },
    {
      title: "Access Check",
      text: "The service path confirms ownership context, safe access, lock condition, key condition, and whether a fob, duplicate key, or entry method is involved.",
      icon: ShieldIcon,
    },
    {
      title: "Route Decision",
      text: "The call is sorted toward vehicle unlock, home entry, business lock service, roadside support, key cutting, or key replacement.",
      icon: BoltIcon,
    },
    {
      title: "Closeout",
      text: "After the issue is resolved, notes can clarify what was opened, replaced, cut, programmed, or recommended for follow-up.",
      icon: KeyIcon,
    },
  ];
}

function RelatedLinks({ page }: { page: Page }) {
  const pillar = pillarFor(page);
  const cityLinks = cityPagesForPillar(page);
  const siblingLinks = sameCityPages(page);
  const supportLinks = supportCityLinks(page, 6);

  if (page.PageType === "Service Pillar") {
    const links = cityLinks.length ? cityLinks : supportLinks;
    return (
      <section className="crew-detail">
        <div className="crew-section-head">
          <p className="crew-kicker">Local routing</p>
          <h2>City Pages For This Service</h2>
        </div>
        <div className="crew-city-grid">
          {links.map((item) => (
            <Link className="crew-city-tile" key={item.PageSlug} href={toPath(item.PageSlug)}>
              {linkLabel(item)}
            </Link>
          ))}
        </div>
      </section>
    );
  }

  if (isCityPage(page)) {
    return (
      <section className="crew-detail">
        <div className="crew-section-head">
          <p className="crew-kicker">Nearby decisions</p>
          <h2>Related Local Routes</h2>
        </div>
        <div className="crew-link-stack">
          <Link className="crew-row-link" href={toPath(pillar.PageSlug)}>
            <span>Parent service</span>
            <strong>{pageListLabel(pillar)}</strong>
            <p>Open the broader service route for this locksmith category.</p>
          </Link>
          {siblingLinks.slice(0, 5).map((item) => (
            <Link className="crew-row-link" key={item.PageSlug} href={toPath(item.PageSlug)}>
              <span>Same city</span>
              <strong>{linkLabel(item)}</strong>
              <p>Compare another local route in {cityFromTargetArea(item.TargetArea)}.</p>
            </Link>
          ))}
          {siblingLinks.length === 0 &&
            supportLinks.slice(0, 3).map((item) => (
              <Link className="crew-row-link" key={item.PageSlug} href={toPath(item.PageSlug)}>
                <span>Related city</span>
                <strong>{linkLabel(item)}</strong>
                <p>Review a nearby route with similar locksmith context.</p>
              </Link>
            ))}
        </div>
      </section>
    );
  }

  return (
    <section className="crew-detail">
      <div className="crew-section-head">
        <p className="crew-kicker">Keep moving</p>
        <h2>Relevant Service and City Pages</h2>
      </div>
      <div className="crew-link-stack">
        <Link className="crew-row-link" href={toPath(pillar.PageSlug)}>
          <span>Recommended hub</span>
          <strong>{pageListLabel(pillar)}</strong>
          <p>Use this hub for the broader service path behind the issue.</p>
        </Link>
        {supportLinks.slice(0, 6).map((item) => (
          <Link className="crew-row-link" key={item.PageSlug} href={toPath(item.PageSlug)}>
            <span>City route</span>
            <strong>{linkLabel(item)}</strong>
            <p>Open a local version of this service path.</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function DynamicSeoPage({ params }: Props) {
  const { slug } = await params;
  const page = bySlug(slug);
  if (!page) notFound();

  const faqs = faqsFor(page);
  const facts = cityFactsFor(page);
  const schema = [pageBreadcrumb(page), faqSchema(page), ...locksmithServiceSchema(page)];

  return (
    <main className="crew-main crew-page">
      <JsonLd data={schema} />
      <section className="crew-page-hero">
        <div className="crew-shell crew-page-hero-grid">
          <div>
            <p className="crew-kicker">{page.PageType}</p>
            <h1>{buildH1(page)}</h1>
            <p>{introText(page)}</p>
            <div className="crew-actions">
              <a className="crew-call crew-call-large" href={`tel:${PHONE_E164}`}>
                <PhoneIcon />
                <span>Call {PHONE_DISPLAY}</span>
              </a>
              <Link className="crew-secondary" href="/services">
                Browse Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="crew-section">
        <div className="crew-shell crew-process">
          {processSteps(page).map((step, index) => {
            const Icon = step.icon;
            return (
              <article className="crew-step" key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Icon />
                <h2>{step.title}</h2>
                <p>{step.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      {facts && (
        <section className="crew-section crew-local-band">
          <div className="crew-shell">
            <div className="crew-section-head">
              <p className="crew-kicker">{pageLocation(page)} notes</p>
              <h2>Local service details</h2>
            </div>
            <div className="crew-card-grid crew-card-grid-3">
              <article className="crew-card">
                <h3>Routes</h3>
                <p>
                  Calls may involve travel around {facts.routes[0]} or {facts.routes[1]}, where timing, parking, and
                  roadside access can shape arrival.
                </p>
              </article>
              <article className="crew-card">
                <h3>Common Areas</h3>
                <p>
                  Service may involve parking and access near {facts.places[0]} and {facts.places[1]}.
                </p>
              </article>
              <article className="crew-card">
                <h3>Field Note</h3>
                <p>{facts.note} can affect how quickly a lockout, key, or vehicle access problem is handled.</p>
              </article>
            </div>
          </div>
        </section>
      )}

      <section className="crew-section crew-section-dark">
        <div className="crew-shell crew-split">
          <div>
            <p className="crew-kicker">What to share</p>
            <h2>Help us route the right service</h2>
          </div>
          <ul className="crew-checks">
            <li>Whether the issue involves a car, home, business, key, fob, lock cylinder, or roadside situation.</li>
            <li>Whether anyone is stranded, unsafe, waiting outside, or blocked from getting back to normal.</li>
            <li>Which access details matter before entry, key cutting, fob replacement, or lock service begins.</li>
            <li>Any location details like parkades, lots, curbside timing, gates, or building access.</li>
          </ul>
        </div>
      </section>

      <div className="crew-shell">
        <RelatedLinks page={page} />
      </div>

      <section className="crew-section crew-faq-band">
        <div className="crew-shell">
          <div className="crew-section-head">
            <p className="crew-kicker">Questions</p>
            <h2>Common Questions</h2>
          </div>
          <div className="crew-card-grid crew-card-grid-3">
            {faqs.map((faq) => (
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
