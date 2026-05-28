"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FadeIn } from "@/components/fade-in";
import { ScoreDot } from "@/components/score-dot";

const samplePillars = [
  { name: "Capability", score: 88 },
  { name: "Quality", score: 85 },
  { name: "Delivery", score: 84 },
  { name: "Commercial", score: 74 },
  { name: "Communication", score: 90 },
  { name: "ESG", score: 68 },
  { name: "Improvement", score: 78 },
];

export function HeroSection() {
  return (
    <section className="pt-[120px] pb-[120px] md:pb-[80px]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 lg:gap-16 items-start">
          {/* Left column */}
          <div>
            <FadeIn delay={0}>
              <p className="eyebrow mb-5">THE MERKANTIS RELIABILITY SCORE</p>
            </FadeIn>

            <FadeIn delay={0.05}>
              <h1
                className="text-[36px] md:text-[56px] font-medium leading-[1.08] tracking-tight text-foreground mb-6"
              >
                Your India suppliers,
                <br />
                scored.
              </h1>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-[18px] leading-[1.55] text-muted max-w-[480px] mb-8">
                Merkantis runs the audits, the QC, and the delivery for manufacturers sourcing
                from India. Every supplier we touch carries a Reliability Score — one number,
                seven weighted pillars, every finding cited.
              </p>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="flex items-center gap-3 mb-6">
                <Button
                  size="lg"
                  onClick={() => document.getElementById("audit")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Score a supplier →
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById("methodology")?.scrollIntoView({ behavior: "smooth" })}
                >
                  How scoring works
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="font-mono text-[13px] text-subtle">
                200+ suppliers audited · Framework proven with Italian industrial OEMs and Indian defense robotics
              </p>
            </FadeIn>
          </div>

          {/* Right column — sample verdict card */}
          <FadeIn delay={0.25}>
            <div className="rounded-card border border-border bg-white p-8 max-w-[440px] lg:max-w-none">
              {/* Card header */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[11px] uppercase tracking-eyebrow text-subtle">
                  MRS REPORT · SAMPLE
                </span>
              </div>

              <p className="font-mono text-[13px] text-foreground mb-4">
                Spiral Bevel Pinion Gear · ~200 units/batch
              </p>

              {/* Verdict badge */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-emerald-500 text-white font-mono text-sm font-medium">
                  STRATEGIC · MRS 82
                </span>
              </div>

              <p className="text-[14px] leading-[1.55] text-foreground mb-5">
                Strong capability match, robust process control, references verified.
              </p>

              <Separator className="mb-5" />

              {/* 7-pillar mini scorecard */}
              <div className="space-y-2.5">
                {samplePillars.map((p) => (
                  <div key={p.name} className="flex items-center gap-2.5">
                    <ScoreDot score={p.score} size={8} />
                    <span className="text-[14px] text-foreground flex-1 font-sans">{p.name}</span>
                    <span className="font-mono text-[13px] text-muted">{p.score}</span>
                  </div>
                ))}
              </div>

              <Separator className="mt-5 mb-4" />

              <p className="font-mono text-[12px] text-subtle leading-relaxed">
                Anonymized excerpt — Italian industrial OEM (₹110cr Indian operations)
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
