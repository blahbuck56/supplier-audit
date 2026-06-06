"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/fade-in";
import { Separator } from "@/components/ui/separator";

const DELIVERABLES = [
  "100+ supplier longlist for your category, narrowed to the 3–5 worth your time",
  "Written report: verdict, full scorecard, and a pilot plan you can act on",
  "On-site factory visits, reference calls, and a four-week turnaround",
  "No obligation to continue",
];

// Current month for the spot counter display
const CURRENT_MONTH = new Date().toLocaleString("default", { month: "long", year: "numeric" });

export function RequestAuditSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    focus: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // In production: POST to /api/contact or a form endpoint
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <section id="request" className="py-[120px] border-t border-border bg-navy">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn>
          <p className="font-mono text-[12px] uppercase tracking-eyebrow text-blue-300 mb-4">
            FREE AUDIT
          </p>
          <h2 className="text-[36px] font-medium tracking-tight leading-[1.15] text-white mb-4">
            Five spots this month.
          </h2>
          <p className="text-[18px] leading-[1.55] text-blue-200 max-w-[520px] mb-12">
            A complete Merkantis audit. The kind we normally charge for. Free, and capped at
            five a month.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — what you get */}
          <FadeIn delay={0.05}>
            <ul className="space-y-4 mb-6">
              {DELIVERABLES.map((d, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span className="text-[15px] leading-[1.6] text-blue-100">{d}</span>
                </li>
              ))}
            </ul>

            <Separator className="bg-white/10 mb-5" />

            <p className="font-mono text-[12px] text-blue-300">
              We normally charge for this.
            </p>
          </FadeIn>

          {/* Right — form */}
          <FadeIn delay={0.1}>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[12px] text-blue-300 mb-1.5 uppercase tracking-eyebrow">
                        Full name <span className="text-accent">*</span>
                      </label>
                      <Input
                        required
                        placeholder="Jane Smith"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="bg-white/5 border-white/20 text-white placeholder:text-blue-300/40 focus-visible:border-accent focus-visible:ring-accent/30"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[12px] text-blue-300 mb-1.5 uppercase tracking-eyebrow">
                        Work email <span className="text-accent">*</span>
                      </label>
                      <Input
                        required
                        type="email"
                        placeholder="jane@company.com"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="bg-white/5 border-white/20 text-white placeholder:text-blue-300/40 focus-visible:border-accent focus-visible:ring-accent/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[12px] text-blue-300 mb-1.5 uppercase tracking-eyebrow">
                      Company <span className="text-accent">*</span>
                    </label>
                    <Input
                      required
                      placeholder="Acme Manufacturing GmbH"
                      value={form.company}
                      onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                      className="bg-white/5 border-white/20 text-white placeholder:text-blue-300/40 focus-visible:border-accent focus-visible:ring-accent/30"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[12px] text-blue-300 mb-1.5 uppercase tracking-eyebrow">
                      What should we focus on?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Supplier name, category, or sourcing question..."
                      value={form.focus}
                      onChange={(e) => setForm((f) => ({ ...f, focus: e.target.value }))}
                      className="flex w-full rounded-[8px] border border-white/20 bg-white/5 px-3.5 py-3 text-sm text-white placeholder:text-blue-300/40 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:border-accent resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    {loading ? "Submitting..." : "Request my audit →"}
                  </Button>

                  <p className="font-mono text-[12px] text-blue-300">
                    3 of 5 spots remaining for {CURRENT_MONTH}.
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-card border border-white/20 p-8"
                >
                  <p className="font-mono text-[12px] uppercase tracking-eyebrow text-blue-300 mb-3">
                    REQUEST RECEIVED
                  </p>
                  <h3 className="text-[22px] font-medium text-white mb-3">
                    You&apos;re on the list.
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-blue-200">
                    We&apos;ll be in touch within 48 hours to confirm your category and kick off
                    the audit — watch for a note at{" "}
                    <span className="font-mono text-white">{form.email}</span>.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
