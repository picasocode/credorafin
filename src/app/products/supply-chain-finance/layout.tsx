import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Supply Chain Finance — Credora Fintech",
  description: "Unlock working capital trapped in your supply chain. Invoice discounting, payable finance, vendor finance, channel finance and inventory finance — without impacting your CIBIL score.",
  keywords: "supply chain finance India, invoice discounting, payable finance, vendor finance, channel finance, inventory finance, working capital demand loan",
  openGraph: {
    title: "Supply Chain Finance — Unlock Working Capital",
    description: "Convert invoices into immediate cash and optimize payment cycles. Off-balance-sheet options available.",
    type: "website",
  },
};

export default function SupplyChainFinanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
