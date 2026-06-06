import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cross Border Finance — Credora Fintech",
  description: "Specialized trade finance for exporters and importers. Export finance, pre-shipment & post-shipment finance, import finance — manage orders, production and receivables across borders.",
  keywords: "cross border finance India, export finance, pre-shipment finance, post-shipment finance, import finance, trade finance India, international trade funding",
  openGraph: {
    title: "Cross Border Finance — Fund Your International Trade",
    description: "Comprehensive trade finance solutions for exporters and importers. Manage the entire trade cycle efficiently.",
    type: "website",
  },
};

export default function CrossBorderFinanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
