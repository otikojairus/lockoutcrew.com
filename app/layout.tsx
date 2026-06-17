import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { SITE_NAME, absoluteUrl, getSiteUrl } from "@/lib/site-data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} | Locksmith and Lockout Response`,
    template: "%s",
  },
  description:
    "Locksmith and lockout service pages for emergency locksmith calls, vehicle lockouts, key cutting, key fob replacement, and roadside lockout support across Canada.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} | Locksmith and Lockout Response`,
    description: "Call-first locksmith routing for urgent lockouts, car keys, business locks, and key services.",
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
