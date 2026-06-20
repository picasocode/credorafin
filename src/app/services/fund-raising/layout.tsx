import type { Metadata } from "next";
import { SITE, ogImage } from "@/lib/seo";
import { ServiceSeo } from "@/components/ServiceSeo";

export const metadata: Metadata = {
  title: "Fund Raising Services — Multi-Lender Loan, Single Credit Enquiry",
  description:
    "Multi-lender fund raising with single Credit enquiry. We manage the entire process — from understanding your requirement to presenting to multiple lenders and securing the best terms.",
  keywords: [
    "fund raising advisory India",
    "multi-lender loan",
    "business fund raising",
    "loan comparison service",
    "single CIBIL enquiry multiple lenders",
    "best loan terms India",
    "business loan Chennai",
  ],
  alternates: { canonical: "/services/fund-raising" },
  openGraph: {
    type: "website",
    locale: SITE.localeOg,
    url: "/services/fund-raising",
    siteName: SITE.name,
    title: "Fund Raising — The Right Lender, The Right Terms",
    description:
      "One point of contact across 70+ lenders. Structured presentation for the best commercial terms.",
    images: [
      {
        url: ogImage("fund-raising"),
        width: 1200,
        height: 630,
        alt: "Fund Raising Services — Credora Fintech",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE.twitterHandle}`,
    creator: `@${SITE.twitterHandle}`,
    title: "Fund Raising — Multi-Lender, Single Credit Enquiry",
    description: "One point of contact across 70+ lenders. Best terms, single enquiry.",
    images: [ogImage("fund-raising")],
  },
};

export default function FundRaisingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceSeo slug="fund-raising" />
      {children}
    </>
  );
}
