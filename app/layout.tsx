import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Merkantis — Managed India Sourcing. Supplier Reliability Score.",
  description:
    "Merkantis runs the audits, QC, and delivery for global manufacturers sourcing from India. Score any supplier against the Merkantis Reliability Score — 7 weighted pillars, sources cited.",
  openGraph: {
    title: "Merkantis — Score any India supplier in 15 seconds",
    description:
      "The Merkantis Reliability Score (MRS) — 7-pillar framework used by Italian industrial OEMs and defense robotics teams.",
    url: "https://merkantis.com",
    siteName: "Merkantis",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
