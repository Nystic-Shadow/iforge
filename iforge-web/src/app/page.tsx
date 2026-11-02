import React from "react";
import type { Metadata } from "next";
import NebulaHero from "@/components/home/NebulaHero";
import ServicesMinimal from "@/components/home/ServicesMinimal";
import ApproachMinimal from "@/components/home/ApproachMinimal";
import TechStackMinimal from "@/components/home/TechStackMinimal";
import HomeQuoteTeaser from "@/components/home/HomeQuoteTeaser";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { siteConfig } = await getContent();
  return {
    title: `${siteConfig.name} | Enterprise IT Services, Cloud Architecture & AI Consulting`,
    description:
      "Enterprise IT services and consulting: cloud architecture on AWS and Google Cloud, cybersecurity, AI & ML advisory, digital marketing, and custom application engineering.",
  };
}

export default async function HomePage() {
  const { services, techCapabilities } = await getContent();
  return (
    <div className="w-full overflow-hidden">
      <NebulaHero services={services.map(({ slug, title }) => ({ slug, title }))} />
      <ServicesMinimal services={services} />
      <ApproachMinimal />
      <TechStackMinimal capabilities={techCapabilities} />
      <HomeQuoteTeaser services={services} />
    </div>
  );
}
