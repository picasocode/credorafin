import type { Metadata } from "next";
import { SITE, ogImage } from "@/lib/seo";
import { PageSchema } from "@/components/PageSchema";

export const metadata: Metadata = {
  title: "Blog — Insights on Credit, Loans & Business Funding",
  description:
    "Expert insights on credit management, loan structuring, EMI planning, and funding strategies for MSMEs and growing businesses across India.",
  keywords: [
    "Credora Blog",
    "Credit Management",
    "Loan Structuring",
    "MSME Funding",
    "Business Loans India",
    "EMI Calculator",
    "CIBIL Score",
    "Pre-Underwriting",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    locale: SITE.localeOg,
    url: "/blog",
    siteName: SITE.name,
    title: "Credora Blog — Insights on Credit, Loans & Business Funding",
    description:
      "Expert insights on credit management, loan structuring, EMI planning, and funding strategies for MSMEs.",
    images: [
      {
        url: ogImage("blog"),
        width: 1200,
        height: 630,
        alt: "Credora Fintech Blog",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE.twitterHandle}`,
    creator: `@${SITE.twitterHandle}`,
    title: "Credora Blog — Credit, Loans & Business Funding",
    description: "Expert insights on credit management, loan structuring & MSME funding.",
    images: [ogImage("blog")],
  },
};

export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <PageSchema
        name="Credora Blog"
        description="Expert insights on credit management, loan structuring, EMI planning, and funding strategies for MSMEs."
        path="/blog"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />
      {children}
    </>
  );
}
