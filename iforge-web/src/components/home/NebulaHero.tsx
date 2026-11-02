"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "reicon-react";
import HalftoneNebula, { type NebulaParams } from "@/components/ui/halftone-nebula";

// Tuned toward the iForge brand: crimson #E61E32 as the hot accent, deep
// near-black void, planet pushed clear of the headline.
const SKY: Partial<NebulaParams> = {
  crimsonColor: "#b11226",
  hotColor: "#e61e32",
  wineColor: "#4a0d19",
  duskColor: "#2a1030",
  starColor: "#f4e9ea",
  planetX: 0.8,
  planetY: 0.24,
  planetRadius: 0.07,
  band: 0.6,
  bandAngle: 0.7,
  seed: 7,
};

// Short labels for the practice strip; other services show their full title.
const SHORT_LABELS: Record<string, string> = {
  "ai-ml": "AI & ML",
  "it-cloud": "Cloud & IT",
  "cybersecurity-services": "Cybersecurity",
  "application-development": "App Development",
};

export default function NebulaHero({ services }: { services: { slug: string; title: string }[] }) {
  const practices = services.map((s) => SHORT_LABELS[s.slug] ?? s.title);
  return (
    <HalftoneNebula params={SKY} height="100svh" className="border-b border-hairline">
      <div className="container-page flex h-full flex-col justify-between py-8">
        {/* Top meta line */}
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-[#f4e9ea]/55">
          <span>iForge Technologies</span>
          <span className="hidden sm:inline">Enterprise IT · Cloud · AI</span>
        </div>

        {/* Headline block */}
        <div className="max-w-3xl">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.32em] text-[#e61e32]">
            ✦ IT services &amp; consulting
          </p>
          <h1 className="text-[2.8rem] font-bold leading-[0.98] tracking-tight text-[#f4e9ea] sm:text-6xl lg:text-7xl">
            Accelerating enterprise
            <br />
            success with{" "}
            <span className="text-[#e61e32]">intelligent IT.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#f4e9ea]/60">
            From multi-cloud architecture and zero-trust cybersecurity to AI &amp; ML systems and
            high-performance application engineering — we build resilient digital infrastructure
            that scales.
          </p>

          <div className="pointer-events-auto mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/quote"
              className="group inline-flex items-center gap-2 bg-[#e61e32] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#f4e9ea] hover:text-[#050309]"
            >
              Calculate project scope
              <ArrowRight className="h-4 w-4 arrow-nudge" />
            </Link>
            <Link
              href="/#services"
              className="inline-flex items-center gap-2 border border-[#f4e9ea]/25 px-6 py-3.5 text-sm font-semibold text-[#f4e9ea] transition-colors hover:border-[#e61e32] hover:text-[#e61e32]"
            >
              Explore {services.length} practices
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#f4e9ea]/60 transition-colors hover:text-[#f4e9ea]"
            >
              Builders community <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Practice strip */}
        <div className="pointer-events-auto flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f4e9ea]/50">
          {practices.map((p, i) => (
            <Link
              key={p}
              href="/#services"
              className="inline-flex items-center gap-2 transition-colors hover:text-[#e61e32]"
            >
              <span className="text-[#e61e32]">{String(i + 1).padStart(2, "0")}</span>
              {p}
            </Link>
          ))}
        </div>
      </div>
    </HalftoneNebula>
  );
}
