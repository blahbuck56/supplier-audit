"use client";

import { FadeIn, FadeInStagger, FadeInItem } from "@/components/fade-in";
import { Separator } from "@/components/ui/separator";

const tiers = [
  {
    dot: "bg-emerald-500",
    title: "Strategic",
    range: "MRS ≥ 80",
    description:
      "Priority routing on every RFQ. Validated end to end — capability, quality, references, financials. Roughly a quarter of our active network earns it.",
    bullets: [
      "Audited every 18 months",
      "90%+ on-time historical",
      "Strategic-tier badge in network",
    ],
    ariaLabel: "Strategic: score 80 or above",
  },
  {
    dot: "bg-amber-500",
    title: "Preferred",
    range: "MRS 60–79",
    description:
      "The default for most RFQs. Solid track record, with one or two areas we revisit on a rolling schedule. About two-thirds of the network.",
    bullets: [
      "Audited every 24 months",
      "75%+ on-time historical",
      "On a defined path to Strategic",
    ],
    ariaLabel: "Preferred: score 60 to 79",
  },
  {
    dot: "bg-red-500",
    title: "Probation",
    range: "MRS < 60",
    description:
      "Specific use cases, with ops oversight on every order — a new supplier proving out, or an established one working a corrective action. Around one in ten.",
    bullets: [
      "Audited every 12 months",
      "Ops-monitored RFQs",
      "Path to Preferred defined",
    ],
    ariaLabel: "Probation: score below 60",
  },
];

export function TiersSection() {
  return (
    <section id="tiers" className="py-[120px] border-t border-border bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn>
          <p className="eyebrow mb-4">RANKING</p>
          <h2 className="text-[36px] font-medium tracking-tight leading-[1.15] mb-12">
            Three tiers. One score.
          </h2>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <FadeInItem key={tier.title} index={i}>
              <div
                className="rounded-card border border-border p-8 h-full flex flex-col transition-colors duration-150 hover:border-border-hover"
                aria-label={tier.ariaLabel}
              >
                {/* Large colored dot */}
                <span
                  className={`inline-block w-5 h-5 rounded-full mb-5 ${tier.dot}`}
                  aria-hidden="true"
                />

                <h3 className="text-[24px] font-semibold tracking-tight text-foreground mb-1">
                  {tier.title}
                </h3>
                <p className="font-mono text-[16px] text-muted mb-4">{tier.range}</p>

                <p className="text-[15px] leading-[1.6] text-muted mb-6 flex-1">
                  {tier.description}
                </p>

                <Separator className="mb-5" />

                <ul className="space-y-2.5">
                  {tier.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-2.5">
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${tier.dot}`}
                        aria-hidden="true"
                      />
                      <span className="text-[14px] leading-[1.55] text-foreground">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}
