import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "Credora Fintech's comprehensive services — Credit Repair, Pre-Underwriting & Loan Structuring, Fund Raising, and End-to-End Support. From assessment to disbursal and beyond.",
  keywords: "credit repair India, loan structuring service, fund raising advisory, business loan support, CIBIL repair service, pre-underwriting service",
  openGraph: {
    title: "Financial Services — Credora Fintech",
    description: "End-to-end support from credit repair to post-disbursal service.",
    type: "website",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
