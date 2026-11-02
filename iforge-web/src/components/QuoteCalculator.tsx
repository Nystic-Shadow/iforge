"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSiteContent } from "@/components/SiteContentProvider";
import { ArrowRight, ArrowLeft, Check } from "reicon-react";

const INPUT =
  "w-full border border-hairline bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-[#E61E32] focus:outline-none";
const LABEL =
  "mb-2 block font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground";

export default function QuoteCalculator() {
  const { services: servicesData } = useSiteContent();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(servicesData[0].slug);
  const [scope, setScope] = useState("mid");
  const [timeline, setTimeline] = useState("1-3months");
  const [budget, setBudget] = useState("");
  const [clientInfo, setClientInfo] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const scopeOptions = [
    { id: "startup", title: "Startup / Pilot", desc: "Targeted MVP, architectural review, or initial PoC prototype" },
    { id: "mid", title: "Mid-Market Growth", desc: "Production rollout, cloud migration, or dedicated team scaling" },
    { id: "enterprise", title: "Enterprise Overhaul", desc: "Multi-system overhaul, 24/7 managed support, and compliance" },
  ];

  const timelineOptions = [
    { id: "urgent", title: "Urgent (< 1 month)", desc: "Immediate sprint kick-off with priority allocation" },
    { id: "1-3months", title: "1 – 3 months", desc: "Standard agile delivery with bi-weekly milestones" },
    { id: "flexible", title: "Flexible / ongoing", desc: "Continuous retainer or long-term augmentation" },
  ];

  const currentServiceObj = servicesData.find((s) => s.slug === selectedService) || servicesData[0];
  const currentScopeObj = scopeOptions.find((s) => s.id === scope) || scopeOptions[1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "quote",
          name: clientInfo.name,
          email: clientInfo.email,
          phone: clientInfo.phone,
          service: currentServiceObj.title,
          scope: currentScopeObj.title,
          budget,
          timeline: timelineOptions.find((t) => t.id === timeline)?.title,
          message: clientInfo.notes,
          page: window.location.pathname,
          website: honeypot,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong — please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const stepAnim = {
    initial: { opacity: 0, x: 16 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -16 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  };

  // Reusable option tile
  const Tile = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`border p-4 text-left transition-colors ${
        active
          ? "border-[#E61E32] bg-accent"
          : "border-hairline bg-background hover:border-[#E61E32]/50"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="mx-auto max-w-4xl border border-hairline">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline p-6 sm:p-8">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">Project estimator</h2>
          <p className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
            Step {step} of 3
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`h-px transition-all duration-300 ${
                s === step ? "w-8 bg-[#E61E32]" : s < step ? "w-4 bg-foreground" : "w-4 bg-hairline"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {!submitted ? (
          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="s1" {...stepAnim} className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Select your primary service</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose the core discipline you need assistance with.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {servicesData.map((s) => {
                    const active = selectedService === s.slug;
                    return (
                      <Tile key={s.id} active={active} onClick={() => setSelectedService(s.slug)}>
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border ${
                              active ? "border-[#E61E32] bg-[#E61E32] text-white" : "border-hairline"
                            }`}
                          >
                            {active && <Check className="h-2.5 w-2.5" strokeWidth={2.5} />}
                          </span>
                          <div>
                            <div className="text-sm font-semibold text-foreground">{s.title}</div>
                            <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                              {s.shortDesc}
                            </div>
                          </div>
                        </div>
                      </Tile>
                    );
                  })}
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="group inline-flex items-center gap-2 bg-foreground px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-[#E61E32]"
                  >
                    Continue <ArrowRight className="h-4 w-4 arrow-nudge" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="s2" {...stepAnim} className="space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Scale &amp; delivery horizon</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Help us gauge team requirements, infrastructure scale, and urgency.
                  </p>
                </div>

                <div>
                  <label className={LABEL}>Target scope</label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {scopeOptions.map((opt) => (
                      <Tile key={opt.id} active={scope === opt.id} onClick={() => setScope(opt.id)}>
                        <div className="text-sm font-semibold text-foreground">{opt.title}</div>
                        <div className="mt-2 text-[0.7rem] leading-snug text-muted-foreground">
                          {opt.desc}
                        </div>
                      </Tile>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={LABEL}>Budget (any currency, optional)</label>
                  <input
                    type="text"
                    maxLength={60}
                    placeholder="e.g. ₹10 lakh, $25,000, €20k"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className={INPUT}
                  />
                </div>

                <div>
                  <label className={LABEL}>Delivery horizon</label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {timelineOptions.map((opt) => (
                      <Tile
                        key={opt.id}
                        active={timeline === opt.id}
                        onClick={() => setTimeline(opt.id)}
                      >
                        <div className="text-sm font-semibold text-foreground">{opt.title}</div>
                        <div className="mt-2 text-[0.7rem] leading-snug text-muted-foreground">
                          {opt.desc}
                        </div>
                      </Tile>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-hairline pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="group inline-flex items-center gap-2 bg-foreground px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-[#E61E32]"
                  >
                    Review <ArrowRight className="h-4 w-4 arrow-nudge" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.form key="s3" {...stepAnim} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Summary &amp; dispatch</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter your details to receive your formal proposal.
                  </p>
                </div>

                {/* Summary */}
                <div className="border border-hairline">
                  {[
                    ["Discipline", currentServiceObj.title],
                    ["Scope", currentScopeObj.title],
                    ["Budget", budget.trim()],
                    ["Timeline", timelineOptions.find((t) => t.id === timeline)?.title || ""],
                  ]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between border-b border-hairline px-5 py-3 text-sm last:border-b-0"
                    >
                      <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                        {k}
                      </span>
                      <span className="font-semibold text-foreground">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={LABEL}>Your name *</label>
                    <input
                      type="text"
                      required
                      placeholder="David Miller"
                      value={clientInfo.name}
                      onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                      className={INPUT}
                    />
                  </div>
                  <div>
                    <label className={LABEL}>Work email *</label>
                    <input
                      type="email"
                      required
                      placeholder="david@company.com"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      className={INPUT}
                    />
                  </div>
                </div>

                <div>
                  <label className={LABEL}>Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 99718 66720"
                    value={clientInfo.phone}
                    onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                    className={INPUT}
                  />
                </div>

                <div>
                  <label className={LABEL}>Technical requirements (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Existing cloud provider, compliance mandates (SOC 2, ISO 27001), or tech stacks…"
                    value={clientInfo.notes}
                    onChange={(e) => setClientInfo({ ...clientInfo, notes: e.target.value })}
                    className={`${INPUT} resize-y`}
                  />
                </div>

                {/* Hidden from people; bots that fill every field get politely ignored. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                {error && (
                  <p role="alert" className="border border-[#E61E32]/40 bg-accent px-4 py-3 text-sm text-foreground">
                    {error}
                  </p>
                )}

                <div className="flex items-center justify-between border-t border-hairline pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="group inline-flex items-center gap-2 bg-[#E61E32] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#C81426] disabled:opacity-60"
                  >
                    {sending ? "Sending…" : "Dispatch request"}
                    {!sending && <ArrowRight className="h-4 w-4 arrow-nudge" />}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center py-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center border border-[#E61E32]/40 bg-accent text-[#E61E32]">
              <Check className="h-7 w-7" />
            </span>
            <h3 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
              Proposal requested
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Thank you, <span className="font-semibold text-foreground">{clientInfo.name}</span>. We&apos;ll
              review your <strong className="text-foreground">{currentServiceObj.title}</strong> request
              and reply by email.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setBudget("");
                setClientInfo({ name: "", email: "", phone: "", notes: "" });
              }}
              className="mt-7 border border-hairline px-5 py-2.5 text-xs font-semibold text-foreground transition-colors hover:border-[#E61E32] hover:text-[#E61E32]"
            >
              Start another estimate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
