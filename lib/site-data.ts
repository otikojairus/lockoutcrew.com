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
  return titleCase(page.PrimaryKeyword);
}

export function pageCategory(page: SeoPage) {
  if (isCityPage(page)) return "city";
  if (page.PageType === "Service Pillar") return "pillar";
  if (page.PageType === "Emergency Landing") return "emergency";
  if (page.PageType === "Near Me Page") return "near-me";
  return "service";
}

export function serviceFamily(page: SeoPage) {
  const slug = page.PageSlug;
  const keyword = page.PrimaryKeyword;
  if (slug.includes("roadside")) return "/roadside-assistance-lockout";
  if (slug.includes("key-cutting") || slug.includes("duplicate-key")) return "/key-cutting-near-me";
  if (slug.includes("key-fob") || slug.includes("car-key") || slug.includes("transponder")) return "/car-locksmith";
  if (slug.includes("locked-keys") || slug.includes("locked-out") || slug.includes("car-lockout") || slug.includes("vehicle-lockout")) {
    return "/car-locksmith";
  }
  if (slug.includes("commercial")) return "/locksmith-services";
  if (slug.includes("lock-change")) return "/locksmith-services";
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

export function supportCityLinks(page: SeoPage, limit = 4) {
  const familyMatches = CITY_PAGES.filter((item) => serviceFamily(item) === serviceFamily(page)).slice(0, limit);
  if (familyMatches.length >= limit) return familyMatches;
  return [...familyMatches, ...CITY_PAGES.filter((item) => !familyMatches.includes(item)).slice(0, limit - familyMatches.length)];
}

export function serviceTopicLabel(page: SeoPage) {
  const source = isCityPage(page) ? pillarFor(page) : page;
  return pageListLabel(source).replace(/\s+Near Me$/i, "").trim();
}

function displayKeyword(page: SeoPage) {
  const keyword = titleCase(page.PrimaryKeyword);
  if (isCityPage(page)) return keyword;
  if (/\bCanada\b/i.test(keyword)) return keyword;
  return `${keyword} Canada`;
}

export function buildH1(page: SeoPage) {
  return displayKeyword(page);
}

export function buildMetaTitle(page: SeoPage) {
  const base = displayKeyword(page).replace("Roadside Assistance Lockout", "Roadside Assistance");
  const candidates = [
    `${base} Fast Response Service | ${SITE_NAME}`,
    `${base} Fast Response | ${SITE_NAME}`,
    `${base} Service Help | ${SITE_NAME}`,
    `${base} Call Now | ${SITE_NAME}`,
    `${base} Help | ${SITE_NAME}`,
  ];
  const withinRange = candidates.find((candidate) => candidate.length >= 50 && candidate.length <= 60);
  if (withinRange) return withinRange;
  const fallback = candidates[0];
  if (fallback.length <= 60) return fallback;
  return fallback.slice(0, 60).replace(/[,.|\s-]+$/, "");
}

export function buildMetaDescription(page: SeoPage) {
  const location = pageLocation(page);
  const service = serviceTopicLabel(page);
  const candidates = [
    `${service} in ${location} for car, home, business, and roadside access issues. Call Lockout Crew now for fast intake and local service coordination.`,
    `${service} in ${location} for lockouts, car access, key issues, and urgent entry needs. Call Lockout Crew now for fast, real-person help today.`,
    `${service} in ${location} for vehicle, home, business, and roadside lock issues. Call Lockout Crew now for quick help and clear next steps.`,
  ];
  const withinRange = candidates.find((candidate) => candidate.length >= 150 && candidate.length <= 160);
  if (withinRange) return withinRange;

  let description = candidates[0];
  if (description.length < 150) {
    description = description.replace("coordination.", "coordination today.");
  }
  if (description.length < 150) {
    description = description.replace("today.", "today, fast.");
  }
  if (description.length > 160) {
    description = `${description.slice(0, 157).replace(/\s+\S*$/, "").replace(/[,. ]+$/, "")}.`;
  }
  return description;
}

export type CityFact = {
  climate: string;
  landmark: string;
  note: string;
  places: string[];
  routes: string[];
};

export const CITY_FACTS: Record<string, CityFact> = {
  Abbotsford: {
    routes: ["Highway 1", "South Fraser Way"],
    places: ["Historic Downtown", "Clearbrook"],
    landmark: "Mill Lake Park",
    climate: "wet Fraser Valley winters and warm, dry summers",
    note: "commuter traffic and rain can affect curbside access and parking-lot timing",
  },
  Airdrie: {
    routes: ["Queen Elizabeth II Highway", "Yankee Valley Boulevard"],
    places: ["Kings Heights", "Downtown Airdrie"],
    landmark: "Nose Creek Park",
    climate: "windy prairie weather with sharp winter cold snaps",
    note: "larger residential blocks and fast highway connections shape arrival planning",
  },
  Barrie: {
    routes: ["Highway 400", "Bayfield Street"],
    places: ["Allandale", "Painswick"],
    landmark: "Kempenfelt Bay",
    climate: "snowy winters and humid lakeside summers",
    note: "cottage-country traffic and waterfront parking can change timing through the day",
  },
  Brampton: {
    routes: ["Highway 410", "Queen Street"],
    places: ["Bramalea", "Heart Lake"],
    landmark: "Gage Park",
    climate: "humid continental weather with icy winter mornings",
    note: "busy plazas and driveway lockouts are common across Peel corridors",
  },
  Brantford: {
    routes: ["Highway 403", "King George Road"],
    places: ["West Brant", "Eagle Place"],
    landmark: "Grand River",
    climate: "cold winters and warm summers with frequent freeze-thaw swings",
    note: "river crossings and spread-out neighbourhoods can affect local routing",
  },
  Burnaby: {
    routes: ["Kingsway", "Lougheed Highway"],
    places: ["Metrotown", "Brentwood"],
    landmark: "Burnaby Mountain",
    climate: "mild, rainy coastal weather for much of the year",
    note: "tower parking, mall access, and heavy arterial traffic often shape arrival details",
  },
  Burlington: {
    routes: ["QEW", "Guelph Line"],
    places: ["Aldershot", "Downtown Burlington"],
    landmark: "Spencer Smith Park",
    climate: "lake-influenced winters and warm summers",
    note: "lakefront events and condo access can change where and how service is coordinated",
  },
  Calgary: {
    routes: ["Deerfoot Trail", "Crowchild Trail"],
    places: ["Beltline", "Bowness"],
    landmark: "Calgary Tower",
    climate: "dry prairie weather with fast temperature swings and chinooks",
    note: "winter cold and long cross-city distances matter for roadside and garage access calls",
  },
  Cambridge: {
    routes: ["Highway 401", "Hespeler Road"],
    places: ["Galt", "Preston"],
    landmark: "Grand River",
    climate: "cold winters and warm, humid summers",
    note: "industrial areas and river crossings can affect the smoothest service route",
  },
  Chestermere: {
    routes: ["Trans-Canada Highway", "Chestermere Boulevard"],
    places: ["Kinniburgh", "Westmere"],
    landmark: "Chestermere Lake",
    climate: "sunny prairie weather with windy winters",
    note: "lake-area traffic and suburban driveways shape service timing more than dense downtown blocks",
  },
  Coquitlam: {
    routes: ["Lougheed Highway", "Barnet Highway"],
    places: ["Burke Mountain", "Maillardville"],
    landmark: "Coquitlam Centre",
    climate: "mild coastal weather with extended rainy periods",
    note: "hills, condo parking, and commuter traffic often matter for arrival planning",
  },
  Dartmouth: {
    routes: ["Highway 111", "Portland Street"],
    places: ["Downtown Dartmouth", "Woodside"],
    landmark: "Dartmouth Waterfront",
    climate: "windy Atlantic weather with damp winters",
    note: "bridge traffic and waterfront parking rules can affect service windows",
  },
  Edmonton: {
    routes: ["Whitemud Drive", "Anthony Henday Drive"],
    places: ["Downtown", "Mill Woods"],
    landmark: "West Edmonton Mall",
    climate: "very cold winters and bright, dry summers",
    note: "cold starts, long arterial routes, and parkade access checks come up often",
  },
  Etobicoke: {
    routes: ["Gardiner Expressway", "Kipling Avenue"],
    places: ["Mimico", "The Kingsway"],
    landmark: "Humber Bay",
    climate: "lakefront winds and icy winter mornings",
    note: "condo garages and commuter traffic can shape access timing in west Toronto",
  },
  Gatineau: {
    routes: ["Autoroute 50", "Boulevard Maloney"],
    places: ["Hull", "Aylmer"],
    landmark: "Canadian Museum of History",
    climate: "cold winters and warm, humid summers",
    note: "bridge crossings and bilingual call details often matter for smooth routing",
  },
  Guelph: {
    routes: ["Hanlon Expressway", "Stone Road"],
    places: ["Downtown Guelph", "Clairfields"],
    landmark: "Basilica of Our Lady",
    climate: "cool winters and warm summers",
    note: "student traffic and newer suburban streets can affect access planning",
  },
  Halifax: {
    routes: ["Highway 102", "Barrington Street"],
    places: ["North End", "Clayton Park"],
    landmark: "Halifax Citadel",
    climate: "foggy, damp Atlantic weather with windy winters",
    note: "hills, bridge traffic, and narrow downtown parking make exact location details important",
  },
  Hamilton: {
    routes: ["Lincoln Alexander Parkway", "Main Street"],
    places: ["Stoney Creek", "Westdale"],
    landmark: "Tim Hortons Field",
    climate: "cool winters and warm summers with escarpment weather shifts",
    note: "industrial sites, older homes, and escarpment routes can all affect access decisions",
  },
  Kanata: {
    routes: ["Highway 417", "Terry Fox Drive"],
    places: ["Beaverbrook", "Kanata Lakes"],
    landmark: "Canadian Tire Centre",
    climate: "cold Ottawa Valley winters and warm summers",
    note: "tech-campus parking and suburban travel distances shape local dispatch timing",
  },
  Kingston: {
    routes: ["Highway 401", "Princess Street"],
    places: ["Downtown Kingston", "Cataraqui"],
    landmark: "Kingston Penitentiary",
    climate: "windy lake weather with snowy winters",
    note: "student housing, waterfront streets, and military-area traffic can affect service flow",
  },
  Kitchener: {
    routes: ["Highway 8", "King Street"],
    places: ["Downtown Kitchener", "Forest Heights"],
    landmark: "Victoria Park",
    climate: "cold winters and warm summers",
    note: "mid-rise buildings and regional commuting patterns often matter for arrival windows",
  },
  LaSalle: {
    routes: ["Highway 401", "Malden Road"],
    places: ["Old LaSalle", "Seven Lakes"],
    landmark: "LaSalle Waterfront",
    climate: "humid summers and winds off the Detroit River",
    note: "quiet residential streets and cross-border travel patterns shape local timing",
  },
  Langley: {
    routes: ["Fraser Highway", "200 Street"],
    places: ["Walnut Grove", "Willoughby"],
    landmark: "Fort Langley",
    climate: "mild, rainy winters and warm summers",
    note: "rapid suburban growth means townhouse complexes and busy commercial lots come up often",
  },
  Lethbridge: {
    routes: ["Crowsnest Highway", "Mayor Magrath Drive"],
    places: ["West Lethbridge", "London Road"],
    landmark: "High Level Bridge",
    climate: "dry, windy weather with sharp winter gusts",
    note: "wind and spread-out road networks can affect roadside and driveway access work",
  },
  London: {
    routes: ["Highbury Avenue", "Wonderland Road"],
    places: ["Old North", "Byron"],
    landmark: "Victoria Park",
    climate: "snowy winters and warm, humid summers",
    note: "campus traffic and suburban driveways are common factors in local service calls",
  },
  "Maple Ridge": {
    routes: ["Lougheed Highway", "Dewdney Trunk Road"],
    places: ["Albion", "Hammond"],
    landmark: "Golden Ears Park",
    climate: "mild, rainy weather with damp winters",
    note: "larger residential lots and bridge traffic can affect travel times across the area",
  },
  Markham: {
    routes: ["Highway 7", "Warden Avenue"],
    places: ["Unionville", "Milliken"],
    landmark: "Main Street Unionville",
    climate: "cold winters and warm summers",
    note: "office parks, condos, and townhouse lanes shape a lot of local access work",
  },
  Mississauga: {
    routes: ["Highway 403", "Hurontario Street"],
    places: ["Port Credit", "Streetsville"],
    landmark: "Square One",
    climate: "lake-influenced winters and warm summers",
    note: "airport-area traffic, condo towers, and busy parking structures often affect timing",
  },
  "New Westminster": {
    routes: ["Stewardson Way", "Columbia Street"],
    places: ["Sapperton", "Uptown"],
    landmark: "Westminster Pier Park",
    climate: "mild coastal weather with steady rainfall",
    note: "hills, older buildings, and bridge traffic can shape access planning",
  },
  Newmarket: {
    routes: ["Highway 404", "Yonge Street"],
    places: ["Gorham-College Manor", "Stonehaven"],
    landmark: "Fairy Lake Park",
    climate: "cold winters and warm summers",
    note: "shopping districts and family neighbourhoods create a mix of lot, garage, and driveway calls",
  },
  "North Vancouver": {
    routes: ["Marine Drive", "Lonsdale Avenue"],
    places: ["Lower Lonsdale", "Lynn Valley"],
    landmark: "Lonsdale Quay",
    climate: "rainy winters and mild temperatures",
    note: "hills, ferries, and condo parking can all affect timing and access notes",
  },
  "North York": {
    routes: ["Highway 401", "Yonge Street"],
    places: ["Willowdale", "Don Mills"],
    landmark: "Yorkdale Shopping Centre",
    climate: "cold winters and warm summers",
    note: "dense towers, hospital zones, and major commuter routes make precise location details useful",
  },
  Oakville: {
    routes: ["QEW", "Trafalgar Road"],
    places: ["Bronte", "Glen Abbey"],
    landmark: "Oakville Harbour",
    climate: "lakefront weather with icy winters and warm summers",
    note: "school traffic and multi-level condo access can change arrival logistics",
  },
  Orleans: {
    routes: ["Highway 174", "Innes Road"],
    places: ["Fallingbrook", "Chapel Hill"],
    landmark: "Petrie Island",
    climate: "cold, snowy winters and humid summers",
    note: "east-end commute patterns and large suburban lots shape service timing",
  },
  Oshawa: {
    routes: ["Highway 401", "King Street"],
    places: ["North Oshawa", "Lakeview"],
    landmark: "Tribute Communities Centre",
    climate: "windy lake weather with cold winters",
    note: "college traffic and industrial areas can affect the smoothest service route",
  },
  Ottawa: {
    routes: ["Queensway", "Bank Street"],
    places: ["Centretown", "Orleans"],
    landmark: "Parliament Hill",
    climate: "deep winter freezes and humid summers",
    note: "government parking rules, winter weather, and suburban distances often affect call planning",
  },
  Pickering: {
    routes: ["Highway 401", "Kingston Road"],
    places: ["Bay Ridges", "Amberlea"],
    landmark: "Frenchman's Bay",
    climate: "lake-effect winds and snowy winters",
    note: "GO station parking, marina traffic, and subdivision layouts can affect access timing",
  },
  Regina: {
    routes: ["Ring Road", "Victoria Avenue"],
    places: ["Cathedral", "Lakeview"],
    landmark: "Wascana Centre",
    climate: "dry prairie cold with windy winters",
    note: "open parking lots and long arterial routes often matter during vehicle lockouts",
  },
  Richmond: {
    routes: ["No. 3 Road", "Westminster Highway"],
    places: ["Steveston", "City Centre"],
    landmark: "Richmond Olympic Oval",
    climate: "mild coastal weather with frequent rain",
    note: "airport-area traffic and mixed condo-retail parking can shape arrival details",
  },
  "Richmond Hill": {
    routes: ["Highway 404", "Yonge Street"],
    places: ["Oak Ridges", "Langstaff"],
    landmark: "Richmond Green",
    climate: "cold winters and warm summers",
    note: "school zones, townhome complexes, and York Region traffic affect local service timing",
  },
  Saskatoon: {
    routes: ["Circle Drive", "8th Street"],
    places: ["Nutana", "Stonebridge"],
    landmark: "South Saskatchewan River",
    climate: "dry prairie winters and bright summers",
    note: "river crossings and winter parking lots can shape access logistics",
  },
  Scarborough: {
    routes: ["Highway 401", "Kingston Road"],
    places: ["Agincourt", "Cliffside"],
    landmark: "Scarborough Bluffs",
    climate: "cold winters and warm summers with lake winds",
    note: "large parking lots and apartment towers often make exact pickup details important",
  },
  "Sherwood Park": {
    routes: ["Yellowhead Trail", "Baseline Road"],
    places: ["Broadmoor", "Lakeland Ridge"],
    landmark: "Festival Place",
    climate: "very cold winters and bright summer days",
    note: "suburban distance and icy morning conditions can change arrival expectations",
  },
  "St Catharines": {
    routes: ["Queen Elizabeth Way", "Geneva Street"],
    places: ["Port Dalhousie", "Merritton"],
    landmark: "Montebello Park",
    climate: "lake-effect weather with snowy winters",
    note: "bridge traffic and older residential streets can shape access planning",
  },
  Sudbury: {
    routes: ["Highway 17", "Notre Dame Avenue"],
    places: ["New Sudbury", "South End"],
    landmark: "Big Nickel",
    climate: "long, snowy winters and warm summers",
    note: "larger travel distances and remote parking lots can affect timing across the city",
  },
  Surrey: {
    routes: ["King George Boulevard", "Fraser Highway"],
    places: ["Newton", "Guildford"],
    landmark: "Holland Park",
    climate: "mild, wet coastal weather",
    note: "multi-unit housing and busy Fraser Valley traffic corridors often shape service flow",
  },
  Toronto: {
    routes: ["Don Valley Parkway", "Gardiner Expressway"],
    places: ["Liberty Village", "The Junction"],
    landmark: "CN Tower",
    climate: "cold winters, humid summers, and lakefront winds",
    note: "condo access, parkades, and dense downtown traffic make precise directions especially helpful",
  },
  Vancouver: {
    routes: ["Granville Street", "Kingsway"],
    places: ["Mount Pleasant", "Kitsilano"],
    landmark: "Stanley Park",
    climate: "mild coastal weather with long rainy stretches",
    note: "parkades, narrow streets, and curbside limits often shape the best arrival plan",
  },
  Vaughan: {
    routes: ["Highway 400", "Rutherford Road"],
    places: ["Woodbridge", "Maple"],
    landmark: "Vaughan Mills",
    climate: "cold winters and warm summers",
    note: "shopping-centre traffic and growing residential blocks can affect service timing",
  },
  Victoria: {
    routes: ["Douglas Street", "Blanshard Street"],
    places: ["James Bay", "Fernwood"],
    landmark: "Inner Harbour",
    climate: "mild weather with wet winters and dry summers",
    note: "tourist traffic and older heritage buildings can affect where access work starts",
  },
  Waterloo: {
    routes: ["Conestoga Parkway", "King Street"],
    places: ["Uptown Waterloo", "Laurelwood"],
    landmark: "Waterloo Park",
    climate: "snowy winters and warm summers",
    note: "student housing and tech-campus parking often shape weekday timing",
  },
  Whitby: {
    routes: ["Highway 401", "Brock Street"],
    places: ["Brooklin", "Downtown Whitby"],
    landmark: "Whitby Harbour",
    climate: "cold winters and breezy lake conditions",
    note: "commuter traffic and suburban garages are common parts of local service calls",
  },
  Windsor: {
    routes: ["EC Row Expressway", "Huron Church Road"],
    places: ["Walkerville", "South Windsor"],
    landmark: "Detroit River waterfront",
    climate: "warmer Ontario winters and humid summers",
    note: "border traffic and wide commercial corridors can affect local arrival windows",
  },
  Winnipeg: {
    routes: ["Perimeter Highway", "Portage Avenue"],
    places: ["St. Boniface", "River Heights"],
    landmark: "The Forks",
    climate: "extreme winter cold and hot summer days",
    note: "frozen locks, wind, and long travel distances often matter during urgent calls",
  },
};

export function cityFactsFor(page: SeoPage) {
  return CITY_FACTS[cityFromTargetArea(page.TargetArea)];
}

export function faqsFor(page: SeoPage) {
  const location = pageLocation(page);
  const topic = serviceTopicLabel(page);
  const facts = cityFactsFor(page);

  if (isCityPage(page) && facts) {
    return [
      {
        q: `What details help most when calling from ${location}?`,
        a: `Share the exact street or parking area, whether you are near ${facts.landmark} or in ${facts.places[0]} or ${facts.places[1]}, and whether the problem involves a vehicle, front door, business entrance, garage, or key. That context makes it easier to line up the right next step quickly.`,
      },
      {
        q: `Do weather and traffic matter for service around ${location}?`,
        a: `Yes. ${facts.climate.charAt(0).toUpperCase() + facts.climate.slice(1)} can change how locks behave, and travel around ${facts.routes[0]} or ${facts.routes[1]} can affect the easiest arrival route. Clear location details help keep the visit practical and efficient.`,
      },
      {
        q: `Can Lockout Crew help with urgent access issues after hours in ${location}?`,
        a: `Yes. If you are stranded outside, dealing with a late-night lock issue, or stuck in a lot or parkade, call right away. The intake process focuses on safety, location clarity, and the kind of access problem you are facing so the right help can be lined up fast.`,
      },
    ];
  }

  if (page.PageType === "Service Pillar") {
    return [
      {
        q: `What kinds of situations fit ${topic}?`,
        a: `This category covers the broad moments when someone needs fast access support, better clarity on the lock or key problem, and a straightforward call path instead of guessing which narrow page applies.`,
      },
      {
        q: `Should I call this page if I am not sure what failed?`,
        a: `Yes. If all you know is that the car, home, business, gate, fob, or key is stopping you from getting moving, this page is a strong starting point. The details can be sorted during intake.`,
      },
      {
        q: `Is this page useful for after-hours service across Canada?`,
        a: `Yes. It is built for urgent calls, late-night access problems, and the kind of situations where clear routing matters more than browsing through a long menu of similar options.`,
      },
    ];
  }

  return [
    {
      q: `What should I have ready before I call from ${location}?`,
      a: `Have the location, the kind of property or vehicle involved, and a quick explanation of the lock or key problem ready. A short, clear description helps move the call toward the most useful solution without wasting time.`,
    },
    {
      q: `How does Lockout Crew sort this kind of request?`,
      a: `The first step is understanding whether you need entry, a key-related fix, roadside help, business access support, or another practical next move. Once the situation is clear, the conversation becomes much easier and faster.`,
    },
    {
      q: `Can I still call if the situation changed or became more urgent?`,
      a: `Yes. If the weather changes, the vehicle is still running, a child or pet is inside, or you are stuck outside after hours, say that immediately so the urgency is clear from the start.`,
    },
  ];
}
