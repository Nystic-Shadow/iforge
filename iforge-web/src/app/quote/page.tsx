import React from "react";
import type { Metadata } from "next";
import QuoteCalculator from "@/components/QuoteCalculator";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Request a Quote & Project Estimator",
  description:
    "Calculate an estimated project scope and request an architectural consultation with iForge Technologies.",
};

export default function QuotePage() {
  return (
    <div className="w-full bg-background">
      <section className="border-b border-hairline">
        <div className="container-page pt-20 pb-14 sm:pt-28 sm:pb-16">
          <Reveal>
            <p className="eyebrow mb-6">Transparent scoping</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Calculate your project estimate
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground">
              Configure your technical discipline, team size, and timeline to receive a preliminary
              architectural overview — no commitment required.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <Reveal>
            <QuoteCalculator />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
