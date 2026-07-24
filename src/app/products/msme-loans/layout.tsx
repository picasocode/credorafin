import type { Metadata } from "next";
import { SITE, ogImage } from "@/lib/seo";
import { ProductSeo } from "@/components/ProductSeo";

export const metadata: Metadata = {
  title: "MSME Loans — Collateral-Free Business Funding",
  description:
    "Flexible MSME loans for micro, small and medium enterprises. Unsecured business loans, CGTMSE working capital, machinery finance, professional loans and more. Collateral-free options available.",
  keywords: [
    "MSME loans India",
    "unsecured business loans",
    "CGTMSE loans",
    "machinery finance",
    "professional loans",
    "working capital loans",
    "solar finance",
    "commercial vehicle finance",
    "collateral free business loan",
  ],
  alternates: { canonical: "/products/msme-loans" },
  openGraph: {
    type: "website",
    locale: SITE.localeOg,
    url: "/products/msme-loans",
    siteName: SITE.name,
    title: "MSME Loans — Flexible Funding for Business Growth",
    description:
      "Collateral-free and secured MSME loan options with competitive rates. 7+ sub-products tailored for manufacturing, trading and services.",
    images: [
      {
        url: ogImage("msme-loans"),
        width: 1200,
        height: 630,
        alt: "MSME Loans — Credora Fintech",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE.twitterHandle}`,
    creator: `@${SITE.twitterHandle}`,
    title: "MSME Loans — Collateral-Free Business Funding",
    description: "Unsecured & secured MSME loans. CGTMSE, machinery, professional & more.",
    images: [ogImage("msme-loans")],
  },
};

export default function MSMELoansLayout({ children }: { children: React.ReactNode }) {
    return (
      <>
        <ProductSeo slug="msme-loans" />
        {children}
      </>
    );
  }
