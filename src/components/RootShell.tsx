"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import FloatingEMIButton from "@/components/FloatingEMIButton";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isEmiPage = pathname === "/emi-calculator";

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      {!isEmiPage && <FloatingEMIButton />}
      <WhatsAppButton />
    </div>
  );
}
