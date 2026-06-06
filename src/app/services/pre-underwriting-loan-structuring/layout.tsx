import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pre-Underwriting & Loan Structuring — Credora Fintech",
  description: "Get application-ready before you apply. Pre-underwriting, financial analysis, gap identification, and professional loan structuring for significantly higher approval chances.",
  keywords: "pre-underwriting service, loan structuring India, loan application preparation, financial analysis service, bank eligibility assessment, loan proposal structuring",
  openGraph: {
    title: "Pre-Underwriting & Loan Structuring — Get Application-Ready",
    description: "Evaluate your profile, fix weak spots, and structure your application for the strongest outcome.",
    type: "website",
  },
};

export default function PreUnderwritingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
