export type VerdictTier =
  | "STRATEGIC"
  | "PREFERRED"
  | "PROBATION"
  | "DISQUALIFIED"
  | "INSUFFICIENT_DATA";

export type PillarName =
  | "CAPABILITY"
  | "QUALITY"
  | "DELIVERY"
  | "COMMERCIAL"
  | "COMMUNICATION"
  | "ESG"
  | "IMPROVEMENT";

export interface PillarResult {
  pillar: PillarName;
  weight: number; // percentage 0-100
  score: number; // 0-100
  finding: string;
  source: string;
}

export interface AuditRequest {
  supplierName: string;
  supplierWebsite?: string;
  componentCategory: string;
  currentlySourcedFrom: string;
  annualSpend: string;
  volumeProfile: string;
}

export interface AuditResponse {
  auditId: string;
  timestamp: string;
  supplierName: string;
  componentCategory: string;
  verdict: VerdictTier;
  mrsScore: number; // 0-100 weighted composite
  verdictHeadline: string;
  pillars: PillarResult[];
  bottomLine: string;
  strengths: string[];
  risks: string[];
  sourcesCount: number;
  referencesCount: number;
  dataConfidence: "HIGH" | "MEDIUM" | "LOW" | "INSUFFICIENT";
}

export const PILLAR_META: Record<
  PillarName,
  { weight: number; label: string; description: string; signals: string }
> = {
  CAPABILITY: {
    weight: 20,
    label: "Capability",
    description:
      "Does the supplier credibly serve the stated category? We evaluate process types, materials handled, tolerance class, part size envelope, monthly capacity, and specialization depth.",
    signals:
      "CNC 3/5-axis, casting, grinding, heat treatment, materials handled, tolerance class, part size envelope, monthly capacity, specialization depth",
  },
  QUALITY: {
    weight: 25,
    label: "Quality",
    description:
      "How seriously the supplier manages its own quality process. Baseline is ISO 9001; sector-specific certifications (IATF 16949, AS9100, ISO 13485) raise confidence materially.",
    signals:
      "ISO 9001, IATF 16949, AS9100, ISO 13485, CMM, surface testing, material testing, inspection documentation capability",
  },
  DELIVERY: {
    weight: 20,
    label: "Delivery",
    description:
      "Whether quoted lead times match what actually ships. Historical on-time rate is the primary signal; stated vs actual lead times reveal the gap.",
    signals:
      "Historical on-time rate, stated vs actual lead times, milestone reporting cadence, response speed to schedule pressure",
  },
  COMMERCIAL: {
    weight: 15,
    label: "Commercial",
    description:
      "Whether the pricing, MOQ, and payment terms work for your volume structure. Tooling investment willingness matters as much as unit price.",
    signals:
      "MOQ flexibility, payment terms (LC, advance, credit), pricing vs category median, tooling investment willingness",
  },
  COMMUNICATION: {
    weight: 10,
    label: "Communication",
    description:
      "Whether you'll spend your week chasing them for updates. English proficiency, documentation quality, and response time determine how much overhead this supplier adds.",
    signals:
      "English proficiency, response time, documentation quality, update frequency, escalation handling",
  },
  ESG: {
    weight: 5,
    label: "ESG",
    description:
      "Labor, safety, and environmental compliance. Compliance audit history and environmental certifications are the key signals at preliminary stage.",
    signals:
      "Labor practices, safety record, environmental certifications, compliance audit history",
  },
  IMPROVEMENT: {
    weight: 5,
    label: "Improvement",
    description:
      "Direction of travel. A supplier that adds certifications, invests in equipment, and acts on corrective actions is lower risk than one that stagnates.",
    signals:
      "Investment patterns, certification additions over time, response to past corrective actions",
  },
};

export const VERDICT_CONFIG: Record<
  VerdictTier,
  { label: string; color: string; bgColor: string; dotColor: string; scoreRange: string }
> = {
  STRATEGIC: {
    label: "STRATEGIC",
    color: "#10B981",
    bgColor: "bg-emerald-500",
    dotColor: "bg-emerald-500",
    scoreRange: "MRS ≥ 80",
  },
  PREFERRED: {
    label: "PREFERRED",
    color: "#F59E0B",
    bgColor: "bg-amber-500",
    dotColor: "bg-amber-500",
    scoreRange: "MRS 60–79",
  },
  PROBATION: {
    label: "PROBATION",
    color: "#EF4444",
    bgColor: "bg-red-500",
    dotColor: "bg-red-500",
    scoreRange: "MRS 40–59",
  },
  DISQUALIFIED: {
    label: "DISQUALIFIED",
    color: "#EF4444",
    bgColor: "bg-red-500",
    dotColor: "bg-red-500",
    scoreRange: "MRS < 40",
  },
  INSUFFICIENT_DATA: {
    label: "INSUFFICIENT DATA",
    color: "#9CA3AF",
    bgColor: "bg-gray-400",
    dotColor: "bg-gray-400",
    scoreRange: "N/A",
  },
};

export function getScoreDotColor(score: number): string {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 55) return "bg-amber-500";
  if (score > 0) return "bg-red-500";
  return "bg-gray-400";
}
