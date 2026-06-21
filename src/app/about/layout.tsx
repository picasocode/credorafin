import type { Metadata } from "next";
import { SITE, ogImage } from "@/lib/seo";
import { PageSchema } from "@/components/PageSchema";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Credora Fintech Pvt Ltd — a financial services and advisory firm providing structured funding solutions to MSMEs, professionals, and businesses across India. 20+ years experience, 70+ bank network.",
  keywords: [
    "about Credora Fintech",
    "financial advisory India",
    "MSME funding advisor",
    "structured finance company",
    "business loan consultancy",
    "Chennai financial advisor",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    locale: SITE.localeOg,
    url: "/about",
    siteName: SITE.name,
    title: "About Credora Fintech — Structured for Approval, Positioned for Growth",
    description:
      "Credora Fintech provides structured funding solutions with disciplined pre-underwriting and access to 70+ banks and NBFCs.",
    images: [
      {
        url: ogImage("about"),
        width: 1200,
        height: 630,
        alt: "About Credora Fintech",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE.twitterHandle}`,
    creator: `@${SITE.twitterHandle}`,
    title: "About Credora Fintech — Structured for Approval",
    description:
      "A financial services and advisory firm providing structured funding solutions across India.",
    images: [ogImage("about")],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageSchema
        name="About Us"
        description="Learn about Credora Fintech Pvt Ltd — a financial services and advisory firm providing structured funding solutions to MSMEs, professionals, and businesses across India."
        path="/about"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />
      {children}
    </>
  );
}
