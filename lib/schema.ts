import {
  PHONE_E164,
  SITE_NAME,
  SeoPage,
  absoluteUrl,
  buildH1,
  faqsFor,
  isCityPage,
  pageLocation,
  serviceTopicLabel,
  toPath,
} from "@/lib/site-data";

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function pageBreadcrumb(page: SeoPage) {
  return breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: buildH1(page), path: toPath(page.PageSlug) },
  ]);
}

export function faqSchema(page: SeoPage) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqsFor(page).map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function locksmithServiceSchema(page: SeoPage) {
  const location = pageLocation(page);
  return [
    {
      "@context": "https://schema.org",
      "@type": isCityPage(page) ? "LocalBusiness" : "Organization",
      "@id": `${absoluteUrl(page.PageSlug)}#locksmith`,
      name: SITE_NAME,
      telephone: PHONE_E164,
      url: absoluteUrl(page.PageSlug),
      areaServed: isCityPage(page)
        ? {
            "@type": "City",
            name: location,
          }
        : "Canada",
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${absoluteUrl(page.PageSlug)}#service`,
      name: buildH1(page),
      provider: {
        "@id": `${absoluteUrl(page.PageSlug)}#locksmith`,
      },
      areaServed: location,
      serviceType: serviceTopicLabel(page),
      url: absoluteUrl(page.PageSlug),
    },
  ];
}
