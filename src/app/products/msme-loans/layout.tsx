import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MSME Loans — Credora Fintech",
  description: "Flexible MSME loans for micro, small and medium enterprises. Unsecured business loans, CGTMSE working capital, machinery finance, professional loans and more. Collateral-free options available.",
  keywords: "MSME loans India, unsecured business loans, CGTMSE loans, machinery finance, professional loans, working capital loans, solar finance, commercial vehicle finance",
  openGraph: {
    title: "MSME Loans — Flexible Funding for Business Growth",
    description: "Collateral-free and secured MSME loan options with competitive rates. 7+ sub-products tailored for manufacturing, trading and services.",
    type: "website",
  },
};

export default function MSMELoansLayout({ children }: { children: React.ReactNode }) {
  return children;
}
