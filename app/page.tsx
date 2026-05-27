import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/sections/hero";
import { AuditSection } from "@/components/sections/audit-section";
import { CaseStudySection } from "@/components/sections/case-study";
import { MethodologySection } from "@/components/sections/methodology";
import { TiersSection } from "@/components/sections/tiers";
import { PositioningSection } from "@/components/sections/positioning";
import { RequestAuditSection } from "@/components/sections/request-audit";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AuditSection />
        <CaseStudySection />
        <MethodologySection />
        <TiersSection />
        <PositioningSection />
        <RequestAuditSection />
      </main>
      <Footer />
    </>
  );
}
