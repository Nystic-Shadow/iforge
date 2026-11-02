import "server-only";
import { cache } from "react";
import { createHash } from "crypto";
import {
  siteConfig as defaultSiteConfig,
  servicesData as defaultServices,
  valueProps as defaultValueProps,
  techCapabilities as defaultTech,
  companyTimeline as defaultTimeline,
  type ServiceItem,
} from "@/data/siteData";

export type { ServiceItem };
import {
  getSupabase,
  getSupabaseAdmin,
  isSupabaseConfigured,
  hasServiceRoleKey,
  CONTENT_TABLE,
  CONTENT_ID,
} from "@/lib/supabase";
import { readJson, writeJson, withLock, isEphemeralStorage } from "@/lib/local-store";

// ---- The shape of everything the admin panel can edit ----

export interface SiteConfig {
  name: string;
  tagline: string;
  headline: string;
  subheadline: string;
  contactEmail: string;
  phone: string;
  address: string;
  founded: string;
  extraEmails: string[];
  extraPhones: string[];
}

export interface ValueProp {
  title: string;
  description: string;
  icon: string;
}

export interface TechCapability {
  category: string;
  items: string[];
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

export interface CommunityTrack {
  title: string;
  desc: string;
}

export interface CommunityContent {
  headline: string;
  intro: string;
  githubUsername: string;
  tracks: CommunityTrack[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  /** Image URL — uploaded through the admin panel, or any public link. */
  photo: string;
  linkedin?: string;
  github?: string;
  x?: string;
  /** Shown as a large profile above the grid (e.g. the founder). */
  featured?: boolean;
}

export interface TeamStat {
  value: string;
  label: string;
}

/** The Team page around the member grid. Empty parts are simply not shown. */
export interface TeamPageContent {
  introHeading: string;
  introBody: string;
  introImage: string;
  /** Real figures only — empty by default, so the row stays hidden. */
  stats: TeamStat[];
  /** First part of the quote, set in full colour. */
  quoteLead: string;
  /** The rest of the quote, set in muted grey. */
  quoteRest: string;
  quoteName: string;
  quoteRole: string;
  quotePhoto: string;
}

export interface SiteContent {
  siteConfig: SiteConfig;
  services: ServiceItem[];
  valueProps: ValueProp[];
  techCapabilities: TechCapability[];
  timeline: TimelineEntry[];
  community: CommunityContent;
  /** Real people only — starts empty and is filled from the admin panel. */
  team: TeamMember[];
  teamPage: TeamPageContent;
  /**
   * Slugs of the code's default services this document has already been
   * offered. A service added to siteData later is appended to older documents
   * once; after that, deleting it in the admin sticks.
   */
  knownDefaultServices: string[];
}

// The default services that existed before knownDefaultServices was tracked.
const ORIGINAL_DEFAULT_SERVICES = [
  "ai-ml",
  "cloud-services",
  "it-infrastructure",
  "cybersecurity-services",
  "application-development",
];

// Default services merged into another. Documents saved before the merge get
// the merged service in their place, once (until it's in knownDefaultServices).
const MERGED_SERVICES: Record<string, string> = {
  "cloud-services": "it-cloud",
  "it-infrastructure": "it-cloud",
};

// ---- Defaults, built from the code so the site works with no DB ----

export const defaultContent: SiteContent = {
  siteConfig: { ...defaultSiteConfig },
  services: defaultServices,
  valueProps: defaultValueProps,
  techCapabilities: defaultTech,
  timeline: defaultTimeline,
  community: {
    headline: "Where builders ship together",
    intro:
      "A space for engineers, architects, and creators to share production architectures, review each other's work, and ship in the open.",
    githubUsername: process.env.GITHUB_USERNAME || "",
    tracks: [
      {
        title: "AI & ML Innovation",
        desc: "RAG architectures, local model inference, LangChain pipelines, and vector database optimization.",
      },
      {
        title: "Cloud & DevOps",
        desc: "Multi-region Kubernetes, Terraform IaC modules, FinOps cost cutting, and continuous delivery.",
      },
      {
        title: "Application Development",
        desc: "Next.js App Router, React 19 server components, cross-platform mobile, and real-time dashboards.",
      },
      {
        title: "Cybersecurity & Zero Trust",
        desc: "VAPT challenges, ethical hacking walkthroughs, cloud security audits, and SOC 2 frameworks.",
      },
    ],
  },
  team: [],
  teamPage: {
    introHeading: "Who we are",
    introBody:
      "We are a team of architects, engineers, and security specialists building production-grade cloud, AI, and application systems for enterprises that demand reliability at scale.",
    introImage: "",
    stats: [],
    quoteLead: "",
    quoteRest: "",
    quoteName: "",
    quoteRole: "",
    quotePhoto: "",
  },
  knownDefaultServices: defaultServices.map((s) => s.slug),
};

// Fingerprints of earlier default versions of services whose text has since
// changed in the code. A saved copy that still matches one was never edited
// in the admin, so it's upgraded to the current default (new name, new text).
const OUTDATED_DEFAULTS: Record<string, string[]> = {
  "it-cloud": ["490db527548e6ecd", "e19923a057e11000"],
  "cybersecurity-services": ["87a93125480a757e"],
};

/** JSON with sorted keys, so a fingerprint doesn't depend on key order. */
const stableJson = (v: unknown): string =>
  Array.isArray(v)
    ? `[${v.map(stableJson).join(",")}]`
    : v && typeof v === "object"
      ? `{${Object.keys(v)
          .filter((k) => (v as Record<string, unknown>)[k] !== undefined)
          .sort()
          .map((k) => `${JSON.stringify(k)}:${stableJson((v as Record<string, unknown>)[k])}`)
          .join(",")}}`
      : JSON.stringify(v);

const fingerprint = (v: unknown) => createHash("sha256").update(stableJson(v)).digest("hex").slice(0, 16);

/** Stored services, plus any default service added to the code since this document was saved. */
function mergeServices(stored: Partial<SiteContent>): ServiceItem[] {
  if (!stored.services?.length) return defaultContent.services;
  const known = new Set(stored.knownDefaultServices ?? ORIGINAL_DEFAULT_SERVICES);
  const storedSlugs = new Set(stored.services.map((s) => s.slug));
  const services: ServiceItem[] = [];
  for (const s of stored.services) {
    const into = MERGED_SERVICES[s.slug];
    if (into && !known.has(into)) {
      const merged = defaultContent.services.find((d) => d.slug === into);
      if (merged && !storedSlugs.has(into) && !services.some((x) => x.slug === into)) services.push(merged);
      continue;
    }
    if (OUTDATED_DEFAULTS[s.slug]?.includes(fingerprint(s))) {
      const current = defaultContent.services.find((d) => d.slug === s.slug);
      if (current) {
        services.push(current);
        continue;
      }
    }
    services.push(s);
  }
  const have = new Set(services.map((s) => s.slug));
  const added = defaultContent.services.filter((s) => !known.has(s.slug) && !have.has(s.slug));
  return [...services, ...added];
}

/** Deep-merge a stored partial over the defaults so missing fields never break a page. */
function mergeContent(stored: Partial<SiteContent> | null | undefined): SiteContent {
  if (!stored) return defaultContent;
  return {
    siteConfig: { ...defaultContent.siteConfig, ...(stored.siteConfig || {}) },
    services: mergeServices(stored),
    valueProps: stored.valueProps?.length ? stored.valueProps : defaultContent.valueProps,
    techCapabilities: stored.techCapabilities?.length
      ? stored.techCapabilities
      : defaultContent.techCapabilities,
    timeline: stored.timeline?.length ? stored.timeline : defaultContent.timeline,
    community: { ...defaultContent.community, ...(stored.community || {}) },
    // An empty team is a real state (nobody added yet), so no default swap.
    team: Array.isArray(stored.team) ? stored.team : [],
    teamPage: { ...defaultContent.teamPage, ...(stored.teamPage || {}) },
    knownDefaultServices: defaultContent.knownDefaultServices,
  };
}

/** Where admin edits land: Supabase in production, a local file in dev. */
export const storageMode: "supabase" | "local" = isSupabaseConfigured ? "supabase" : "local";

/** A setup problem that stops admin saves from working, shown in the admin panel. */
export const storageWarning: string | null =
  storageMode === "local" && isEphemeralStorage
    ? "This host doesn't keep files, so edits can't be saved. Connect Supabase (see ADMIN.md)."
    : storageMode === "supabase" && !hasServiceRoleKey
      ? "SUPABASE_SERVICE_ROLE_KEY isn't set, so saves will be refused. Add it on the server."
      : null;

/**
 * The site's content: the stored document from Supabase when configured, else
 * the local `.data/content.json` written by the admin panel, else the code
 * defaults. `error` is set when the store couldn't be read — the content is
 * then the defaults and must not be saved back over the real document.
 */
export async function loadContent(): Promise<{ content: SiteContent; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { content: mergeContent(await readJson<Partial<SiteContent> | null>("content", null)) };
  }
  try {
    const { data, error } = await supabase
      .from(CONTENT_TABLE)
      .select("data")
      .eq("id", CONTENT_ID)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { content: mergeContent(data?.data as Partial<SiteContent> | null) };
  } catch (e) {
    const error = e instanceof Error ? e.message : "Couldn't read content";
    console.error(`[content] read failed, showing defaults: ${error}`);
    return { content: defaultContent, error };
  }
}

/** The content for public pages (once per render). Pages call this instead of importing siteData directly. */
export const getContent = cache(async (): Promise<SiteContent> => (await loadContent()).content);

/** Persist the full content document (admin only). Returns ok + optional error. */
export async function saveContent(
  content: SiteContent,
): Promise<{ ok: boolean; error?: string }> {
  const doc = { ...content, knownDefaultServices: defaultContent.knownDefaultServices };
  const admin = getSupabaseAdmin();
  if (!admin) {
    if (isEphemeralStorage) {
      return {
        ok: false,
        error: "Not saved: this host doesn't keep files. Connect Supabase to save changes (see ADMIN.md).",
      };
    }
    try {
      await withLock("content", () => writeJson("content", doc));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Local save failed" };
    }
  }
  try {
    const { error } = await admin
      .from(CONTENT_TABLE)
      .upsert({ id: CONTENT_ID, data: doc, updated_at: new Date().toISOString() });
    if (error) {
      const hint = hasServiceRoleKey ? "" : " — set SUPABASE_SERVICE_ROLE_KEY on the server";
      return { ok: false, error: error.message + hint };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}
