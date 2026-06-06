import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Credora Fintech — Enrich Your Cashflow",
    template: "%s | Credora Fintech",
  },
  description: "Structured funding solutions for MSMEs, professionals, and growing businesses across India.",
  keywords: ["Credora Fintech", "MSME Loans", "Supply Chain Finance", "Project Finance", "Business Funding"],
  authors: [{ name: "Credora Fintech Pvt Ltd" }],
  icons: { icon: "/images/credora-logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased bg-background text-foreground`}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
