import { after } from "next/server";
import { createInquiry, type NewInquiry } from "@/lib/inquiries";
import { notifyHermes } from "@/lib/hermes";
import { emailNewInquiry } from "@/lib/email";

// Public endpoint the contact and quote forms post to.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Light abuse guard: 5 enquiries per address per 10 minutes, per server instance.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const t = Date.now();
  const recent = (hits.get(ip) ?? []).filter((x) => t - x < WINDOW_MS);
  recent.push(t);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: a hidden field real people never fill in. Pretend success.
  if (str(body.website, 200)) return Response.json({ ok: true, ticket: "IF-0000" });

  const ip = (request.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  if (limited(ip)) {
    return Response.json(
      { ok: false, error: "Too many requests — please try again in a few minutes." },
      { status: 429 },
    );
  }

  const source = body.source === "quote" ? "quote" : "contact";
  const input: NewInquiry = {
    source,
    name: str(body.name, 120),
    email: str(body.email, 200),
    phone: str(body.phone, 40) || undefined,
    company: str(body.company, 120) || undefined,
    service: str(body.service, 80) || undefined,
    budget: str(body.budget, 60) || undefined,
    scope: str(body.scope, 120) || undefined,
    timeline: str(body.timeline, 60) || undefined,
    message: str(body.message, 5000),
    page: str(body.page, 200) || undefined,
  };

  if (!input.name) return Response.json({ ok: false, error: "Please add your name." }, { status: 400 });
  if (!EMAIL.test(input.email)) {
    return Response.json({ ok: false, error: "Please add a valid email." }, { status: 400 });
  }
  if ((input.phone?.replace(/\D/g, "").length ?? 0) < 7) {
    return Response.json({ ok: false, error: "Please add a valid phone number." }, { status: 400 });
  }
  if (source === "contact" && !input.message) {
    return Response.json({ ok: false, error: "Please tell us about your project." }, { status: 400 });
  }

  try {
    const inquiry = await createInquiry(input);
    // After responding: email the team and the sender, then hand it to Hermes.
    // Run in sequence — each appends to the same enquiry's activity log.
    after(async () => {
      await emailNewInquiry(inquiry);
      await notifyHermes(inquiry);
    });
    return Response.json({ ok: true, ticket: inquiry.ticket });
  } catch (e) {
    console.error("inquiry save failed:", e);
    return Response.json(
      { ok: false, error: "We couldn't save your message — please email us instead." },
      { status: 500 },
    );
  }
}
