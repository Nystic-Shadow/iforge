"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "reicon-react";
import { servicesData, type ServiceItem } from "@/data/siteData";
import { Reveal } from "@/components/ui/reveal";

export default function HomeQuoteTeaser({
  services = servicesData,
}: {
  services?: ServiceItem[];
}) {
  const servicesList = services;
  const [selectedService, setSelectedService] = useState("it-cloud");
  const [timeline, setTimeline] = useState("medium");

  const estimates: Record<string, { duration: string; team: string }> = {
    short: { duration: "2–4 weeks", team: "2–3 engineers" },
    medium: { duration: "1–3 months", team: "3–5 specialists" },
    large: { duration: "3–6+ months", team: "Dedicated pod (6+)" },
  };

  const currentEst = estimates[timeline];
  const serviceObj = servicesList.find((s) => s.slug === selectedService) || servicesList[0];

  const INPUT =
    "w-full border border-hairline bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors focus:border-[#E61E32] focus:outline-none";

  return (
    <section className="section">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
        {/* Context */}
        <Reveal>
          <p className="eyebrow mb-5">Transparent estimation</p>
          <h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Estimate your next initiative in 30 seconds
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            No black-box pricing. Select your practice area and delivery horizon for an immediate
            preliminary scope and architecture breakdown.
          </p>
          <ul className="mt-8 space-y-3 border-t border-hairline pt-6 text-sm text-muted-foreground">
            {[
              "Zero obligation — scoping session included",
              "Flexible — fixed-scope deliverables or dedicated pods",
            ].map((p) => (
              <li key={p} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#E61E32]" />
                {p}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Calculator */}
        <Reveal direction="left">
          <div className="border border-hairline p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <label className="mb-2 block font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  01 — Enterprise practice
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className={INPUT}
                >
                  {servicesList.map((s) => (
                    <option key={s.id} value={s.slug}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  02 — Project horizon
                </label>
                <div className="grid grid-cols-3 gap-px overflow-hidden border border-hairline bg-hairline">
                  {[
                    { id: "short", label: "Sprint" },
                    { id: "medium", label: "Quarter" },
                    { id: "large", label: "Enterprise" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTimeline(opt.id)}
                      className={`py-3 text-xs font-semibold transition-colors ${
                        timeline === opt.id
                          ? "bg-foreground text-background"
                          : "bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outcome */}
              <div className="border border-hairline">
                <div className="flex items-center justify-between border-b border-hairline px-5 py-3 text-xs">
                  <span className="font-mono uppercase tracking-wider text-muted-foreground">
                    Practice
                  </span>
                  <span className="font-semibold text-foreground">{serviceObj.title}</span>
                </div>
                <div className="grid grid-cols-2 divide-x divide-hairline">
                  <div className="px-5 py-4">
                    <div className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                      Delivery
                    </div>
                    <div className="mt-1 text-lg font-bold text-[#E61E32]">{currentEst.duration}</div>
                  </div>
                  <div className="px-5 py-4">
                    <div className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                      Squad
                    </div>
                    <div className="mt-1 text-lg font-bold text-foreground">{currentEst.team}</div>
                  </div>
                </div>
              </div>

              <Link
                href={`/quote?service=${selectedService}&timeline=${timeline}`}
                className="group inline-flex w-full items-center justify-center gap-2 bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-[#E61E32]"
              >
                Launch full cost wizard
                <ArrowRight className="h-4 w-4 arrow-nudge" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
