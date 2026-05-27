import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Left — wordmark */}
          <div>
            <p className="text-[24px] font-semibold text-foreground tracking-tight mb-2">
              merkantis
            </p>
            <p className="text-[14px] text-muted leading-[1.55]">
              Managed India sourcing for global manufacturers
            </p>
          </div>

          {/* Middle — links */}
          <div>
            <p className="eyebrow mb-4">NAVIGATION</p>
            <ul className="space-y-2">
              {[
                { label: "Audit", href: "#audit" },
                { label: "Methodology", href: "#methodology" },
                { label: "Sample Report", href: "#case-study" },
                { label: "Contact", href: "#request" },
                { label: "LinkedIn", href: "https://linkedin.com", external: true },
              ].map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="text-[14px] text-muted hover:text-foreground transition-colors duration-150"
                  >
                    {label}
                    {external && (
                      <span className="ml-1 text-subtle" aria-label="opens in new tab">↗</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — addresses */}
          <div>
            <p className="eyebrow mb-4">OFFICES</p>
            <div className="font-mono text-[13px] text-muted space-y-1.5">
              <p>Mumbai</p>
              <p>Coimbatore</p>
              <p>Pennington NJ</p>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-[12px] text-subtle">
            © {new Date().getFullYear()} Merkantis. All rights reserved.
          </p>
          <p className="font-mono text-[12px] text-subtle">
            Built for procurement teams, not marketers.
          </p>
        </div>
      </div>
    </footer>
  );
}
