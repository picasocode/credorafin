import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Specialized Finance — Credora Fintech",
  description: "Niche funding solutions for complex requirements. Third-party security, PEP funding, bridge finance, ship purchase, film & media finance, ARC/NCLT, structured finance and more.",
  keywords: "specialized finance India, bridge finance, ship purchase finance, film finance, ARC stressed assets, NCLT purchase, SMA NPA resolution, structured finance, PEP funding",
  openGraph: {
    title: "Specialized Finance — Niche Solutions for Complex Requirements",
    description: "Customized structured finance when standard products fall short. 10 sub-products for unique scenarios.",
    type: "website",
  },
};

export default function SpecializedFinanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
