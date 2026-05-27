import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#0A0A0A",
        muted: "#6B7280",
        subtle: "#9CA3AF",
        border: "#E5E7EB",
        "border-hover": "#D1D5DB",
        accent: "#0066FF",
        navy: "#0A1628",
        strategic: "#10B981",
        preferred: "#F59E0B",
        probation: "#EF4444",
        insufficient: "#9CA3AF",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },
      letterSpacing: {
        eyebrow: "0.08em",
        tight: "-0.02em",
      },
      lineHeight: {
        body: "1.55",
        relaxed: "1.6",
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
        input: "8px",
      },
      transitionDuration: {
        "150": "150ms",
        "200": "200ms",
        "400": "400ms",
      },
    },
  },
  plugins: [],
};

export default config;
