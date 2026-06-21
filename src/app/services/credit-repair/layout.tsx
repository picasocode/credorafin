import type { Metadata } from "next";
import { SITE, ogImage } from "@/lib/seo";
import { ServiceSeo } from "@/components/ServiceSeo";

export const metadata: Metadata = {
  title: "Credit Repair Services — Fix CIBIL Errors & Improve Your Score",
  description:
    "Professional credit repair services — fix incorrect CIBIL entries, remove duplicates, update outdated marks. Improve your credit score and increase loan eligibility. Avg resolution in 1 week.",
  keywords: [
    "credit repair India",
    "CIBIL repair service",
    "credit score improvement",
    "fix credit report errors",
    "remove duplicate accounts",
    "CIBIL correction service",
    "credit bureau dispute India",
  ],
  alternates: { canonical: "/services/credit-repair" },
  openGraph: {
    type: "website",
    locale: SITE.localeOg,
    url: "/services/credit-repair",
    siteName: SITE.name,
    title: "Credit Repair Services — Improve Your Credit Profile",
    description:
      "Analyze, identify, and correct credit report errors. Improve your score and unlock better loan terms.",
    images: [
      {
        url: ogImage("credit-repair"),
        width: 1200,
        height: 630,
        alt: "Credit Repair Services — Credora Fintech",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE.twitterHandle}`,
    creator: `@${SITE.twitterHandle}`,
    title: "Credit Repair Services — Improve Your Credit Profile",
    description: "Fix errors, remove duplicates, and prepare your credit profile for loan approval.",
    images: [ogImage("credit-repair")],
  },
};

export default function CreditRepairLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceSeo slug="credit-repair" />
      {children}
    </>
  );
}
