import type { Metadata } from "next";
import { SITE, ogImage } from "@/lib/seo";
import { PageSchema } from "@/components/PageSchema";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and Conditions governing the use of www.credorafin.com and the advisory services offered by Credora Fintech Pvt Ltd. Read about engagement process, fees, liability, and more.",
  keywords: [
    "Credora terms and conditions",
    "fintech terms of service",
    "loan advisory terms",
    "Credora Fintech terms",
    "website terms",
    "advisory services terms",
  ],
  alternates: { canonical: "/terms-and-conditions" },
  openGraph: {
    type: "website",
    locale: SITE.localeOg,
    url: "/terms-and-conditions",
    siteName: SITE.name,
    title: "Terms and Conditions — Credora Fintech",
    description:
      "Terms and Conditions governing the use of credorafin.com and Credora Fintech advisory services.",
    images: [
      {
        url: ogImage("terms-and-conditions"),
        width: 1200,
        height: 630,
        alt: "Terms and Conditions — Credora Fintech",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE.twitterHandle}`,
    creator: `@${SITE.twitterHandle}`,
    title: "Terms and Conditions — Credora Fintech",
    description:
      "Terms and Conditions governing the use of credorafin.com and Credora Fintech advisory services.",
    images: [ogImage("terms-and-conditions")],
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageSchema
        name="Terms and Conditions"
        description="Terms and Conditions governing the use of www.credorafin.com and the advisory services offered by Credora Fintech Pvt Ltd."
        path="/terms-and-conditions"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Terms and Conditions", path: "/terms-and-conditions" },
        ]}
      />
      {children}
    </>
  );
}