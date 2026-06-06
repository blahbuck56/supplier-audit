import Anthropic from "@anthropic-ai/sdk";
import type {
  AuditRequest,
  AuditResponse,
  PillarName,
  PillarResult,
  VerdictTier,
} from "./audit-types";
import { PILLAR_META } from "./audit-types";

const PILLAR_ORDER: PillarName[] = [
  "CAPABILITY", "QUALITY", "DELIVERY", "COMMERCIAL", "COMMUNICATION", "ESG", "IMPROVEMENT",
];

const MRS_SYSTEM_PROMPT = `You are the Merkantis Reliability Score (MRS) engine. You produce honest, evidence-grounded preliminary supplier audits for procurement teams sourcing manufactured components from India and Asia.

You have a web_search tool. USE IT. Run multiple searches to ground every claim: the supplier's own website, certifications, IndiaMART/TradeIndia/Exporters India profiles, MCA/company registry data, news, customer references, and reviews. Never fabricate certifications, financials, or capabilities. If you cannot verify something, say so and score conservatively.

SCORING FRAMEWORK — score each pillar 0-100, in this exact order with these exact weights:
1. CAPABILITY (20%) — Does the supplier credibly serve the stated category? Process types (CNC 3/5-axis, casting, grinding, heat treatment), materials, tolerance class, part-size envelope, monthly capacity, specialization depth.
2. QUALITY (25%) — Process control rigor and certification posture. ISO 9001 (baseline), IATF 16949 (auto), AS9100 (aerospace), ISO 13485 (medical), in-house QC (CMM, surface/material testing), inspection documentation.
3. DELIVERY (20%) — Lead-time discipline and milestone consistency. Historical on-time rate, stated vs actual lead times, export track record, responsiveness to schedule pressure.
4. COMMERCIAL (15%) — Pricing posture and contractual flexibility. MOQ flexibility, payment terms (LC/advance/credit), pricing vs category median, tooling investment willingness.
5. COMMUNICATION (10%) — Day-to-day operational discipline. English proficiency, response time, documentation quality, proactive updates, escalation handling.
6. ESG (5%) — Labor, safety, environmental compliance. Certifications, safety record, compliance audit history.
7. IMPROVEMENT (5%) — Trajectory and openness to feedback. Investment patterns, certification additions over time, response to past corrective actions.

DECISION HIERARCHY (evaluate in this order): capability → references → process consistency → financial health → longevity → commercial. Cost is the LAST criterion, never the first.

VERDICT TIERS (from the weighted composite):
- STRATEGIC (≥80): Priority routing for all RFQs. Premium tier.
- PREFERRED (60-79): Solid choice for most RFQs.
- PROBATION (40-59): Specific use cases only; ops oversight required.
- DISQUALIFIED (<40): Do not engage.
- INSUFFICIENT_DATA: ONLY when web searches genuinely return almost nothing about this supplier. A real company with a website, product pages, or directory listings is NEVER insufficient data — score it on what you find and flag gaps as risks.

RULES:
- mrsScore MUST be the weighted sum of pillar scores: round(sum(score_i * weight_i) / 100). It must be consistent with the verdict tier.
- Every pillar finding MUST cite a concrete source: a real URL, page, or document you actually found (e.g. "shanthigears.com/products", "IndiaMART listing", "BSE annual report 2024", "ISO certificate registry"). If a pillar is unverifiable, the source is "no public source found" and you flag it as a risk.
- Write findings in specific, factual language — name real machines, certifications, customers, and numbers you found. No generic filler.
- strengths: 3-5 concrete, verified positives. risks: 3-5 specific things a buyer must verify before committing.
- bottomLine: 2-3 plain-English sentences naming what is strong, what the gaps are, and the recommended action.

OUTPUT: After researching, respond with ONLY a single fenced JSON code block, no prose before or after. Schema:
\`\`\`json
{
  "verdict": "STRATEGIC|PREFERRED|PROBATION|DISQUALIFIED|INSUFFICIENT_DATA",
  "mrsScore": <integer 0-100>,
  "verdictHeadline": "<one sentence>",
  "pillars": [
    {"pillar": "CAPABILITY", "score": <0-100>, "finding": "<specific, factual>", "source": "<real source>"},
    {"pillar": "QUALITY", "score": <0-100>, "finding": "...", "source": "..."},
    {"pillar": "DELIVERY", "score": <0-100>, "finding": "...", "source": "..."},
    {"pillar": "COMMERCIAL", "score": <0-100>, "finding": "...", "source": "..."},
    {"pillar": "COMMUNICATION", "score": <0-100>, "finding": "...", "source": "..."},
    {"pillar": "ESG", "score": <0-100>, "finding": "...", "source": "..."},
    {"pillar": "IMPROVEMENT", "score": <0-100>, "finding": "...", "source": "..."}
  ],
  "bottomLine": "<2-3 sentences>",
  "strengths": ["...", "..."],
  "risks": ["...", "..."],
  "sourcesCount": <integer: distinct supplier pages/docs reviewed>,
  "referencesCount": <integer: distinct external sources reviewed>
}
\`\`\``;

function buildUserPrompt(req: AuditRequest): string {
  const lines = [
    `Run a preliminary MRS audit on this supplier.`,
    ``,
    `Supplier name: ${req.supplierName}`,
    req.supplierWebsite ? `Website: ${req.supplierWebsite}` : `Website: (not provided — find it via search)`,
    `Component category the buyer needs: ${req.componentCategory}`,
    `Buyer is currently sourcing from: ${req.currentlySourcedFrom}`,
    `Annual spend: ${req.annualSpend}`,
    `Volume profile: ${req.volumeProfile}`,
    ``,
    req.currentlySourcedFrom === "India"
      ? `Note: the buyer already sources from India, so frame findings around this being a CURRENT or known supplier.`
      : `Note: the buyer is evaluating this as a CANDIDATE supplier for a potential switch.`,
    ``,
    `Research thoroughly with web_search, then return the JSON.`,
  ];
  return lines.filter((l) => l !== undefined).join("\n");
}

interface ClaudeAuditCore {
  verdict: VerdictTier;
  mrsScore: number;
  verdictHeadline: string;
  pillars: { pillar: PillarName; score: number; finding: string; source: string }[];
  bottomLine: string;
  strengths: string[];
  risks: string[];
  sourcesCount: number;
  referencesCount: number;
}

function extractJson(text: string): ClaudeAuditCore {
  // Prefer a fenced ```json block; fall back to the last balanced object.
  let candidate: string | null = null;
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/gi);
  if (fenceMatch && fenceMatch.length > 0) {
    const last = fenceMatch[fenceMatch.length - 1];
    candidate = last.replace(/```(?:json)?/gi, "").trim();
  }
  if (!candidate) {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      candidate = text.slice(first, last + 1);
    }
  }
  if (!candidate) throw new Error("No JSON found in Claude response");
  return JSON.parse(candidate) as ClaudeAuditCore;
}

function normalizeVerdict(v: string): VerdictTier {
  const up = v.toUpperCase().replace(/\s+/g, "_");
  if (["STRATEGIC", "PREFERRED", "PROBATION", "DISQUALIFIED", "INSUFFICIENT_DATA"].includes(up)) {
    return up as VerdictTier;
  }
  return "INSUFFICIENT_DATA";
}

// Public Anthropic API model ids are date-suffixed. Default to a documented
// Sonnet id that supports the web_search tool; allow override via env so the
// model can be bumped without a code change.
const AUDIT_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";

function scoreToVerdict(score: number): VerdictTier {
  if (score >= 80) return "STRATEGIC";
  if (score >= 60) return "PREFERRED";
  if (score >= 40) return "PROBATION";
  return "DISQUALIFIED";
}

export async function generateRealAudit(req: AuditRequest): Promise<AuditResponse> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await anthropic.messages.create({
    model: AUDIT_MODEL,
    max_tokens: 4096,
    system: MRS_SYSTEM_PROMPT,
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 6,
      } satisfies Anthropic.Messages.WebSearchTool20250305,
    ],
    messages: [{ role: "user", content: buildUserPrompt(req) }],
  });

  // Concatenate all text blocks from the final message
  const text = response.content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const core = extractJson(text);

  // Assemble into the full AuditResponse, sourcing weights from the framework
  const byPillar = new Map<PillarName, { score: number; finding: string; source: string }>();
  for (const p of core.pillars) {
    const name = (p.pillar?.toString().toUpperCase() as PillarName);
    if (PILLAR_ORDER.includes(name)) {
      byPillar.set(name, { score: p.score, finding: p.finding, source: p.source });
    }
  }

  // INSUFFICIENT_DATA is a data-availability judgment only the model can make
  // (it knows whether searches returned anything). Every other tier is derived
  // from the score below, never trusted from the model.
  const insufficient = normalizeVerdict(core.verdict) === "INSUFFICIENT_DATA";

  const pillars: PillarResult[] = PILLAR_ORDER.map((name) => {
    const found = byPillar.get(name);
    return {
      pillar: name,
      weight: PILLAR_META[name].weight,
      score: insufficient ? 0 : Math.max(0, Math.min(100, Math.round(found?.score ?? 0))),
      finding: found?.finding ?? "Insufficient public data to assess this pillar.",
      source: found?.source ?? "no public source found",
    };
  });

  // The weighted composite of the pillar scores is the single source of truth.
  // Derive both the displayed MRS score and the verdict tier from it so the
  // badge can never contradict the scorecard.
  const mrsScore = insufficient
    ? 0
    : Math.round(pillars.reduce((sum, p) => sum + p.score * p.weight, 0) / 100);
  const verdict: VerdictTier = insufficient ? "INSUFFICIENT_DATA" : scoreToVerdict(mrsScore);

  const now = new Date();
  return {
    auditId: `AUD_${now.getTime().toString(36).toUpperCase()}`,
    timestamp: now.toISOString(),
    supplierName: req.supplierName,
    componentCategory: req.componentCategory,
    verdict,
    mrsScore,
    verdictHeadline: core.verdictHeadline ?? "Preliminary audit complete.",
    pillars,
    bottomLine: core.bottomLine ?? "",
    strengths: insufficient ? ["Insufficient data to identify specific strengths"] : (core.strengths ?? []),
    risks: core.risks ?? [],
    sourcesCount: Math.max(0, Math.round(core.sourcesCount ?? 0)),
    referencesCount: Math.max(0, Math.round(core.referencesCount ?? 0)),
    dataConfidence:
      verdict === "INSUFFICIENT_DATA" ? "INSUFFICIENT"
      : verdict === "STRATEGIC" ? "HIGH"
      : verdict === "PREFERRED" ? "MEDIUM"
      : "LOW",
  };
}
