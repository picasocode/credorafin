import type { Metadata } from "next";
import { SITE, ogImage } from "@/lib/seo";
import { ProductSeo } from "@/components/ProductSeo";

export const metadata: Metadata = {
  title: "Supply Chain Finance — Invoice & Inventory Funding | Credora",
  description:
    "Unlock working capital trapped in your supply chain. Invoice discounting, payable finance, vendor finance, channel finance and inventory finance — without impacting your CIBIL score.",
  keywords: [
    "supply chain finance India",
    "invoice discounting",
    "payable finance",
    "vendor finance",
    "channel finance",
    "inventory finance",
    "working capital demand loan",
    "invoice factoring India",
  ],
  alternates: { canonical: "/products/supply-chain-finance" },
  openGraph: {
    type: "website",
    locale: SITE.localeOg,
    url: "/products/supply-chain-finance",
    siteName: SITE.name,
    title: "Supply Chain Finance — Unlock Working Capital",
    description:
      "Convert invoices into immediate cash and optimize payment cycles. Off-balance-sheet options available.",
    images: [
      {
        url: ogImage("supply-chain-finance"),
        width: 1200,
        height: 630,
        alt: "Supply Chain Finance — Credora Fintech",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE.twitterHandle}`,
    creator: `@${SITE.twitterHandle}`,
    title: "Supply Chain Finance — Unlock Working Capital",
    description: "Invoice discounting, vendor finance, inventory finance & more.",
    images: [ogImage("supply-chain-finance")],
  },
};

export default function SupplyChainFinanceLayout({ children }: { children: React.ReactNode }) {
    return (
      <>
        <ProductSeo slug="supply-chain-finance" />
        {children}
      </>
    );
  }
