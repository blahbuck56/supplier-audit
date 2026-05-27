import type {
  AuditRequest,
  AuditResponse,
  PillarName,
  PillarResult,
  VerdictTier,
} from "./audit-types";

// Deterministic string hash → number in [0, 1)
function hashToFloat(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return (h >>> 0) / 0xffffffff;
}

// Seeded pseudo-random using the supplier name
function seededRng(seed: string) {
  let state = hashToFloat(seed);
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

function pickVerdict(r: number): VerdictTier {
  // 35% STRATEGIC, 35% PREFERRED, 20% PROBATION, 10% INSUFFICIENT_DATA
  if (r < 0.35) return "STRATEGIC";
  if (r < 0.70) return "PREFERRED";
  if (r < 0.90) return "PROBATION";
  return "INSUFFICIENT_DATA";
}

function verdictToScoreRange(verdict: VerdictTier): [number, number] {
  switch (verdict) {
    case "STRATEGIC": return [80, 95];
    case "PREFERRED": return [62, 79];
    case "PROBATION": return [42, 59];
    case "DISQUALIFIED": return [20, 39];
    case "INSUFFICIENT_DATA": return [0, 0];
  }
}

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

interface PillarBank {
  strong: string[];
  mid: string[];
  weak: string[];
  source: string[];
}

const PILLAR_BANKS: Record<PillarName, PillarBank> = {
  CAPABILITY: {
    strong: [
      "5-axis CNC and in-house spiral bevel grinding confirmed on capability page",
      "Process list confirms CNC turning, milling, and precision grinding in stated category",
      "Dedicated production line for stated category with 300t/month stated capacity",
    ],
    mid: [
      "Machining and assembly capability listed; grinding route unspecified — verify",
      "Stated capability covers primary processes; heat treatment appears outsourced",
      "Category alignment confirmed at general level; tolerance class not stated",
    ],
    weak: [
      "Capability page generic; stated category appears secondary to core business",
      "Limited process detail; unclear whether hard turning or grinding is in-house",
      "Supplier describes brokerage-style multi-category offering — specialist depth unverified",
    ],
    source: [
      "from /capabilities page",
      "from /products page",
      "from general web",
      "from company profile (IndiaMart)",
    ],
  },
  QUALITY: {
    strong: [
      "ISO 9001:2015 certificate visible; IATF 16949 stated for automotive customers",
      "In-house CMM inspection and surface testing confirmed; ISO 9001 current",
      "Quality page references ISO 9001 and internal SPC; CMM equipment listed",
    ],
    mid: [
      "ISO 9001 stated; no sector-specific certification visible for aerospace or auto",
      "Certificate images shown but expiry not confirmed; basic QC equipment listed",
      "Quality section present; third-party audit history not disclosed publicly",
    ],
    weak: [
      "No certification visible on website; quality process undocumented",
      "ISO 9001 claimed but no certificate visible; inspection capability not detailed",
      "Quality mentions generic; no CMM, surface testing, or material testing visible",
    ],
    source: [
      "from /quality page",
      "from certificate registry",
      "from /about page",
      "from general web",
    ],
  },
  DELIVERY: {
    strong: [
      "Export references to EU customers imply lead-time discipline; no negative signals found",
      "Established export track record; 4–6 week lead times cited consistently in public references",
      "Customer testimonials cite on-time delivery; 5-year export relationship mentioned",
    ],
    mid: [
      "Delivery terms mentioned (FOB); historical on-time rate not publicly available",
      "Lead times quoted on website; no independent verification of schedule adherence",
      "Export activity confirmed; delivery consistency requires direct reference check",
    ],
    weak: [
      "No delivery data public; one negative review on TradeIndia mentioning delays",
      "Lead times stated but appear aspirational based on production capacity listed",
      "Prior customer mention of rescheduling found in news search; verify root cause",
    ],
    source: [
      "from customer references (web)",
      "from /export page",
      "from TradeIndia profile",
      "general web search",
    ],
  },
  COMMERCIAL: {
    strong: [
      "MOQ flexibility cited for export customers; LC and advance payment both accepted",
      "Tooling investment mentioned for OEM partnerships; pricing competitive vs category median",
      "Price list available on request; payment terms include 30-day credit for established accounts",
    ],
    mid: [
      "MOQ not stated; payment terms standard (advance + LC); pricing not benchmarked",
      "Commercial terms require direct negotiation; no public pricing signals",
      "Spot pricing available; MOQ and credit terms unconfirmed for stated volumes",
    ],
    weak: [
      "Pricing signals suggest premium positioning without matching capability evidence",
      "High MOQ inferred from production scale; credit terms not offered for new accounts",
      "Commercial flexibility limited; advance payment only per profile",
    ],
    source: [
      "from /contact page",
      "from IndiaMart profile",
      "from general web",
      "from export profile",
    ],
  },
  COMMUNICATION: {
    strong: [
      "English-language website and marketing; export-oriented team structure inferred",
      "Website professional; prompt inquiry response reported in Google reviews",
      "Technical documentation in English; dedicated export sales contact listed",
    ],
    mid: [
      "Website partially in English; dedicated export contact not listed",
      "Communication capability inferred from export activity; direct test required",
      "Response time and documentation quality not publicly assessable",
    ],
    weak: [
      "Website primarily in vernacular; English capability unverified",
      "No export sales contact listed; communication posture unclear",
      "Mixed reviews on response time; escalation handling not documented",
    ],
    source: [
      "from website audit",
      "from Google reviews",
      "from IndiaMart profile",
      "general web",
    ],
  },
  ESG: {
    strong: [
      "Environmental certifications listed; safety record not flagged in news search",
      "ISO 14001 mentioned on website; no adverse labor or safety news in 12 months",
      "Published sustainability page; no incidents found in news search",
    ],
    mid: [
      "No ESG disclosures found; no adverse incidents in public record",
      "Safety and labor posture not publicly documented; standard for size cohort",
      "Environmental compliance unverified; no adverse signals in news search",
    ],
    weak: [
      "ESG posture undocumented; one compliance notice found in MCA records",
      "No safety or environmental certifications visible",
      "ESG data thin; recommend on-site verification during full audit",
    ],
    source: [
      "from /sustainability page",
      "from MCA filing 2024",
      "from news search (12 months)",
      "general web",
    ],
  },
  IMPROVEMENT: {
    strong: [
      "Certification additions visible over 5 years; capex investment in new CNC visible",
      "New equipment investment mentioned in 2024 news; certification trajectory positive",
      "Facility expansion announced; improvement culture inferred from customer references",
    ],
    mid: [
      "Stable certification posture; no new investment signals visible",
      "Improvement trajectory neutral; no corrective action history public",
      "No strong investment signals; improvement posture stable but not growing",
    ],
    weak: [
      "No new certifications or investment visible in 24 months",
      "Improvement signals absent; corrective action history not disclosed",
      "Static posture; no evidence of proactive quality or capability investment",
    ],
    source: [
      "from news search (24 months)",
      "from /about page",
      "from certificate registry",
      "general web",
    ],
  },
};

function pickBank(rng: () => number, score: number, bank: PillarBank): { finding: string; source: string } {
  const idx = Math.floor(rng() * 3);
  if (score >= 72) {
    return { finding: bank.strong[idx % bank.strong.length], source: bank.source[Math.floor(rng() * bank.source.length)] };
  }
  if (score >= 48) {
    return { finding: bank.mid[idx % bank.mid.length], source: bank.source[Math.floor(rng() * bank.source.length)] };
  }
  return { finding: bank.weak[idx % bank.weak.length], source: bank.source[Math.floor(rng() * bank.source.length)] };
}

const PILLAR_ORDER: PillarName[] = [
  "CAPABILITY", "QUALITY", "DELIVERY", "COMMERCIAL", "COMMUNICATION", "ESG", "IMPROVEMENT",
];
const PILLAR_WEIGHTS: Record<PillarName, number> = {
  CAPABILITY: 20, QUALITY: 25, DELIVERY: 20, COMMERCIAL: 15,
  COMMUNICATION: 10, ESG: 5, IMPROVEMENT: 5,
};

const VERDICT_HEADLINES: Record<VerdictTier, string[]> = {
  STRATEGIC: [
    "Strong capability match, robust process control, export references verified.",
    "Specialist depth confirmed. Quality certification posture above category median.",
    "In-house grinding and ISO 9001 confirmed. Export track record present. Commercial terms to negotiate.",
  ],
  PREFERRED: [
    "Solid baseline across most pillars. One or two areas require direct verification.",
    "Capable supplier with validated quality posture. Delivery consistency needs reference check.",
    "Category match confirmed. Certification adequate. Financial health not yet verified.",
  ],
  PROBATION: [
    "Capability present but process depth requires on-site verification.",
    "Mixed signals across pillars. Specific use cases only — ops oversight required.",
    "Some positive signals on capability; quality and delivery gaps need remediation.",
  ],
  DISQUALIFIED: [
    "Material gaps across multiple pillars. Do not engage without full remediation.",
  ],
  INSUFFICIENT_DATA: [
    "Public data too thin for a preliminary view. Full audit required to establish baseline.",
    "Insufficient public signals across capability, quality, and delivery pillars.",
  ],
};

const BOTTOM_LINES: Record<VerdictTier, (name: string, category?: string) => string> = {
  STRATEGIC: (name, cat) =>
    `${name} presents a strong preliminary profile for ${cat}. Capability and quality signals are above baseline; delivery references support export track record. Recommended for inclusion in RFQ shortlist. Commercial terms and financial health verification are the remaining steps before commitment.`,
  PREFERRED: (name, cat) =>
    `${name} is a credible candidate for ${cat} with a validated baseline across most pillars. One or two areas — most likely delivery consistency or commercial terms — require direct verification before committing volume. Suitable for a pilot order with ops monitoring.`,
  PROBATION: (name, cat) =>
    `${name} shows partial capability alignment for ${cat}, but gaps in quality documentation or delivery track record create meaningful risk. Engage only for non-critical applications or pilot quantities with full Merkantis oversight. A corrective action plan should be agreed before scaling.`,
  DISQUALIFIED: (name) =>
    `${name} does not meet minimum thresholds across multiple MRS pillars. Do not engage. If supplier is a strategic priority for another reason, commission a full Merkantis audit before reopening discussions.`,
  INSUFFICIENT_DATA: (name) =>
    `${name} has insufficient public signals to form a preliminary view on capability, quality, or delivery. A full Merkantis audit with on-site verification is the only reliable path to a score. Do not shortlist based on this preliminary scan.`,
};

const STRENGTHS_POOL: string[] = [
  "In-house grinding capability confirmed — no outsourced routing risk",
  "ISO 9001 certification current — baseline quality process in place",
  "Export track record to EU/US customers implies lead-time discipline",
  "Specialist focus in stated category — not a generalist broker",
  "English-language capability evident from website and export materials",
  "CMM inspection equipment listed — dimensional control in-house",
  "Stated capacity consistent with batch profile",
  "Multi-year operational history — longevity reduces counterparty risk",
  "Technical documentation quality above average for size cohort",
  "Certification trajectory improving over past 24 months",
];

const RISKS_POOL: string[] = [
  "Heat treatment route unconfirmed — verify in-house vs outsourced",
  "Financial health not publicly assessable — audited P&L required",
  "On-time delivery history not independently verified",
  "MOQ flexibility for pilot quantities unconfirmed",
  "No IATF 16949 — relevant if automotive supply chain involved",
  "ESG posture undocumented — on-site labor and safety audit needed",
  "Capacity claims not verified against actual production floor",
  "Payment terms for new accounts likely advance-only — confirm",
  "Reference calls with comparable customers not yet conducted",
  "No CMM or surface testing confirmed — inspection capability unverified",
];

export function generateMockAudit(req: AuditRequest): AuditResponse {
  const seed = req.supplierName.toLowerCase().trim();
  const rng = seededRng(seed);

  // Pick verdict
  const verdictRoll = hashToFloat(seed);
  const verdict = pickVerdict(verdictRoll);

  // MRS composite score
  let mrsScore = 0;
  if (verdict !== "INSUFFICIENT_DATA") {
    const [lo, hi] = verdictToScoreRange(verdict);
    mrsScore = lerp(lo, hi, rng());
  }

  // Generate per-pillar scores that weight-sum to mrsScore
  const pillars: PillarResult[] = [];
  if (verdict === "INSUFFICIENT_DATA") {
    for (const pillar of PILLAR_ORDER) {
      pillars.push({
        pillar,
        weight: PILLAR_WEIGHTS[pillar],
        score: 0,
        finding: "Insufficient public data to assess this pillar.",
        source: "general web",
      });
    }
  } else {
    // Generate individual scores with variance, then normalize to match mrsScore
    const rawScores: Record<PillarName, number> = {} as Record<PillarName, number>;
    let weightedSum = 0;
    for (const pillar of PILLAR_ORDER) {
      const w = PILLAR_WEIGHTS[pillar];
      const base = mrsScore + (rng() * 30 - 15);
      rawScores[pillar] = Math.max(20, Math.min(98, base));
      weightedSum += rawScores[pillar] * w;
    }
    // Scale so weighted sum / 100 == mrsScore
    const scale = (mrsScore * 100) / weightedSum;
    for (const pillar of PILLAR_ORDER) {
      const s = Math.round(Math.max(20, Math.min(98, rawScores[pillar] * scale)));
      const { finding, source } = pickBank(rng, s, PILLAR_BANKS[pillar]);
      pillars.push({ pillar, weight: PILLAR_WEIGHTS[pillar], score: s, finding, source });
    }
  }

  // Pick headline
  const headlines = VERDICT_HEADLINES[verdict];
  const headline = headlines[Math.floor(hashToFloat(seed + "h") * headlines.length)];

  // Strengths and risks (pick non-overlapping subsets)
  const shuffledStrengths = [...STRENGTHS_POOL].sort(() => rng() - 0.5);
  const shuffledRisks = [...RISKS_POOL].sort(() => rng() - 0.5);
  const strengthCount = verdict === "STRATEGIC" ? 5 : verdict === "PREFERRED" ? 4 : 3;
  const riskCount = verdict === "STRATEGIC" ? 3 : verdict === "PREFERRED" ? 4 : 5;
  const strengths = verdict === "INSUFFICIENT_DATA"
    ? ["Insufficient data to identify specific strengths"]
    : shuffledStrengths.slice(0, strengthCount);
  const risks = verdict === "INSUFFICIENT_DATA"
    ? ["Full on-site audit required before any assessment", "Public signals too thin to form a view"]
    : shuffledRisks.slice(0, riskCount);

  const now = new Date();
  const auditId = `AUD_${now.getTime().toString(36).toUpperCase()}`;

  return {
    auditId,
    timestamp: now.toISOString(),
    supplierName: req.supplierName,
    componentCategory: req.componentCategory,
    verdict,
    mrsScore,
    verdictHeadline: headline,
    pillars,
    bottomLine: BOTTOM_LINES[verdict](req.supplierName, req.componentCategory),
    strengths,
    risks,
    sourcesCount: verdict === "INSUFFICIENT_DATA" ? 1 : Math.floor(rng() * 3) + 3,
    referencesCount: verdict === "INSUFFICIENT_DATA" ? 0 : Math.floor(rng() * 5) + 4,
    dataConfidence:
      verdict === "STRATEGIC" ? "HIGH"
      : verdict === "PREFERRED" ? "MEDIUM"
      : verdict === "PROBATION" ? "LOW"
      : "INSUFFICIENT",
  };
}
