import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore Credora Fintech's comprehensive range of funding products — MSME Loans, Supply Chain Finance, Cross Border Finance, Project Finance, and Specialized Finance. 70+ banks, tailored solutions.",
  keywords: "MSME loans India, supply chain finance, cross border trade finance, project finance real estate, specialized finance solutions, business funding products",
  openGraph: {
    title: "Funding Products — Credora Fintech",
    description: "Comprehensive funding solutions from working capital to specialized finance.",
    type: "website",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
