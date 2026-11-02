"use client";

import React from "react";
import { siteConfig as defaultSiteConfig, servicesData, type ServiceItem } from "@/data/siteData";
import type { SiteConfig } from "@/lib/content";

/**
 * The admin-editable content that client components (nav, footer, forms)
 * need. The root layout fills it from getContent(), so admin edits reach them;
 * the code defaults are only a fallback outside the provider.
 */

export type ServiceLink = Pick<ServiceItem, "id" | "slug" | "title" | "shortDesc">;

export interface SiteContentValue {
  siteConfig: SiteConfig;
  services: ServiceLink[];
}

const SiteContentContext = React.createContext<SiteContentValue>({
  siteConfig: defaultSiteConfig,
  services: servicesData.map(({ id, slug, title, shortDesc }) => ({ id, slug, title, shortDesc })),
});

export function SiteContentProvider({
  value,
  children,
}: {
  value: SiteContentValue;
  children: React.ReactNode;
}) {
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): SiteContentValue {
  return React.useContext(SiteContentContext);
}
