import type { Metadata } from "next";
import { SITE, ogImage } from "@/lib/seo";
import { ProductSeo } from "@/components/ProductSeo";

export const metadata: Metadata = {
  title: "Project Finance — Real Estate & Builder Finance | Credora",
  description:
    "Structured funding for large-scale real estate and builder projects. Real estate finance, builder finance, inventory funding — with moratorium options and cash-flow-aligned repayment.",
  keywords: [
    "project finance India",
    "real estate finance",
    "builder finance",
    "inventory funding",
    "construction loan",
    "land purchase finance",
    "property development funding",
    "real estate project loan",
  ],
  alternates: { canonical: "/products/project-finance" },
  openGraph: {
    type: "website",
    locale: SITE.localeOg,
    url: "/products/project-finance",
    siteName: SITE.name,
    title: "Project Finance — Structured Funding for Large-Scale Projects",
    description:
      "Long-term capital aligned with project cash flows and milestones. Support from planning to completion.",
    images: [
      {
        url: ogImage("project-finance"),
        width: 1200,
        height: 630,
        alt: "Project Finance — Credora Fintech",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE.twitterHandle}`,
    creator: `@${SITE.twitterHandle}`,
    title: "Project Finance — Real Estate & Builder Funding",
    description: "Structured funding for large-scale projects. Moratorium options available.",
    images: [ogImage("project-finance")],
  },
};

export default function ProjectFinanceLayout({ children }: { children: React.ReactNode }) {
    return (
      <>
        <ProductSeo slug="project-finance" />
        {children}
      </>
    );
  }
