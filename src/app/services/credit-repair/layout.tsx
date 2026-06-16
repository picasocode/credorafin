import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credit Repair Services — Credora Fintech",
  description: "Professional credit repair services — fix incorrect CIBIL entries, remove duplicates, update outdated marks. Improve your credit score and increase loan eligibility.",
  keywords: "credit repair India, CIBIL repair service, credit score improvement, fix credit report errors, remove duplicate accounts, CIBIL correction service",
  openGraph: {
    title: "Credit Repair Services — Improve Your Credit Profile",
    description: "Analyze, identify, and correct credit report errors. Improve your score and unlock better loan terms.",
    type: "website",
  },
};

export default function CreditRepairLayout({ children }: { children: React.ReactNode }) {
  return children;
}
