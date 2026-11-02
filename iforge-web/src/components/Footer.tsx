"use client";

import React from "react";
import Link from "next/link";
import { useSiteContent } from "@/components/SiteContentProvider";
import { allEmails, allPhones, telHref } from "@/data/siteData";
import { ArrowRight, ArrowUpRight } from "reicon-react";
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";

// The registered company name for the sign-off at the very bottom.
const LEGAL_NAME = "iForge Technologies LLP";

const linkCol = (title: string, links: { label: string; href: string }[]) => (
  <div>
    <h3 className="mb-5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
      {title}
    </h3>
    <ul className="space-y-3 text-sm [overflow-wrap:anywhere]">
      {links.map((l) => (
        <li key={l.label}>
          <Link
            href={l.href}
            className="link-underline text-muted-foreground hover:text-foreground"
          >
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  const { siteConfig, services: servicesData } = useSiteContent();
  const year = new Date().getFullYear();

  return (
    <div className="bg-background" data-rail-end>
      {/* CTA band */}
      <section className="border-t border-hairline">
        <div className="container-page grid gap-8 py-16 md:grid-cols-[1.4fr_1fr] md:items-end md:py-24">
          <div>
            <p className="eyebrow mb-5">Let&apos;s build</p>
            <h2 className="max-w-xl text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Ready to engineer resilient enterprise systems?
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              href="/quote"
              className="group inline-flex items-center gap-2 bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-[#E61E32]"
            >
              Calculate project scope
              <ArrowRight className="h-4 w-4 arrow-nudge" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-hairline px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-[#E61E32] hover:text-[#E61E32]"
            >
              Contact leadership
            </Link>
          </div>
        </div>
      </section>

      {/* Directory */}
      <footer className="border-t border-hairline">
        <div className="container-page py-12 md:py-16">
          {/* Phones: brand on top, link columns two across. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            {/* Brand */}
            <div className="col-span-2 max-w-sm md:col-span-1">
              <span className="text-2xl font-black tracking-tight text-foreground lowercase">
                iforge
              </span>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                End-to-end enterprise IT consultancy, multi-cloud architecture, AI &amp; ML
                engineering, cybersecurity, and bespoke application development.
              </p>
            </div>

            {linkCol(
              "Practices",
              servicesData.map((s) => ({ label: s.title, href: `/services/${s.slug}` }))
            )}

            {linkCol("Platform", [
              { label: "Builders Community", href: "/community" },
              { label: "Project Calculator", href: "/quote" },
              { label: "Cloud Migration", href: "/services/it-cloud" },
              { label: "Enterprise Apps", href: "/services/application-development" },
            ])}

            {linkCol("Company", [
              { label: "About", href: "/about" },
              { label: "Team", href: "/team" },
              { label: "Contact", href: "/contact" },
              ...allPhones(siteConfig).map((p) => ({ label: p, href: telHref(p) })),
              ...allEmails(siteConfig).map((e) => ({ label: e, href: `mailto:${e}` })),
            ])}
          </div>

          {/* Meta strip */}
          <div className="mt-10 flex flex-col gap-4 border-t border-hairline pt-6 md:mt-14 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {LEGAL_NAME}. Noida, India — serving global clients.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="inline-flex items-center gap-1 font-medium text-foreground hover:text-[#E61E32]"
              >
                {siteConfig.contactEmail} <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Giant halftone wordmark sign-off */}
      <HalftoneWordmarkFooter
        wordmark="iforge"
        // The copyright line above already carries the name — no second one here.
        label=""
        meta=""
        columns={[]}
        preset="night"
        palette={{ background: "#050505", ink: "#e9e4da", warm: "#E61E32" }}
        // Scales with the screen so phones don't get a tall empty band above the word.
        height="clamp(220px, 34vw, 600px)"
      />
    </div>
  );
}
