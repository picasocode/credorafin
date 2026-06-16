import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EMI Calculator — Calculate Your Loan EMI & Amortization Schedule",
  description: "Free EMI calculator to plan your loan repayment. View detailed amortization schedules with month-by-month principal and interest breakup for business loans, MSME loans, and more.",
  keywords: ["EMI Calculator", "Loan EMI", "Amortization Schedule", "Business Loan Calculator", "MSME Loan EMI"],
};

export default function EMICalculatorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
