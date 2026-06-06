import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "End-to-End Support Services — Credora Fintech",
  description: "Complete loan lifecycle support — from repayment tracking and CIBIL management to account swap assistance, loan consolidation, and NOC collection. Support beyond disbursal.",
  keywords: "loan lifecycle management, repayment tracking, CIBIL update service, loan consolidation India, account swap assistance, NOC collection, post-disbursal support",
  openGraph: {
    title: "End-to-End Support — Beyond Disbursal",
    description: "Full loan lifecycle management from application to closure. Never miss a payment, always stay on track.",
    type: "website",
  },
};

export default function EndToEndSupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
