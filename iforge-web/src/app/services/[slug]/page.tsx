import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getContent } from "@/lib/content";
import ServiceFaqAccordion from "@/components/services/ServiceFaqAccordion";
import ContactForm from "@/components/ContactForm";
import { Reveal, Stagger, RevealItem } from "@/components/ui/reveal";
import { ArrowRight, ArrowUpRight } from "reicon-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { services } = await getContent();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { services } = await getContent();
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: service.title,
    description: service.shortDesc,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const { services } = await getContent();
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const related = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <div className="w-full bg-background">
      {/* Hero */}
      <section className="border-b border-hairline">
        <div className="container-page pt-16 pb-14 sm:pt-20 sm:pb-20">
          <Reveal>
            <nav className="mb-8 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link href="/#services" className="hover:text-foreground">Services</Link>
              <span>/</span>
              <span className="text-[#E61E32]">{service.title}</span>
            </nav>
          </Reveal>

          <div className={`grid gap-12 lg:items-end ${service.metrics.length ? "lg:grid-cols-[1.4fr_1fr]" : ""}`}>
            <div>
              <Reveal>
                <p className="eyebrow mb-6">Enterprise practice</p>
                <h1 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {service.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg font-medium text-[#E61E32]">
                  {service.subtitle}
                </p>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                  {service.longDesc}
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href={`/quote?service=${service.slug}`}
                    className="group inline-flex items-center gap-2 bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-[#E61E32]"
                  >
                    Request architectural scope
                    <ArrowRight className="h-4 w-4 arrow-nudge" />
                  </Link>
                  <a
                    href="#consultation"
                    className="inline-flex items-center gap-2 border border-hairline px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-[#E61E32] hover:text-[#E61E32]"
                  >
                    Book discovery call
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Metrics — only real figures, added in Admin → Content → Services */}
            {service.metrics.length > 0 && (
              <Reveal direction="left">
                <div className="grid gap-px overflow-hidden border border-hairline bg-hairline">
                  {service.metrics.map((m) => (
                    <div key={m.label} className="bg-background p-6">
                      <div className="text-3xl font-bold tracking-tight text-foreground">{m.value}</div>
                      <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="section border-b border-hairline">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow mb-5">Capabilities</p>
            <h2 className="max-w-2xl text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              Core practice offerings
            </h2>
          </Reveal>

          <Stagger className="mt-12 grid gap-px overflow-hidden border border-hairline bg-hairline md:grid-cols-3">
            {service.offerings.map((o, idx) => (
              <RevealItem key={o.title}>
                <div className="flex h-full flex-col bg-background p-8">
                  <span className="font-mono text-sm text-[#E61E32]">{String(idx + 1).padStart(2, "0")}</span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">{o.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{o.description}</p>
                  {o.points && o.points.length > 0 && (
                    <ul className="mt-6 space-y-2.5 border-t border-hairline pt-5">
                      {o.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2.5 text-sm text-foreground">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#E61E32]" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Deliverables + Tech */}
      <section className="section border-b border-hairline bg-muted">
        <div className="container-page grid gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-5">What you receive</p>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">Guaranteed deliverables</h3>
            <ul className="mt-8 border-t border-hairline">
              {service.deliverables.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-3 border-b border-hairline py-4 text-sm font-medium text-foreground"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#E61E32]" />
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal direction="left">
            <p className="eyebrow mb-5">Toolchain &amp; standards</p>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">Frameworks we use</h3>
            <div className="mt-8 flex flex-wrap gap-2">
              {service.technologies.map((t) => (
                <span
                  key={t}
                  className="border border-hairline bg-background px-3 py-1.5 font-mono text-xs text-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <ul className="mt-10 space-y-3 border-t border-hairline pt-6">
              {service.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[#E61E32]" />
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section border-b border-hairline">
        <div className="container-page max-w-3xl">
          <Reveal>
            <p className="eyebrow mb-5">Questions</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently asked
            </h2>
          </Reveal>
          <div className="mt-10">
            <ServiceFaqAccordion faqs={service.faqs} />
          </div>
        </div>
      </section>

      {/* Consultation */}
      <section id="consultation" className="section border-b border-hairline bg-muted">
        <div className="container-page max-w-3xl">
          <Reveal>
            <p className="eyebrow mb-5">Talk to an architect</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Schedule a {service.title} consultation
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Speak directly with an iForge Principal Architect to scope requirements, review
              security posture, or request a proposal.
            </p>
          </Reveal>
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="section">
        <div className="container-page">
          <Reveal>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Related practices</h3>
              <Link href="/#services" className="link-underline text-sm font-medium text-foreground">
                View all →
              </Link>
            </div>
          </Reveal>
          <Stagger className="mt-10 grid gap-px overflow-hidden border border-hairline bg-hairline md:grid-cols-3">
            {related.map((r, i) => (
              <RevealItem key={r.id}>
                <Link
                  href={`/services/${r.slug}`}
                  className="group flex h-full flex-col bg-background p-8 transition-colors hover:bg-muted"
                >
                  <span className="font-mono text-sm text-[#E61E32]">{String(i + 1).padStart(2, "0")}</span>
                  <h4 className="mt-4 flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-[#E61E32]">
                    {r.title}
                    <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {r.shortDesc}
                  </p>
                </Link>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  );
}
