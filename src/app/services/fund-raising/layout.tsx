import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fund Raising Services — Credora Fintech",
  description: "Multi-lender fund raising with single CIBIL enquiry. We manage the entire process — from understanding your requirement to presenting to multiple lenders and securing the best terms.",
  keywords: "fund raising advisory India, multi-lender loan, business fund raising, loan comparison service, single CIBIL enquiry multiple lenders, best loan terms",
  openGraph: {
    title: "Fund Raising — The Right Lender, The Right Terms",
    description: "One point of contact across 70+ lenders. Structured presentation for the best commercial terms.",
    type: "website",
  },
};

export default function FundRaisingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
