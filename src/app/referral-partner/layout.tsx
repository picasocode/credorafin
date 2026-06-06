import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referral Partner Program",
  description:
    "Join Credora Fintech's referral partner program. Earn rewards by connecting businesses with funding solutions. Simple process, competitive rewards, full support. Trusted by 1,200+ clients.",
  keywords:
    "referral partner program, earn referral rewards, business loan referral, financial advisor partnership, CA referral program, loan agent India",
  openGraph: {
    title: "Referral Partner — Credora Fintech",
    description:
      "Refer businesses and earn rewards. Simple, transparent, rewarding.",
    type: "website",
  },
};

export default function ReferralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
