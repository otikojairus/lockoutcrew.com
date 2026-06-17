import type { MetadataRoute } from "next";
import { SEO_PAGES, getSiteUrl } from "@/lib/site-data";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.96 },
    ...SEO_PAGES.map((page) => ({
      url: `${base}${page.PageSlug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: page.Priority.includes("Top") ? 0.92 : 0.78,
    })),
  ];
}
