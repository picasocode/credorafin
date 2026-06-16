import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Credora Fintech for structured funding solutions. Free financial assessment, no obligation. Call +91 93448 99971 or email info@credorafin.com. Chennai, India.",
  keywords:
    "contact Credora Fintech, business loan inquiry, MSME funding consultation, free financial assessment India, loan advisory Chennai",
  openGraph: {
    title: "Contact Credora Fintech — Get Funded Today",
    description:
      "Reach out for a free financial assessment. We respond within 1 business day.",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
