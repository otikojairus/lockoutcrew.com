import { RAW_PAGES } from "@/lib/generated-pages";

export type SeoPage = (typeof RAW_PAGES)[number];

export const SITE_NAME = "Lockout Crew";
export const DEFAULT_SITE_URL = "https://lockoutcrew.com";
export const PHONE_DISPLAY = "1-888-320-3769";
export const PHONE_E164 = "+18883203769";

export const SEO_PAGES: SeoPage[] = [...RAW_PAGES];
export const CITY_PAGES = SEO_PAGES.filter((page) => isCityPage(page));
export const UNIQUE_CITY_PAGES = CITY_PAGES.filter(
  (page, index, pages) => pages.findIndex((item) => cityFromTargetArea(item.TargetArea) === cityFromTargetArea(page.TargetArea)) === index,
);
export const NATIONAL_PAGES = SEO_PAGES.filter((page) => !isCityPage(page));
export const SERVICE_PILLARS = SEO_PAGES.filter((page) => page.PageType === "Service Pillar");
export const EMERGENCY_PAGES = SEO_PAGES.filter((page) => page.PageType === "Emergency Landing");
export const SUPPORT_PAGES = SEO_PAGES.filter((page) => !isCityPage(page) && page.PageType !== "Service Pillar");

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
}

export function toPath(slug: string) {
  return slug.startsWith("/") ? slug : `/${slug}`;
}

export function absoluteUrl(path: string) {
  return `${getSiteUrl()}${toPath(path)}`;
}

export function bySlug(slug: string) {
  const clean = toPath(slug).replace(/\/+$/, "");
  return SEO_PAGES.find((page) => page.PageSlug === clean);
}

export function isCityPage(page: SeoPage) {
  return page.PageType === "City Service Page" && !page.TargetArea.includes("National");
}

export function cityFromTargetArea(targetArea: string) {
  return targetArea.replace(/\s*\([^)]*\)/, "").split(",")[0].trim();
}

export function provinceFromTargetArea(targetArea: string) {
  return targetArea.includes(",") ? targetArea.split(",")[1].trim() : "Canada";
}

export function titleCase(value: string) {
  return value
    .split(/(\s|-|\/)/)
    .map((part) => {
      if (/^\s|-|\/$/.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("")
    .replace(/\bAnd\b/g, "and")
    .replace(/\bIn\b/g, "in")
    .replace(/\bOf\b/g, "of")
    .replace(/\bNear Me\b/g, "Near Me");
}

export function pageLocation(page: SeoPage) {
  return isCityPage(page) ? cityFromTargetArea(page.TargetArea) : "Canada";
}

export function pageListLabel(page: SeoPage) {
  if (isCityPage(page)) return cityFromTargetArea(page.TargetArea);
  return page.PageTitle.replace(/\s+-\s+.*/, "").replace(/\s+Canada$/i, "").trim();
}

export function linkLabel(page: SeoPage) {
  return isCityPage(page) ? cityFromTargetArea(page.TargetArea) : titleCase(page.PrimaryKeyword);
}

export function serviceFamily(page: SeoPage) {
  const slug = page.PageSlug;
  const keyword = page.PrimaryKeyword;
  if (slug.includes("roadside")) return "/roadside-assistance-lockout";
  if (slug.includes("key-cutting") || slug.includes("duplicate-key")) return "/key-cutting-near-me";
  if (slug.includes("key-fob") || slug.includes("car-key")) return "/car-locksmith";
  if (slug.includes("locked-keys") || slug.includes("locked-out") || slug.includes("car-lockout") || slug.includes("vehicle-lockout")) {
    return "/car-locksmith";
  }
  if (slug.includes("commercial")) return "/locksmith-services";
  if (slug.includes("emergency") || slug.includes("24-hour") || keyword.includes("lockout")) return "/mobile-locksmith";
  if (slug.includes("locksmith-services")) return "/locksmith-services";
  return "/mobile-locksmith";
}

export function pillarFor(page: SeoPage) {
  return bySlug(serviceFamily(page)) || SERVICE_PILLARS[0] || NATIONAL_PAGES[0];
}

export function cityPagesForPillar(pillar: SeoPage) {
  const family = pillar.PageSlug;
  const matches = CITY_PAGES.filter((page) => serviceFamily(page) === family);
  return matches.length ? matches : CITY_PAGES.slice(0, 12);
}

export function sameCityPages(page: SeoPage) {
  if (!isCityPage(page)) return [];
  const city = cityFromTargetArea(page.TargetArea);
  return CITY_PAGES.filter((item) => item.PageSlug !== page.PageSlug && cityFromTargetArea(item.TargetArea) === city);
}

export function supportCityLinks(page: SeoPage, limit = 6) {
  const familyMatches = CITY_PAGES.filter((item) => serviceFamily(item) === serviceFamily(page)).slice(0, limit);
  if (familyMatches.length >= limit) return familyMatches;
  return [...familyMatches, ...CITY_PAGES.filter((item) => !familyMatches.includes(item)).slice(0, limit - familyMatches.length)];
}

export function serviceTopicLabel(page: SeoPage) {
  const source = isCityPage(page) ? pillarFor(page) : page;
  return pageListLabel(source).replace(/\s+Near Me$/i, "").trim();
}

export function buildH1(page: SeoPage) {
  const location = pageLocation(page);
  const key = titleCase(page.PrimaryKeyword);
  return key.toLowerCase().includes(location.toLowerCase()) ? key : `${key} ${location}`;
}

export function buildMetaTitle(page: SeoPage) {
  const title = buildH1(page)
    .replace("Roadside Assistance Lockout", "Roadside Lockout")
    .replace("Canada Canada", "Canada");
  const suffix = SITE_NAME;
  const withService = `${title} | ${suffix}`;
  if (withService.length <= 60) return withService;
  return `${title.replace(/\s+(Service|Services|Canada)$/i, "")} | ${suffix}`.slice(0, 60).replace(/[,.|\s]+$/, "");
}

export function buildMetaDescription(page: SeoPage) {
  const location = pageLocation(page);
  const topic = isCityPage(page) ? serviceTopicLabel(page) : titleCase(page.PrimaryKeyword);
  let description = `${topic} help ${isCityPage(page) ? `in ${location}` : "across Canada"} with direct call intake for vehicle, home, business, key, fob, and roadside lockout support. Call ${PHONE_DISPLAY}.`;
  if (description.length > 160) {
    description = `${topic} help ${isCityPage(page) ? `in ${location}` : "across Canada"} with urgent locksmith intake and lockout routing. Call ${PHONE_DISPLAY}.`;
  }
  if (description.length > 160) {
    description = `${description
      .slice(0, 157)
      .replace(/\s+\S*$/, "")
      .replace(/\b(and|or|for|with)\b$/i, "")
      .replace(/[,. ]+$/, "")}.`;
  }
  return description;
}

export type CityFact = {
  routes: string[];
  places: string[];
  note: string;
};

export const CITY_FACTS: Record<string, CityFact> = {
  Barrie: { routes: ["Highway 400", "Bayfield Street"], places: ["Allandale", "Kempenfelt Bay"], note: "winter parking lots, lakeside traffic, and cottage-country travel windows" },
  Brampton: { routes: ["Highway 410", "Queen Street"], places: ["Bramalea", "Heart Lake"], note: "busy driveways, plazas, and commuter corridors across Peel Region" },
  Burlington: { routes: ["QEW", "Appleby Line"], places: ["Aldershot", "Downtown Burlington"], note: "lakefront weather, condo garages, and frequent cross-town errands" },
  Calgary: { routes: ["Deerfoot Trail", "Crowchild Trail"], places: ["Beltline", "Bowness"], note: "wide service distances, winter cold snaps, and parkade access checks" },
  Edmonton: { routes: ["Whitemud Drive", "Anthony Henday Drive"], places: ["Downtown", "Mill Woods"], note: "cold starts, long arterial routes, and after-hours vehicle calls" },
  Etobicoke: { routes: ["Gardiner Expressway", "Kipling Avenue"], places: ["Mimico", "The Kingsway"], note: "condo towers, roadside shoulders, and west Toronto commute timing" },
  Hamilton: { routes: ["Lincoln Alexander Parkway", "Main Street"], places: ["Stoney Creek", "Westdale"], note: "escarpment routes, mixed residential blocks, and industrial properties" },
  London: { routes: ["Highbury Avenue", "Wonderland Road"], places: ["Old North", "Byron"], note: "campus traffic, suburban driveways, and winter lock freeze concerns" },
  Markham: { routes: ["Highway 7", "Warden Avenue"], places: ["Unionville", "Milliken"], note: "office parks, townhouse lanes, and fast-moving York Region errands" },
  Mississauga: { routes: ["Highway 403", "Hurontario Street"], places: ["Port Credit", "Streetsville"], note: "airport-area traffic, towers, plazas, and busy residential parking" },
  Ottawa: { routes: ["Queensway", "Bank Street"], places: ["Centretown", "Orleans"], note: "deep winter freezes, government-area parking, and suburban commute patterns" },
  Regina: { routes: ["Ring Road", "Victoria Avenue"], places: ["Cathedral", "Lakeview"], note: "prairie cold, open parking lots, and late-night vehicle access calls" },
  Scarborough: { routes: ["Highway 401", "Kingston Road"], places: ["Agincourt", "Cliffside"], note: "large lots, apartment towers, and east-end traffic pressure" },
  Surrey: { routes: ["King George Boulevard", "Fraser Highway"], places: ["Newton", "Guildford"], note: "rainy lots, multi-unit housing, and Fraser Valley travel timing" },
  Toronto: { routes: ["Don Valley Parkway", "Gardiner Expressway"], places: ["Liberty Village", "The Junction"], note: "condo access, curbside timing, underground garages, and dense traffic" },
  Vancouver: { routes: ["Granville Street", "Kingsway"], places: ["Mount Pleasant", "Kitsilano"], note: "rain, parkades, high-density streets, and limited curb space" },
  Vaughan: { routes: ["Highway 400", "Rutherford Road"], places: ["Woodbridge", "Maple"], note: "driveway lockouts, shopping centres, and north GTA traffic surges" },
  Winnipeg: { routes: ["Perimeter Highway", "Portage Avenue"], places: ["St. Boniface", "River Heights"], note: "extreme cold, frozen cylinders, and long winter response windows" },
};

export function cityFactsFor(page: SeoPage) {
  return CITY_FACTS[cityFromTargetArea(page.TargetArea)];
}

export function faqsFor(page: SeoPage) {
  const topic = serviceTopicLabel(page).toLowerCase();
  const location = pageLocation(page);
  return [
    {
      q: `What should I have ready before calling in ${location}?`,
      a: `Share where the lockout is happening, whether it involves a vehicle, home, business, mailbox, garage, key fob, or duplicate key, and whether anyone is stranded or unsafe. Clear details help the call route toward the right locksmith path.`,
    },
    {
      q: `How is ${topic} handled?`,
      a: `The first step is confirming access, ownership context, lock type, key condition, and urgency. From there the work can be routed toward non-destructive entry, key duplication, vehicle unlock support, roadside coordination, or a business lock service.`,
    },
    {
      q: `Can Lockout Crew help after hours in ${location}?`,
      a: `Yes. The site is organized for urgent calls, late-night lockouts, vehicle access problems, and service pages that help callers explain the situation quickly before dispatch or scheduling decisions are made.`,
    },
  ];
}
