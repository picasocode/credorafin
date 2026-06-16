import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Insights on Credit, Loans & Business Funding",
  description: "Expert insights on credit management, loan structuring, EMI planning, and funding strategies for MSMEs and growing businesses across India.",
  keywords: ["Credora Blog", "Credit Management", "Loan Structuring", "MSME Funding", "Business Loans India", "EMI Calculator"],
};

export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
