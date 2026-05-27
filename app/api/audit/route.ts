import { NextRequest, NextResponse } from "next/server";
import type { AuditRequest, AuditResponse } from "@/lib/audit-types";
import { generateMockAudit } from "@/lib/mock-audit";
import { generateRealAudit } from "@/lib/real-audit";

// This route runs the real, evidence-grounded MRS audit when ANTHROPIC_API_KEY
// is configured. It uses Claude with the built-in web_search server tool to
// actually research the supplier (website, certifications, directory listings,
// news, registry filings) — no Firecrawl key required.
//
// If ANTHROPIC_API_KEY is NOT set, it falls back to a deterministic mock so the
// UI still demos. To enable the real audit on Vercel:
//   Project → Settings → Environment Variables → add ANTHROPIC_API_KEY
//
// Optional future enhancement: add Firecrawl (FIRECRAWL_API_KEY) to deep-scrape
// specific pages before handing content to Claude for even tighter citations.

export const maxDuration = 60; // web search + reasoning can take >10s

export async function POST(
  req: NextRequest
): Promise<NextResponse<AuditResponse | { error: string }>> {
  try {
    const body: AuditRequest = await req.json();

    if (!body.supplierName?.trim()) {
      return NextResponse.json({ error: "supplierName is required" }, { status: 400 });
    }
    if (!body.componentCategory?.trim()) {
      return NextResponse.json({ error: "componentCategory is required" }, { status: 400 });
    }

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const result = await generateRealAudit(body);
        return NextResponse.json(result);
      } catch (err) {
        // If the live audit fails (rate limit, parse error, timeout), degrade
        // gracefully to the mock rather than returning a hard error to the user.
        console.error("[/api/audit] real audit failed, falling back to mock:", err);
        return NextResponse.json(generateMockAudit(body));
      }
    }

    // No API key configured — deterministic mock for preview/demo.
    await new Promise((resolve) => setTimeout(resolve, 2200));
    return NextResponse.json(generateMockAudit(body));
  } catch (err) {
    console.error("[/api/audit]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
