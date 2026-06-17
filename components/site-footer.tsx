import Image from "next/image";
import Link from "next/link";
import { KeyIcon, PhoneIcon, ShieldIcon } from "@/components/icons";
import {
  EMERGENCY_PAGES,
  PHONE_DISPLAY,
  PHONE_E164,
  SERVICE_PILLARS,
  SITE_NAME,
  UNIQUE_CITY_PAGES,
  pageListLabel,
  toPath,
} from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="crew-footer">
      <div className="crew-shell crew-footer-grid">
        <div className="crew-footer-lead">
          <div className="crew-brand crew-brand-footer">
            <Image src="/logo.svg" alt="Lockout Crew logo" width={44} height={44} />
            <span>{SITE_NAME}</span>
          </div>
          <p>
            Call-first locksmith routing for vehicle lockouts, emergency access, key cutting, business locks, roadside
            lockouts, and urgent key problems across Canada.
          </p>
          <a className="crew-call" href={`tel:${PHONE_E164}`}>
            <PhoneIcon />
            <span>{PHONE_DISPLAY}</span>
          </a>
        </div>
        <div>
          <h2>
            <ShieldIcon /> Core
          </h2>
          <nav className="crew-footer-links" aria-label="Footer service pages">
            {SERVICE_PILLARS.map((page) => (
              <Link href={toPath(page.PageSlug)} key={page.PageSlug}>
                {pageListLabel(page)}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h2>
            <PhoneIcon /> Urgent
          </h2>
          <nav className="crew-footer-links" aria-label="Footer urgent pages">
            {EMERGENCY_PAGES.map((page) => (
              <Link href={toPath(page.PageSlug)} key={page.PageSlug}>
                {pageListLabel(page)}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h2>
            <KeyIcon /> Cities
          </h2>
          <nav className="crew-footer-links crew-city-list" aria-label="Footer city pages">
            {UNIQUE_CITY_PAGES.slice(0, 18).map((page) => (
              <Link href={toPath(page.PageSlug)} key={page.PageSlug}>
                {pageListLabel(page)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
