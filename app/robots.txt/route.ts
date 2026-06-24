import { getSiteUrl } from "@/lib/site-data";

export const revalidate = 3600;

const ROBOTS_TXT = `User-Agent: *
Allow: /
`;

export function GET() {
  return new Response(`${ROBOTS_TXT}\nSitemap: ${getSiteUrl()}/sitemap.xml\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
