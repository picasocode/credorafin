import type { Metadata } from "next";
import { SITE, ogImage } from "@/lib/seo";
import { PageSchema } from "@/components/PageSchema";

export const metadata: Metadata = {
  title: "Careers — Join Credora Fintech | Credora Fintech",
  description:
    "Join Credora Fintech and build a rewarding career in fintech. Explore open positions in loan advisory, credit analysis, operations, and more. Competitive pay, growth opportunities, and a collaborative work culture in Chennai.",
  keywords: [
    "fintech careers Chennai",
    "loan advisor jobs",
    "credit analyst jobs India",
    "Credora Fintech careers",
    "finance jobs Chennai",
    "MSME lending careers",
    "fintech job openings",
  ],
  alternates: { canonical: "/careers" },
  openGraph: {
    type: "website",
    locale: SITE.localeOg,
    url: "/careers",
    siteName: SITE.name,
    title: "Careers — Build Your Future in Fintech",
    description:
      "Join Credora Fintech and help businesses secure the funding they need. Explore open roles across credit analysis, sales, operations, and technology.",
    images: [
      {
        url: ogImage("careers"),
        width: 1200,
        height: 630,
        alt: "Careers — Credora Fintech",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE.twitterHandle}`,
    creator: `@${SITE.twitterHandle}`,
    title: "Careers — Build Your Future in Fintech",
    description:
      "Join Credora Fintech. Explore roles in credit analysis, loan advisory, operations, and technology.",
    images: [ogImage("careers")],
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageSchema
        name="Careers"
        description="Join Credora Fintech and build a rewarding career in fintech. Explore open positions across credit analysis, loan advisory, operations, and technology."
        path="/careers"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
        ]}
      />
      {children}
    </>
  );
}