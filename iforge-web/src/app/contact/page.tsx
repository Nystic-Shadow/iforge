import React from "react";
import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { getContent } from "@/lib/content";
import { allEmails, allPhones, telHref } from "@/data/siteData";
import { Reveal } from "@/components/ui/reveal";
import { ArrowUpRight } from "reicon-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Talk to iForge's architects and engineers about your enterprise IT, cloud, AI and security projects.",
};

export default async function ContactPage() {
  const { siteConfig } = await getContent();
  const CHANNELS = [
    { label: "Email", items: allEmails(siteConfig).map((e) => ({ value: e, href: `mailto:${e}` })) },
    { label: "Phone", items: allPhones(siteConfig).map((p) => ({ value: p, href: telHref(p) })) },
    { label: "Studio", items: [{ value: "Noida, India — serving global clients", href: null }] },
  ].filter((c) => c.items.length > 0);

  return (
    <div className="w-full bg-background">
      <section className="border-b border-hairline">
        <div className="container-page grid gap-16 pt-20 pb-16 sm:pt-28 sm:pb-24 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          {/* Left: intro + channels */}
          <div>
            <Reveal>
              <p className="eyebrow mb-6">Contact</p>
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Let&apos;s talk about your{" "}
                <span className="text-[#E61E32]">infrastructure</span>
              </h1>
              <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
                Speak directly with a Principal Architect — no sales funnel. Scope requirements,
                review your security posture, or request a proposal.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="mt-12 border-t border-hairline">
                {CHANNELS.map((c) => (
                  <div
                    key={c.label}
                    className="grid grid-cols-[88px_1fr] items-baseline gap-3 border-b border-hairline py-4"
                  >
                    <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                      {c.label}
                    </dt>
                    <dd className="flex flex-col items-start gap-1.5 text-sm font-medium text-foreground">
                      {c.items.map((item, i) =>
                        item.href ? (
                          <a
                            key={i}
                            href={item.href}
                            className="inline-flex items-center gap-1 hover:text-[#E61E32]"
                          >
                            {item.value}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span key={i}>{item.value}</span>
                        ),
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Right: form */}
          <Reveal direction="left">
            <div className="border border-hairline p-8 sm:p-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
