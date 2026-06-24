import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { SITE_NAME, absoluteUrl, getSiteUrl } from "@/lib/site-data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} | 24/7 Lockout Help`,
    template: "%s",
  },
  description:
    "Fast help for car lockouts, home and business entry, key cutting, fob replacement, and roadside access problems across Canada.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} | 24/7 Lockout Help`,
    description: "Fast help for urgent lockouts, car keys, business entry, and key problems across Canada.",
    url: absoluteUrl("/"),
    type: "website",
    siteName: SITE_NAME,
    locale: "en_CA",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA">
      <body>
        <SiteNavbar />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
