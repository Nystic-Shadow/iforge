"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "reicon-react";
import { servicesData, type ServiceItem } from "@/data/siteData";
import { Reveal, Stagger, RevealItem } from "@/components/ui/reveal";

const COUNT_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

export default function ServicesMinimal({ services = servicesData }: { services?: ServiceItem[] }) {
  return (
    <section id="services" className="section border-b border-hairline">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-5">Practices</p>
              <h2 className="max-w-xl text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Engineered for uncompromising scale
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {COUNT_WORDS[services.length] ?? services.length} core enterprise practice groups
              delivering full-lifecycle cloud architecture, machine-learning systems,
              cybersecurity, application engineering, and digital marketing.
            </p>
          </div>
        </Reveal>

        {/* Numbered list of practices — hairline rows, hover slide */}
        <Stagger className="mt-14 border-t border-hairline">
          {services.map((s, i) => (
            <RevealItem key={s.id}>
              <Link
                href={`/services/${s.slug}`}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-hairline py-7 transition-colors hover:bg-muted sm:gap-8 sm:py-8"
              >
                <span className="font-mono text-sm tabular-nums text-[#E61E32]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-[#E61E32] sm:text-2xl">
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                      {s.title}
                    </span>
                  </h3>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground line-clamp-1">
                    {s.shortDesc}
                  </p>
                  {/* Tech chips, revealed on hover for desktop */}
                  <div className="mt-3 hidden flex-wrap gap-1.5 md:flex">
                    {s.technologies.slice(0, 5).map((t) => (
                      <span
                        key={t}
                        className="border border-hairline px-2 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowUpRight className="h-6 w-6 shrink-0 text-muted-foreground transition-all duration-300 group-hover:text-[#E61E32] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </RevealItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <p className="mt-10 text-sm text-muted-foreground">
            Looking for a hybrid or bespoke engagement?{" "}
            <Link href="/quote" className="link-underline font-medium text-foreground">
              Request an architectural audit →
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
