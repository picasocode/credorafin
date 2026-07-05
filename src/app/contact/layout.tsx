import type { Metadata } from "next";
import { SITE, ogImage } from "@/lib/seo";
import { PageSchema } from "@/components/PageSchema";

export const metadata: Metadata = {
  title: "Contact Us — Free Financial Assessment",
  description:
    "Contact Credora Fintech for structured funding solutions. Free financial assessment, no obligation. Call +91 93448 99971 or email info@credorafin.com. Chennai, India.",
  keywords: [
    "contact Credora Fintech",
    "business loan inquiry",
    "MSME funding consultation",
    "free financial assessment India",
    "loan advisory Chennai",
    "business funding contact",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    locale: SITE.localeOg,
    url: "/contact",
    siteName: SITE.name,
    title: "Contact Credora Fintech — Get Funded Today",
    description: "Reach out for a free financial assessment. We respond within 1 business day.",
    images: [
      {
        url: ogImage("contact"),
        width: 1200,
        height: 630,
        alt: "Contact Credora Fintech",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE.twitterHandle}`,
    creator: `@${SITE.twitterHandle}`,
    title: "Contact Credora Fintech — Free Financial Assessment",
    description: "Call +91 93448 99971 or email info@credorafin.com. 1 business day response.",
    images: [ogImage("contact")],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageSchema
        name="Contact Us"
        description="Contact Credora Fintech for structured funding solutions. Free financial assessment, no obligation."
        path="/contact"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      {children}
    </>
  );
}
