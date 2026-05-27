"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FadeIn } from "@/components/fade-in";
import { ScoreDot } from "@/components/score-dot";
import type { AuditRequest, AuditResponse } from "@/lib/audit-types";
import { VERDICT_CONFIG, PILLAR_META } from "@/lib/audit-types";
import { cn } from "@/lib/utils";

const LOADING_STEPS = [
  "Locating supplier...",
  "Scraping public capability pages...",
  "Searching certifications and news...",
  "Cross-referencing customer signals...",
  "Running 7-pillar MRS framework...",
  "Generating verdict...",
];

const COMPONENT_CATEGORIES = [
  "Precision machined parts",
  "Gears & transmission components",
  "Sheet metal & fabrication",
  "Castings & forgings",
  "Electromechanical assemblies",
  "Plastics & injection molding",
  "Wire harness & cables",
  "Industrial valves & fluid handling",
  "Motors & drives",
  "Other",
];

const SOURCE_OPTIONS = [
  "China",
  "India",
  "Vietnam",
  "Domestic US",
  "Domestic EU",
  "Other",
];

const SPEND_OPTIONS = ["<$50K", "$50K–$250K", "$250K–$1M", "$1M–$5M", "$5M+"];

const VOLUME_OPTIONS = [
  "One-time / Pilot",
  "Quarterly batches",
  "Monthly recurring",
  "Continuous high-volume",
];

const FULL_AUDIT_ADDS = [
  "On-site factory verification of machines and process flows",
  "Audited financial statements and cash-flow analysis",
  "Reference calls with 3 existing customers in similar applications",
  "Inspection report sample on a comparable part",
  "Capacity reality check against your batch profile",
  "Geographic optimization across logistics + responsiveness",
  "Written report with pilot plan if recommended",
];

function VerdictBadge({ verdict, mrsScore }: { verdict: AuditResponse["verdict"]; mrsScore: number }) {
  const verdictCfg = VERDICT_CONFIG[verdict];
  const label = verdict === "INSUFFICIENT_DATA"
    ? "INSUFFICIENT DATA"
    : `${verdictCfg.label} · MRS ${mrsScore}`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-2 text-white font-mono text-sm font-medium",
        verdictCfg.bgColor
      )}
      aria-label={`Verdict: ${label}`}
    >
      {label}
    </span>
  );
}

function LoadingState({ step }: { step: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 space-y-2"
    >
      {LOADING_STEPS.map((s, i) => (
        <div
          key={s}
          className={cn(
            "flex items-center gap-3 font-mono text-[14px] transition-all duration-300",
            i < step ? "text-muted" : i === step ? "text-foreground" : "text-subtle opacity-40"
          )}
        >
          {i < step && (
            <span className="text-emerald-500">✓</span>
          )}
          {i === step && (
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="inline-block w-1.5 h-1.5 rounded-full bg-accent"
            />
          )}
          {i > step && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-border" />
          )}
          {s}
        </div>
      ))}
    </motion.div>
  );
}

function ResultCard({
  result,
  onReset,
  sourceInput,
}: {
  result: AuditResponse;
  onReset: () => void;
  sourceInput: string;
}) {
  const isCurrentSupplier = sourceInput === "India";
  const insufficientData = result.verdict === "INSUFFICIENT_DATA";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "max-w-[880px] mx-auto rounded-card border bg-white mt-8",
        insufficientData ? "border-gray-300" : "border-border"
      )}
      style={{ padding: "48px" }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-subtle">
          MRS REPORT · {result.auditId}
        </span>
        <span className="font-mono text-[11px] text-subtle">
          Sources: {result.sourcesCount} pages · {result.referencesCount} external references
        </span>
      </div>

      {/* Verdict block */}
      <div className="text-center pb-6">
        <VerdictBadge verdict={result.verdict} mrsScore={result.mrsScore} />
        <p className="text-[20px] md:text-[24px] font-medium tracking-tight leading-[1.3] mt-4 max-w-[600px] mx-auto">
          {result.verdictHeadline}
        </p>
        {isCurrentSupplier && !insufficientData && (
          <p className="text-[13px] font-mono text-muted mt-2">
            Scored as current supplier — baseline verification recommended.
          </p>
        )}
      </div>

      <Separator className="mb-8" />

      {/* 7-pillar scorecard */}
      <div className="space-y-0 mb-8">
        {result.pillars.map((p, i) => {
          const meta = PILLAR_META[p.pillar];
          return (
            <div key={p.pillar} className={cn("py-4", i !== 0 && "border-t border-border")}>
              <div className="flex items-center gap-3 mb-1.5">
                <ScoreDot score={p.score} size={10} />
                <span className="text-[15px] font-medium text-foreground flex-1">
                  {meta.label}
                </span>
                <span className="font-mono text-[13px] text-subtle">{p.weight}%</span>
                <div className="hidden sm:flex items-center gap-1 text-muted text-[13px]">
                  <span className="text-subtle">·················</span>
                </div>
                <span
                  className={cn(
                    "font-mono text-[16px] font-medium w-14 text-right",
                    insufficientData ? "text-gray-400" : "text-foreground"
                  )}
                >
                  {insufficientData ? "—" : `${p.score}/100`}
                </span>
              </div>
              <div className="ml-[22px]">
                <p className="text-[14px] leading-[1.55] text-foreground mb-0.5">{p.finding}</p>
                <p className="font-mono text-[12px] text-subtle">{p.source}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Separator className="mb-6" />

      {/* Bottom line */}
      <div className="rounded-[8px] bg-gray-50 p-6 mb-8">
        <p className="eyebrow mb-3">BOTTOM LINE</p>
        <p className="text-[16px] leading-[1.6] text-foreground">{result.bottomLine}</p>
      </div>

      {/* Strengths / Risks */}
      {!insufficientData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="eyebrow mb-4">STRENGTHS</p>
            <ul className="space-y-2.5">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span className="text-[14px] leading-[1.55] text-foreground">{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">RISKS TO VERIFY</p>
            <ul className="space-y-2.5">
              {result.risks.map((r, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span className="text-[14px] leading-[1.55] text-foreground">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <Separator className="mb-6" />

      {/* What a full audit adds */}
      <div className="mb-8">
        <p className="eyebrow mb-4">WHAT A FULL MERKANTIS AUDIT ADDS</p>
        <ul className="space-y-2.5">
          {FULL_AUDIT_ADDS.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
              <span className="text-[14px] leading-[1.55] text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <p className="text-[13px] text-muted font-sans text-center">
          This is 30% of a real Merkantis audit.
        </p>
        <Button
          size="lg"
          onClick={() => document.getElementById("request")?.scrollIntoView({ behavior: "smooth" })}
        >
          Request the full audit →
        </Button>
        <button
          onClick={onReset}
          className="text-[13px] text-muted hover:text-foreground underline underline-offset-2 transition-colors duration-150 cursor-pointer"
        >
          Run another audit
        </button>
      </div>
    </motion.div>
  );
}

export function AuditSection() {
  const [form, setForm] = useState<Partial<AuditRequest>>({});
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stepTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  function startLoadingAnimation() {
    setLoadingStep(0);
    let step = 0;
    stepTimer.current = setInterval(() => {
      step++;
      if (step < LOADING_STEPS.length - 1) {
        setLoadingStep(step);
      } else {
        // Hold on last step until response
        setLoadingStep(LOADING_STEPS.length - 1);
        if (stepTimer.current) clearInterval(stepTimer.current);
      }
    }, 420);
  }

  useEffect(() => {
    return () => {
      if (stepTimer.current) clearInterval(stepTimer.current);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.supplierName || !form.componentCategory || !form.currentlySourcedFrom || !form.annualSpend || !form.volumeProfile) {
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    startLoadingAnimation();

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      const data: AuditResponse = await res.json();
      if (stepTimer.current) clearInterval(stepTimer.current);
      setLoadingStep(LOADING_STEPS.length - 1);
      setTimeout(() => {
        setLoading(false);
        setResult(data);
      }, 400);
    } catch {
      if (stepTimer.current) clearInterval(stepTimer.current);
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  }

  function handleReset() {
    setResult(null);
    setForm({});
    setError(null);
    document.getElementById("audit")?.scrollIntoView({ behavior: "smooth" });
  }

  const canSubmit =
    !!form.supplierName &&
    !!form.componentCategory &&
    !!form.currentlySourcedFrom &&
    !!form.annualSpend &&
    !!form.volumeProfile;

  return (
    <section id="audit" className="py-[120px] border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn>
          <p className="eyebrow mb-4">INSTANT AUDIT</p>
          <h2 className="text-[36px] md:text-[42px] font-medium tracking-tight leading-[1.15] mb-4">
            Score any supplier. Right now.
          </h2>
          <p className="text-[18px] leading-[1.55] text-muted max-w-[580px] mb-12">
            Real preliminary audit using public data and the Merkantis Reliability Score
            framework. ~15 seconds. Sources cited.
          </p>
        </FadeIn>

        {/* Tabs */}
        <FadeIn delay={0.05}>
          <div className="border-b border-border mb-10">
            <div className="flex items-end gap-0">
              <button className="px-4 pb-3 text-[14px] font-medium text-foreground border-b-2 border-accent transition-colors duration-150">
                Audit a supplier
              </button>
              <div className="relative px-4 pb-3 flex items-center gap-2">
                <span className="text-[14px] text-muted">Find Indian suppliers</span>
                <span className="font-mono text-[10px] uppercase tracking-eyebrow bg-gray-100 text-subtle px-2 py-0.5 rounded-full">
                  Coming soon
                </span>
              </div>
              <div className="relative px-4 pb-3 flex items-center gap-2">
                <span className="text-[14px] text-muted">Benchmark pricing</span>
                <span className="font-mono text-[10px] uppercase tracking-eyebrow bg-gray-100 text-subtle px-2 py-0.5 rounded-full">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Audit form */}
        {!result && (
          <FadeIn delay={0.1}>
            <form onSubmit={handleSubmit} className="max-w-[720px]">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-mono text-[12px] text-muted mb-1.5 uppercase tracking-eyebrow">
                    Supplier name <span className="text-accent">*</span>
                  </label>
                  <Input
                    required
                    mono
                    placeholder="Bevel Gears India"
                    value={form.supplierName ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, supplierName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[12px] text-muted mb-1.5 uppercase tracking-eyebrow">
                    Supplier website
                  </label>
                  <Input
                    type="url"
                    mono
                    placeholder="https://..."
                    value={form.supplierWebsite ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, supplierWebsite: e.target.value }))}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-mono text-[12px] text-muted mb-1.5 uppercase tracking-eyebrow">
                    Component category <span className="text-accent">*</span>
                  </label>
                  <Select
                    value={form.componentCategory ?? ""}
                    onValueChange={(v) => setForm((f) => ({ ...f, componentCategory: v }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPONENT_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block font-mono text-[12px] text-muted mb-1.5 uppercase tracking-eyebrow">
                    Currently sourcing from <span className="text-accent">*</span>
                  </label>
                  <Select
                    value={form.currentlySourcedFrom ?? ""}
                    onValueChange={(v) => setForm((f) => ({ ...f, currentlySourcedFrom: v }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {SOURCE_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block font-mono text-[12px] text-muted mb-1.5 uppercase tracking-eyebrow">
                    Annual spend <span className="text-accent">*</span>
                  </label>
                  <Select
                    value={form.annualSpend ?? ""}
                    onValueChange={(v) => setForm((f) => ({ ...f, annualSpend: v }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPEND_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block font-mono text-[12px] text-muted mb-1.5 uppercase tracking-eyebrow">
                    Volume profile <span className="text-accent">*</span>
                  </label>
                  <Select
                    value={form.volumeProfile ?? ""}
                    onValueChange={(v) => setForm((f) => ({ ...f, volumeProfile: v }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {VOLUME_OPTIONS.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={!canSubmit || loading}
                className="w-full sm:w-auto"
              >
                {loading ? "Running audit..." : "Run the audit →"}
              </Button>

              {error && (
                <p className="mt-3 font-mono text-[13px] text-red-500">{error}</p>
              )}

              {loading && <LoadingState step={loadingStep} />}
            </form>
          </FadeIn>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && (
            <ResultCard
              result={result}
              onReset={handleReset}
              sourceInput={form.currentlySourcedFrom ?? ""}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
