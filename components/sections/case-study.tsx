"use client";

import { FadeIn } from "@/components/fade-in";
import { StaticDot } from "@/components/score-dot";
import { Separator } from "@/components/ui/separator";

type Signal = "green" | "amber" | "red" | "gray";

interface SupplierRow {
  name: string;
  capability: { signal: Signal; label: string };
  quality: { signal: Signal; label: string };
  delivery: { signal: Signal; label: string };
  commercial: { signal: Signal; label: string };
  comm: { signal: Signal; label: string };
  esg: { signal: Signal; label: string };
  improve: { signal: Signal; label: string };
}

const suppliers: SupplierRow[] = [
  {
    name: "Supplier A",
    capability: { signal: "green", label: "dual systems" },
    quality: { signal: "green", label: "specialized" },
    delivery: { signal: "green", label: "export-grade" },
    commercial: { signal: "amber", label: "to verify" },
    comm: { signal: "green", label: "strong" },
    esg: { signal: "amber", label: "pending" },
    improve: { signal: "green", label: "trajectory" },
  },
  {
    name: "Supplier B",
    capability: { signal: "green", label: "capable" },
    quality: { signal: "red", label: "outsourced HT" },
    delivery: { signal: "amber", label: "prior issues" },
    commercial: { signal: "green", label: "competitive" },
    comm: { signal: "amber", label: "mixed" },
    esg: { signal: "amber", label: "pending" },
    improve: { signal: "amber", label: "partial" },
  },
  {
    name: "Supplier C",
    capability: { signal: "amber", label: "verify ground" },
    quality: { signal: "green", label: "in-house HT" },
    delivery: { signal: "amber", label: "auto-paced" },
    commercial: { signal: "amber", label: "volume-priced" },
    comm: { signal: "amber", label: "OEM-style" },
    esg: { signal: "green", label: "audited" },
    improve: { signal: "amber", label: "stable" },
  },
  {
    name: "Supplier D",
    capability: { signal: "amber", label: "secondary biz" },
    quality: { signal: "amber", label: "mixed" },
    delivery: { signal: "amber", label: "spur-focused" },
    commercial: { signal: "green", label: "aggressive" },
    comm: { signal: "amber", label: "OK" },
    esg: { signal: "amber", label: "pending" },
    improve: { signal: "amber", label: "partial" },
  },
];

const pillarsShort = ["Capability", "Quality", "Delivery", "Commercial", "Comm.", "ESG", "Improve"];

type CellKey = "capability" | "quality" | "delivery" | "commercial" | "comm" | "esg" | "improve";
const cellKeys: CellKey[] = ["capability", "quality", "delivery", "commercial", "comm", "esg", "improve"];

export function CaseStudySection() {
  return (
    <section id="case-study" className="py-[120px] border-t border-border bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn>
          <p className="eyebrow mb-4">A REAL AUDIT</p>
          <h2 className="text-[36px] font-medium tracking-tight leading-[1.15] mb-12">
            Italian industrial OEM. Spiral bevel pinion gear localization.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — project parameters */}
          <FadeIn delay={0.05}>
            <div className="space-y-0">
              {[
                ["Client", "Italian industrial gearbox manufacturer (₹110cr India operations)"],
                ["Component", "Ground spiral bevel pinion gear"],
                ["Volume", "~200 units/batch · 6 variants · 1,200 units total"],
                ["Objective", "Localize from Italian baseline; reverse 35% India / 65% Italy mix"],
                ["Timeline", "4 weeks for written report"],
                ["Methodology", "100+ suppliers screened → 4 shortlisted → 2 recommended"],
              ].map(([key, val], i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3 py-3 font-mono text-[13px]",
                    i !== 0 && "border-t border-border"
                  )}
                >
                  <span className="text-subtle min-w-[110px]">{key}:</span>
                  <span className="text-foreground">{val}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pl-4 border-l-2 border-border">
              <p className="text-[18px] italic leading-[1.55] text-foreground mb-3">
                &ldquo;Looks like we are on the right track.&rdquo;
              </p>
              <p className="font-mono text-[12px] text-subtle">
                — Managing Director, Italian industrial OEM
              </p>
            </div>
          </FadeIn>

          {/* Right — comparison scorecard */}
          <FadeIn delay={0.1}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr>
                    <th className="pb-3 pr-3 text-left font-mono text-[11px] uppercase tracking-eyebrow text-subtle w-24">
                      Supplier
                    </th>
                    {pillarsShort.map((p) => (
                      <th
                        key={p}
                        className="pb-3 px-2 font-mono text-[10px] uppercase tracking-eyebrow text-subtle text-center"
                      >
                        {p}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((s, si) => (
                    <tr key={s.name} className={si !== 0 ? "border-t border-border" : ""}>
                      <td className="py-3 pr-3 font-mono text-[12px] text-foreground">{s.name}</td>
                      {cellKeys.map((key) => {
                        const cell = s[key];
                        return (
                          <td key={key} className="py-3 px-2 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <StaticDot color={cell.signal} size={8} />
                              <span className="font-mono text-[10px] text-subtle">{cell.label}</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Separator className="mt-4 mb-3" />
            <p className="font-mono text-[12px] text-subtle leading-relaxed">
              Real supplier names disclosed under engagement. Verdict: Supplier A recommended primary,
              Supplier B secondary pending HT route verification.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function cn(...args: (string | undefined | false)[]) {
  return args.filter(Boolean).join(" ");
}
