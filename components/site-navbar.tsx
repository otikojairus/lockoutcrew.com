"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PhoneIcon } from "@/components/icons";
import { PHONE_DISPLAY, PHONE_E164, SERVICE_PILLARS, SITE_NAME, pageListLabel, toPath } from "@/lib/site-data";

export function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`crew-header ${solid ? "crew-header-solid" : ""}`}>
        <div className="crew-shell crew-nav">
          <Link className="crew-brand" href="/" aria-label={SITE_NAME} onClick={() => setOpen(false)}>
            <Image src="/logo.svg" alt="Lockout Crew logo" width={44} height={44} priority />
            <span>{SITE_NAME}</span>
          </Link>
          <nav className="crew-navlinks" aria-label="Primary navigation">
            <Link href="/">Home</Link>
            <Link href="/services">Services</Link>
            {SERVICE_PILLARS.slice(0, 3).map((page) => (
              <Link href={toPath(page.PageSlug)} key={page.PageSlug}>
                {pageListLabel(page)}
              </Link>
            ))}
          </nav>
          <a className="crew-call crew-call-top" href={`tel:${PHONE_E164}`}>
            <PhoneIcon />
            <span>{PHONE_DISPLAY}</span>
          </a>
          <button className="crew-menu" type="button" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>
            <span />
          </button>
        </div>
      </header>
      <div className={`crew-drawer ${open ? "crew-drawer-open" : ""}`} aria-hidden={!open}>
        <button className="crew-drawer-backdrop" type="button" aria-label="Close menu" onClick={() => setOpen(false)} />
        <aside className="crew-drawer-panel">
          <Link className="crew-brand" href="/" onClick={() => setOpen(false)}>
            <Image src="/logo.svg" alt="Lockout Crew logo" width={40} height={40} />
            <span>{SITE_NAME}</span>
          </Link>
          <nav className="crew-drawer-links" aria-label="Mobile navigation">
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/services" onClick={() => setOpen(false)}>
              Services
            </Link>
            {SERVICE_PILLARS.map((page) => (
              <Link href={toPath(page.PageSlug)} key={page.PageSlug} onClick={() => setOpen(false)}>
                {pageListLabel(page)}
              </Link>
            ))}
          </nav>
          <a className="crew-call" href={`tel:${PHONE_E164}`}>
            <PhoneIcon />
            <span>{PHONE_DISPLAY}</span>
          </a>
        </aside>
      </div>
    </>
  );
}
