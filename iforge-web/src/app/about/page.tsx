import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { Reveal, Stagger, RevealItem } from "@/components/ui/reveal";
import { ArrowRight } from "reicon-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about iForge Technologies — our engineering mission, the principles we work by, and the people building resilient systems for enterprises.",
};

export default async function AboutPage() {
  const { valueProps, timeline: companyTimeline } = await getContent();
  return (
    <div className="w-full bg-background">
      {/* Hero */}
      <section className="border-b border-hairline">
        <div className="container-page pt-20 pb-16 sm:pt-28 sm:pb-24">
          <Reveal>
            <p className="eyebrow mb-6">About iForge</p>
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Engineering{" "}
              <span className="text-[#E61E32]">resilient systems</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              We are a team of architects, engineers, and security specialists building
              production-grade cloud, AI, and application systems for enterprises that demand
              reliability at scale.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="section border-b border-hairline">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow mb-5">What we stand for</p>
            <h2 className="max-w-2xl text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Principles over promises
            </h2>
          </Reveal>
          <Stagger
            className={`mt-14 grid gap-px overflow-hidden border border-hairline bg-hairline ${
              valueProps.length % 3 === 0 ? "sm:grid-cols-3" : "sm:grid-cols-2"
            }`}
          >
            {valueProps.map((v, i) => (
              <RevealItem key={v.title}>
                <div className="h-full bg-background p-8 sm:p-10">
                  <span className="font-mono text-sm text-[#E61E32]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {v.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Timeline — only once real milestones are added in Admin → Content → About */}
      {companyTimeline.length > 0 && (
      <section className="section border-b border-hairline bg-muted">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow mb-5">Trajectory</p>
            <h2 className="max-w-2xl text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              From infrastructure advisory to AI engineering
            </h2>
          </Reveal>
          <Stagger className="mt-14 border-t border-hairline">
            {companyTimeline.map((t) => (
              <RevealItem key={t.year}>
                <div className="grid gap-4 border-b border-hairline py-8 md:grid-cols-[160px_1fr] md:gap-10">
                  <div className="font-mono text-2xl font-bold tabular-nums text-[#E61E32]">
                    {t.year}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {t.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {t.description}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>
      )}

      {/* CTA */}
      <section className="section">
        <div className="container-page">
          <Reveal>
            <div className="flex flex-col gap-6 border border-hairline p-10 sm:flex-row sm:items-center sm:justify-between sm:p-14">
              <h2 className="max-w-lg text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Let&apos;s architect your next system together.
              </h2>
              <Link
                href="/contact"
                className="group inline-flex shrink-0 items-center gap-2 bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-[#E61E32]"
              >
                Contact the team
                <ArrowRight className="h-4 w-4 arrow-nudge" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
