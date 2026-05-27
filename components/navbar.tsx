"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Wordmark */}
          <a
            href="#"
            className="text-[18px] font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity duration-150"
          >
            merkantis
          </a>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: "Score a supplier", href: "#audit" },
              { label: "Methodology", href: "#methodology" },
              { label: "Case study", href: "#case-study" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-[14px] text-muted hover:text-foreground transition-colors duration-150"
              >
                {label}
              </a>
            ))}
          </nav>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              document.getElementById("request")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Request audit
          </Button>
        </div>
      </div>
    </header>
  );
}
