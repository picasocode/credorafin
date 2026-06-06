import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Finance — Credora Fintech",
  description: "Structured funding for large-scale real estate and builder projects. Real estate finance, builder finance, inventory funding — with moratorium options and cash-flow-aligned repayment.",
  keywords: "project finance India, real estate finance, builder finance, inventory funding, construction loan, land purchase finance, property development funding",
  openGraph: {
    title: "Project Finance — Structured Funding for Large-Scale Projects",
    description: "Long-term capital aligned with project cash flows and milestones. Support from planning to completion.",
    type: "website",
  },
};

export default function ProjectFinanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
