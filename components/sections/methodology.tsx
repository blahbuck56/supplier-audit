"use client";

import { FadeIn, FadeInStagger, FadeInItem } from "@/components/fade-in";
import { PILLAR_META } from "@/lib/audit-types";
import type { PillarName } from "@/lib/audit-types";

const PILLAR_ORDER: PillarName[] = [
  "CAPABILITY", "QUALITY", "DELIVERY", "COMMERCIAL", "COMMUNICATION", "ESG", "IMPROVEMENT",
];

// Visual shading for the bar segments (navy gradient, darkest left)
const PILLAR_BAR_STYLES = [
  { bg: "#0A1628", text: "white" },
  { bg: "#0e1e38", text: "white" },
  { bg: "#142848", text: "white" },
  { bg: "#1b3259", text: "white" },
  { bg: "#243c6a", text: "white" },
  { bg: "#2e487b", text: "#c3cfe8" },
  { bg: "#3a558c", text: "#c3cfe8" },
];

const PILLAR_LABELS: Record<PillarName, string> = {
  CAPABILITY: "CAPABILITY",
  QUALITY: "QUALITY",
  DELIVERY: "DELIVERY",
  COMMERCIAL: "COMMERCIAL",
  COMMUNICATION: "COMM.",
  ESG: "ESG",
  IMPROVEMENT: "IMP.",
};

export function MethodologySection() {
  return (
    <section id="methodology" className="py-[120px] border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn>
          <p className="eyebrow mb-4">METHODOLOGY</p>
          <h2 className="text-[36px] font-medium tracking-tight leading-[1.15] mb-4">
            The Merkantis Reliability Score — 7 weighted pillars
          </h2>
          <p className="text-[18px] leading-[1.55] text-muted max-w-[640px] mb-12">
            We score every supplier in our network against seven pillars, weighted by what
            actually drives delivered outcomes. Capability and Quality together account for
            45% of the score. Cost is never the lead factor.
          </p>
        </FadeIn>

        {/* Weighted bar */}
        <FadeIn delay={0.05}>
          <div className="flex rounded-[8px] overflow-hidden h-12 mb-12 border border-border">
            {PILLAR_ORDER.map((p, i) => {
              const meta = PILLAR_META[p];
              const style = PILLAR_BAR_STYLES[i];
              return (
                <div
                  key={p}
                  className="flex items-center justify-center overflow-hidden transition-all duration-150 hover:brightness-110"
                  style={{
                    width: `${meta.weight}%`,
                    backgroundColor: style.bg,
                    color: style.text,
                  }}
                  title={`${meta.label} — ${meta.weight}%`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider whitespace-nowrap px-1 hidden sm:block">
                    {PILLAR_LABELS[p]}
                  </span>
                  <span className="font-mono text-[10px] ml-1 opacity-70 hidden sm:block">
                    {meta.weight}%
                  </span>
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* Pillar list */}
        <FadeInStagger className="space-y-0">
          {PILLAR_ORDER.map((p, i) => {
            const meta = PILLAR_META[p];
            const num = String(i + 1).padStart(2, "0");
            return (
              <FadeInItem key={p} index={i}>
                <div className={`py-8 ${i !== 0 ? "border-t border-border" : ""}`}>
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-12">
                    <div className="flex items-start gap-4">
                      <span className="font-mono text-[32px] font-medium text-border leading-none pt-1">
                        {num}
                      </span>
                      <div>
                        <h3 className="text-[20px] font-medium tracking-tight text-foreground">
                          {meta.label}
                        </h3>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 bg-navy text-white font-mono text-[11px] mt-1">
                          {meta.weight}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[15px] leading-[1.6] text-muted mb-4">
                        {meta.description}
                      </p>
                      <p className="eyebrow mb-2">WE LOOK FOR</p>
                      <p className="font-mono text-[13px] text-foreground leading-relaxed">
                        {meta.signals}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeInItem>
            );
          })}
        </FadeInStagger>

        {/* Decision hierarchy callout */}
        <FadeIn delay={0.1}>
          <div className="mt-12 rounded-card border border-border bg-gray-50 p-8">
            <p className="eyebrow mb-4">THE DECISION HIERARCHY</p>
            <p className="text-[16px] leading-[1.6] text-foreground max-w-[720px]">
              Capability first. Then references. Then process consistency. Then financial health.
              Then longevity. Commercial last. This order comes from a real client engagement
              with a 17-year Italian industrial localization program — and it works because it
              weeds out brokers and bargain-shoppers before they waste your team&apos;s time.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
