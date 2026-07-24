import type { Metadata } from "next";
import { SITE, ogImage } from "@/lib/seo";
import { PageSchema } from "@/components/PageSchema";

export const metadata: Metadata = {
  title: "Funding Products — MSME, Supply Chain, Project & Specialized Finance",
  description:
    "Explore Credora Fintech's comprehensive range of funding products — MSME Loans, Supply Chain Finance, Cross Border Finance, Project Finance, and Specialized Finance. 70+ banks, tailored solutions.",
  keywords: [
    "MSME loans India",
    "supply chain finance",
    "cross border trade finance",
    "project finance real estate",
    "specialized finance solutions",
    "business funding products",
    "working capital India",
  ],
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    locale: SITE.localeOg,
    url: "/products",
    siteName: SITE.name,
    title: "Funding Products — Credora Fintech",
    description: "Comprehensive funding solutions from working capital to specialized finance.",
    images: [
      {
        url: ogImage("products"),
        width: 1200,
        height: 630,
        alt: "Funding Products — Credora Fintech",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE.twitterHandle}`,
    creator: `@${SITE.twitterHandle}`,
    title: "Funding Products — Credora Fintech",
    description: "MSME, Supply Chain, Cross Border, Project & Specialized Finance. 70+ banks.",
    images: [ogImage("products")],
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageSchema
        name="Funding Products"
        description="Explore Credora Fintech's comprehensive range of funding products — MSME Loans, Supply Chain Finance, Cross Border Finance, Project Finance, and Specialized Finance."
        path="/products"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
        ]}
      />
      {children}
    </>
  );
}
