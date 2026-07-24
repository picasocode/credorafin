import type { Metadata } from "next";
import { SITE, ogImage } from "@/lib/seo";
import { PageSchema } from "@/components/PageSchema";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Credora Fintech Pvt Ltd. Learn how we collect, use, store, and protect your personal information when you use www.credorafin.com and our advisory platforms.",
  keywords: [
    "Credora privacy policy",
    "data protection",
    "personal information",
    "fintech privacy",
    "loan advisory privacy",
    "Credora Fintech data policy",
    "DPDP Act compliance",
  ],
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    type: "website",
    locale: SITE.localeOg,
    url: "/privacy-policy",
    siteName: SITE.name,
    title: "Privacy Policy — Credora Fintech",
    description:
      "Learn how Credora Fintech collects, uses, and protects your personal information.",
    images: [
      {
        url: ogImage("privacy-policy"),
        width: 1200,
        height: 630,
        alt: "Privacy Policy — Credora Fintech",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE.twitterHandle}`,
    creator: `@${SITE.twitterHandle}`,
    title: "Privacy Policy — Credora Fintech",
    description:
      "Learn how Credora Fintech collects, uses, and protects your personal information.",
    images: [ogImage("privacy-policy")],
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageSchema
        name="Privacy Policy"
        description="Privacy Policy for Credora Fintech Pvt Ltd. Learn how we collect, use, store, and protect your personal information."
        path="/privacy-policy"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ]}
      />
      {children}
    </>
  );
}