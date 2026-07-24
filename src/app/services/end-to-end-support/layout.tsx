import type { Metadata } from "next";
import { SITE, ogImage } from "@/lib/seo";
import { ServiceSeo } from "@/components/ServiceSeo";

export const metadata: Metadata = {
  title: "End-to-End Support Services — Loan Lifecycle Management",
  description:
    "Complete loan lifecycle support — from repayment tracking and Credit Bureau management to account swap assistance, loan consolidation, and NOC collection. Support beyond disbursal.",
  keywords: [
    "loan lifecycle management",
    "repayment tracking",
    "CIBIL update service",
    "loan consolidation India",
    "account swap assistance",
    "NOC collection",
    "post-disbursal support",
    "EMI schedule tracking",
  ],
  alternates: { canonical: "/services/end-to-end-support" },
  openGraph: {
    type: "website",
    locale: SITE.localeOg,
    url: "/services/end-to-end-support",
    siteName: SITE.name,
    title: "End-to-End Support — Beyond Disbursal",
    description:
      "Full loan lifecycle management from application to closure. Never miss a payment, always stay on track.",
    images: [
      {
        url: ogImage("end-to-end-support"),
        width: 1200,
        height: 630,
        alt: "End-to-End Support Services — Credora Fintech",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE.twitterHandle}`,
    creator: `@${SITE.twitterHandle}`,
    title: "End-to-End Support — Loan Lifecycle Management",
    description: "99% on-time services. From EMI tracking to NOC collection — we manage the full lifecycle.",
    images: [ogImage("end-to-end-support")],
  },
};

export default function EndToEndSupportLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceSeo slug="end-to-end-support" />
      {children}
    </>
  );
}
