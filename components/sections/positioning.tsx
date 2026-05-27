"use client";

import { FadeIn, FadeInStagger, FadeInItem } from "@/components/fade-in";
import { Separator } from "@/components/ui/separator";

const blocks = [
  {
    label: "WE ARE NOT",
    content:
      "A marketplace. A broker. A directory. A finder. A consultant who hands you names and disappears.",
  },
  {
    label: "WE ARE",
    content:
      "A managed-execution operator. We own delivery end-to-end — supplier selection, on-site QC, documentation, logistics, and communication. We earn margin only on completed orders.",
  },
  {
    label: "WE EXIST BECAUSE",
    content:
      "Indian manufacturing has the capacity to serve global buyers. The operational layer to deliver it reliably hasn't existed. We built one, and the MRS is its product layer.",
  },
];

export function PositioningSection() {
  return (
    <section id="positioning" className="py-[120px] border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn>
          <p className="eyebrow mb-4">WHY WE EXIST</p>
          <h2 className="text-[36px] font-medium tracking-tight leading-[1.15] mb-12">
            We are not a marketplace.
          </h2>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {blocks.map((b, i) => (
            <FadeInItem key={b.label} index={i}>
              <div>
                <p className="eyebrow mb-4">{b.label}</p>
                <Separator className="mb-5" />
                <p className="text-[17px] leading-[1.6] text-foreground">{b.content}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}
