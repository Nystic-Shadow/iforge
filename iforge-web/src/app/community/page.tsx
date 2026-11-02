import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import GithubSkyline from "@/components/community/GithubSkyline";
import { Reveal, Stagger, RevealItem } from "@/components/ui/reveal";
import { ArrowRight } from "reicon-react";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Builders Community",
  description:
    "Where engineers, architects, and creators ship cutting-edge technology and share production architectures.",
};

export default async function CommunityPage() {
  const { community } = await getContent();
  const TRACKS = community.tracks;
  // Only show the live-activity section once GitHub is actually connected —
  // visitors should never see setup instructions.
  const githubUser = community.githubUsername || process.env.GITHUB_USERNAME;
  const githubReady = Boolean(process.env.GITHUB_TOKEN && githubUser);
  return (
    <div className="w-full bg-background">
      {/* Hero */}
      <section className="border-b border-hairline">
        <div className="container-page pt-20 pb-16 sm:pt-28 sm:pb-20">
          <Reveal>
            <p className="eyebrow mb-6">Builders community</p>
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              {community.headline}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {community.intro}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-[#E61E32]"
              >
                Join the community
                <ArrowRight className="h-4 w-4 arrow-nudge" />
              </Link>
              <Link
                href="#tracks"
                className="inline-flex items-center gap-2 border border-hairline px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-[#E61E32] hover:text-[#E61E32]"
              >
                Explore tracks
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Live GitHub contribution skyline */}
      {githubReady && (
      <section className="section border-b border-hairline bg-muted">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow mb-5">Live activity</p>
            <h2 className="max-w-2xl text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              A year of shipping, in real time
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              Our contribution graph, synced live from GitHub — flat heat map or isometric skyline.
              Toggle the view, hover a day, or drag to orbit.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12">
              <GithubSkyline username={community.githubUsername || undefined} />
            </div>
          </Reveal>
        </div>
      </section>
      )}

      {/* Tracks */}
      <section id="tracks" className="section">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow mb-5">Community tracks</p>
            <h2 className="max-w-2xl text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Collaborative learning &amp; hackathons
            </h2>
          </Reveal>

          <Stagger className="mt-14 grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-2">
            {TRACKS.map((t, i) => (
              <RevealItem key={t.title}>
                <div className="group h-full bg-background p-8 transition-colors hover:bg-muted sm:p-10">
                  <span className="font-mono text-sm text-[#E61E32]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
                    {t.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  );
}
