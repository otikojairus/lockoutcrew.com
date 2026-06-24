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
  pageCategory,
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
  const facts = cityFactsFor(page);
  const pillar = pillarFor(page);
  const category = pageCategory(page);

  if (isCityPage(page) && facts) {
    return `If you need help in ${location}, the best first move is giving a clear picture of where you are, what is locked, and what is making the situation urgent. A call near ${facts.landmark}, along ${facts.routes[0]}, or in neighbourhoods like ${facts.places[0]} and ${facts.places[1]} can play out very differently depending on parking, building entry, traffic, and weather. We are here to make that first conversation easier so you can explain the problem in plain language and move toward the right next step without wasting time.`;
  }

  if (category === "pillar") {
    return `${topic} can cover a surprisingly wide range of situations, from a running car with the keys inside to a storefront that will not open, a house key that stopped cooperating, or a roadside access problem that turned into a stressful delay. This page brings those situations together in one clear starting point so you do not have to guess which narrow service label fits before you call. If the issue is urgent, after hours, or simply confusing, the goal is to help you describe it quickly and get practical help moving in the right direction.`;
  }

  if (category === "emergency") {
    return `Urgent lock and key problems rarely happen at a convenient time. You might be standing in a dark lot, outside a building that should already be open, or on the shoulder of the road trying to figure out what failed first. This page is meant for that kind of moment. Instead of making you sort through a long directory, it focuses on the details that matter most right away: your location, the access issue, whether anyone is stranded or unsafe, and how quickly the situation needs to be handled.`;
  }

  return `If you need help with ${topic.toLowerCase()} in ${location}, you are in the right place. Whether you know the exact problem or just know you cannot get into the car, home, office, or locked area, the fastest move is a clear call that covers where you are, what is locked, and anything that makes the situation feel urgent. If the issue turns out to be closer to ${pageListLabel(pillar).toLowerCase()}, the links below will get you there without starting over.`;
}

function processSteps(page: Page) {
  const location = pageLocation(page);
  return [
    {
      title: "Share the location",
      text: `Start with the exact ${location} address, lot, building entrance, garage, roadside stop, or business unit so the situation is understood clearly from the first minute.`,
      icon: PhoneIcon,
    },
    {
      title: "Describe the access issue",
      text: "Mention whether this involves a car, home, office, storefront, mailbox, key, fob, or a lock that suddenly stopped working the way it should.",
      icon: ShieldIcon,
    },
    {
      title: "Flag what makes it urgent",
      text: "Say right away if the vehicle is running, the weather is severe, you are blocked from closing a business, or someone is stranded outside after hours.",
      icon: BoltIcon,
    },
    {
      title: "Confirm the practical next step",
      text: "Once the situation is clear, the call can move toward entry, key support, roadside help, business access work, or another solution that fits the problem.",
      icon: KeyIcon,
    },
  ];
}

function guidanceCards(page: Page) {
  const category = pageCategory(page);
  const location = pageLocation(page);
  const facts = cityFactsFor(page);

  if (isCityPage(page) && facts) {
    return [
      {
        title: "Why the exact spot matters",
        text: `A lockout outside a detached home, inside a condo garage, or beside a busy route like ${facts.routes[1]} can require different planning. A precise description helps avoid back-and-forth and keeps the visit efficient.`,
      },
      {
        title: "What local conditions change",
        text: `${facts.climate.charAt(0).toUpperCase() + facts.climate.slice(1)} can affect frozen locks, damp mechanisms, and the comfort level of waiting outside. Traffic around ${facts.landmark} also changes how calls are coordinated during peak periods.`,
      },
      {
        title: "What callers usually want solved",
        text: `Most people are not looking for a lecture on hardware. They want to get back into the vehicle, secure the property, replace a failed key, or stop the day from spiraling any further.`,
      },
    ];
  }

  if (category === "pillar") {
    return [
      {
        title: "A broad starting point",
        text: "Start here when the issue is clearly urgent but you are not sure exactly what fix is needed. You can describe the situation in plain terms and the right next step will become clearer.",
      },
      {
        title: "Useful across more scenarios",
        text: `This page can still help if the problem moves between settings, such as a vehicle issue that becomes a roadside problem or a business lock issue that also involves key replacement in ${location}.`,
      },
      {
        title: "Easy to continue from here",
        text: "If you need a city-specific version of this service or a more focused type of help, the links below will get you there without guessing.",
      },
    ];
  }

  return [
    {
      title: "Clearer than a generic search",
      text: "This page narrows the conversation to one kind of access problem so you can explain the issue faster and reach the most relevant help without sorting through unrelated options.",
    },
    {
      title: "Available day or night",
      text: "Whether the problem happens in a quiet driveway, a busy commercial block, or a parking lot late at night, the steps are the same.",
    },
    {
      title: "Easy to continue from here",
      text: "If your situation turns out to be slightly different from what you first expected, the service and city links on this page point you toward the nearest match.",
    },
  ];
}

function narrativeSection(page: Page) {
  const category = pageCategory(page);
  const topic = serviceTopicLabel(page);
  const location = pageLocation(page);
  const facts = cityFactsFor(page);
  const pillar = pillarFor(page);

  if (isCityPage(page) && facts) {
    return {
      title: `What this feels like on the ground in ${location}`,
      paragraphs: [
        `Calls usually sound simple at first and then get more specific very quickly. Someone may say they are locked out, but what matters next is whether they are outside a condo in ${facts.places[0]}, dealing with a key issue near ${facts.landmark}, or stopped along ${facts.routes[0]} with traffic moving around them. Those details shape the safest and most practical next move.`,
        `That is also why this page stays specific to ${location}. The area has its own rhythm, from ${facts.climate} to the way ${facts.note}. The goal is helping you explain the situation clearly and find the right help with less stress.`,
      ],
    };
  }

  if (category === "pillar") {
    return {
      title: "What this covers",
      paragraphs: [
        `Whether you already know the type of help you need or just know that access has broken down, this page is built to make the next step clear. The focus stays on your situation: being locked out, delayed, unable to secure a property, or stuck with a key or fob issue that interrupted the day.`,
        `If you realize the problem is more specific than you first thought, the links on this page point toward local versions of this service and related types of help, so you can find the right fit without starting over.`,
      ],
    };
  }

  if (category === "emergency") {
    return {
      title: "What to expect when you call",
      paragraphs: [
        "When something urgent happens, the last thing you need is a wall of information to sort through. This page is built to move quickly: confirm you are in the right place, make the call, and describe the situation. Everything else can follow.",
        `If your situation involves a specific location or a related service, the links below make the next step easy to find so you are not bouncing around trying to figure it out under pressure.`,
      ],
    };
  }

  return {
    title: "How to get the right help",
    paragraphs: [
      `Whether you came here from a search or followed a link, this page is built to be useful right away. It stays focused on the specific problem while still connecting to the broader service category if you need more context.`,
      `If the situation turns out to be slightly different from what you first expected, the links on this page connect to related services in ${location} so you can find the right fit without starting over.`,
    ],
  };
}

function localCards(page: Page) {
  const facts = cityFactsFor(page);
  if (!facts) return [];

  return [
    {
      title: "Travel and access",
      text: `Calls in this area often move around ${facts.routes[0]} and ${facts.routes[1]}, where timing, curb space, and building access can all shape how smoothly the visit begins.`,
    },
    {
      title: "Neighbourhood context",
      text: `Places like ${facts.places[0]} and ${facts.places[1]} create different access patterns, from apartment entries to driveway lockouts and mixed-use parking situations near ${facts.landmark}.`,
    },
    {
      title: "Weather and timing",
      text: `${facts.climate.charAt(0).toUpperCase() + facts.climate.slice(1)} means locks, keys, and wait conditions can feel very different by season. ${facts.note.charAt(0).toUpperCase() + facts.note.slice(1)}.`,
    },
  ];
}

function RelatedLinks({ page }: { page: Page }) {
  const pillar = pillarFor(page);
  const cityLinks = cityPagesForPillar(page);
  const siblingLinks = sameCityPages(page);
  const supportLinks = supportCityLinks(page, 4);

  if (page.PageSlug === pillar.PageSlug) {
    return (
      <section className="crew-detail">
        <div className="crew-section-head">
          <p className="crew-kicker">Local service pages</p>
          <h2>Find this service in nearby cities</h2>
        </div>
        <div className="crew-city-grid">
          {cityLinks.map((item) => (
            <Link className="crew-city-tile" key={item.PageSlug} href={toPath(item.PageSlug)}>
              {cityFromTargetArea(item.TargetArea)}
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
          <p className="crew-kicker">Related help</p>
          <h2>Continue with the right page</h2>
        </div>
        <div className="crew-link-stack">
          <Link className="crew-row-link" href={toPath(pillar.PageSlug)}>
            <span>Main service</span>
            <strong>{linkLabel(pillar)}</strong>
            <p>Return to the main service page for this type of access issue.</p>
          </Link>
          {siblingLinks.slice(0, 5).map((item) => (
            <Link className="crew-row-link" key={item.PageSlug} href={toPath(item.PageSlug)}>
              <span>Same city</span>
              <strong>{linkLabel(item)}</strong>
              <p>See another service option for {cityFromTargetArea(item.TargetArea)}.</p>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="crew-detail">
      <div className="crew-section-head">
        <p className="crew-kicker">Related help</p>
        <h2>Keep moving in the right direction</h2>
      </div>
      <div className="crew-link-stack">
        <Link className="crew-row-link" href={toPath(pillar.PageSlug)}>
          <span>Main service</span>
          <strong>{linkLabel(pillar)}</strong>
          <p>Open the broader service page if you need the main category first.</p>
        </Link>
        {supportLinks.map((item) => (
          <Link className="crew-row-link" key={item.PageSlug} href={toPath(item.PageSlug)}>
            <span>City page</span>
            <strong>{linkLabel(item)}</strong>
            <p>Switch to a city-specific page for more local context and related service links.</p>
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
  const narrative = narrativeSection(page);
  const schema = [pageBreadcrumb(page), faqSchema(page), ...locksmithServiceSchema(page)];

  return (
    <main className="crew-main crew-page">
      <JsonLd data={schema} />
      <section className="crew-page-hero">
        <div className="crew-shell crew-page-hero-grid">
          <div>
            <p className="crew-kicker">Get help now</p>
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
        <div className="crew-shell">
          <div className="crew-section-head">
            <p className="crew-kicker">First steps</p>
            <h2>How the call usually unfolds</h2>
          </div>
          <div className="crew-process">
            {processSteps(page).map((step, index) => {
              const Icon = step.icon;
              return (
                <article className="crew-step" key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Icon />
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="crew-section crew-local-band">
        <div className="crew-shell">
          <div className="crew-section-head">
            <p className="crew-kicker">What matters</p>
            <h2>Helpful context before you call</h2>
          </div>
          <div className="crew-card-grid crew-card-grid-3">
            {guidanceCards(page).map((card) => (
              <article className="crew-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {facts && (
        <section className="crew-section">
          <div className="crew-shell">
            <div className="crew-section-head">
              <p className="crew-kicker">{pageLocation(page)} details</p>
              <h2>What to know about this area</h2>
            </div>
            <div className="crew-card-grid crew-card-grid-3">
              {localCards(page).map((card) => (
                <article className="crew-card" key={card.title}>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="crew-section crew-section-dark">
        <div className="crew-shell crew-copy-band">
          <div className="crew-section-head">
            <p className="crew-kicker">Good to know</p>
            <h2>{narrative.title}</h2>
          </div>
          <div className="crew-copy-columns">
            {narrative.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="crew-section">
        <div className="crew-shell crew-split">
          <div>
            <p className="crew-kicker">Before you call</p>
            <h2>What to mention right away</h2>
            <p className="crew-body-lead">
              The most useful calls are the ones that describe the real problem in plain language. You do not need to
              know the technical name of the lock, only what happened and what is stopping you from moving forward.
            </p>
          </div>
          <ul className="crew-checks">
            <li>Say whether the issue involves a car, home, office, storefront, gate, mailbox, or garage.</li>
            <li>Mention if keys are visible inside, a fob stopped responding, or the lock is turning differently than normal.</li>
            <li>Flag safety concerns immediately if anyone is stranded, exposed to weather, or locked out after business hours.</li>
            <li>Share parking, buzzer, curbside, loading dock, or gate details that can save time on arrival.</li>
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
