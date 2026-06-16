import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Credora Fintech Pvt Ltd — a financial services and advisory firm providing structured funding solutions to MSMEs, professionals, and businesses across India. 20+ years experience, 70+ bank network.",
  keywords:
    "about Credora Fintech, financial advisory India, MSME funding advisor, structured finance company, business loan consultancy",
  openGraph: {
    title: "About Credora Fintech — We Prepare You for Funding",
    description:
      "Credora Fintech provides structured funding solutions with disciplined pre-underwriting and access to 70+ banks and NBFCs.",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
