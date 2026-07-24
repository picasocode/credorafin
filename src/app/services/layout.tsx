import type { Metadata } from "next";
import { SITE, ogImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Services — Credit Repair, Pre-Underwriting, Fund Raising & Support",
  description:
    "Credora Fintech's comprehensive services — Credit Repair, Pre-Underwriting & Loan Structuring, Fund Raising, and End-to-End Support. From assessment to disbursal and beyond.",
  keywords: [
    "credit repair India",
    "loan structuring service",
    "fund raising advisory",
    "business loan support",
    "CIBIL repair service",
    "pre-underwriting service",
    "post-disbursal support",
  ],
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    locale: SITE.localeOg,
    url: "/services",
    siteName: SITE.name,
    title: "Financial Services — Credora Fintech",
    description: "End-to-end support from credit repair to post-disbursal service.",
    images: [
      {
        url: ogImage("services"),
        width: 1200,
        height: 630,
        alt: "Credora Fintech Services",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE.twitterHandle}`,
    creator: `@${SITE.twitterHandle}`,
    title: "Credora Services — End-to-End Funding Support",
    description: "Credit repair, pre-underwriting, fund raising & post-disbursal support.",
    images: [ogImage("services")],
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
