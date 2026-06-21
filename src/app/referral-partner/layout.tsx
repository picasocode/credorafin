import type { Metadata } from "next";
import { SITE, ogImage } from "@/lib/seo";
import { PageSchema } from "@/components/PageSchema";

export const metadata: Metadata = {
  title: "Referral Partner Program — Earn Rewards | Credora Fintech",
  description:
    "Join Credora Fintech's referral partner program. Earn rewards by connecting businesses with funding solutions. Simple process, competitive rewards, full support. Trusted by 1,200+ clients.",
  keywords: [
    "referral partner program",
    "earn referral rewards",
    "business loan referral",
    "financial advisor partnership",
    "CA referral program",
    "loan agent India",
    "DSA loan agent",
    "credit advisor partnership",
  ],
  alternates: { canonical: "/referral-partner" },
  openGraph: {
    type: "website",
    locale: SITE.localeOg,
    url: "/referral-partner",
    siteName: SITE.name,
    title: "Referral Partner — Turn Your Network Into Rewards",
    description:
      "Refer businesses and earn competitive rewards. Simple, transparent, rewarding.",
    images: [
      {
        url: ogImage("referral-partner"),
        width: 1200,
        height: 630,
        alt: "Referral Partner Program — Credora Fintech",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE.twitterHandle}`,
    creator: `@${SITE.twitterHandle}`,
    title: "Referral Partner Program — Earn Rewards",
    description: "Turn your network into rewards. Refer businesses to Credora and earn on every disbursal.",
    images: [ogImage("referral-partner")],
  },
};

export default function ReferralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageSchema
        name="Referral Partner Program"
        description="Join Credora Fintech's referral partner program. Earn rewards by connecting businesses with funding solutions."
        path="/referral-partner"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Referral Partner", path: "/referral-partner" },
        ]}
      />
      {children}
    </>
  );
}
