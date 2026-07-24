import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin — Credora Fintech",
    template: "%s | Credora Admin",
  },
  robots: { index: false, follow: false },
  description: "Internal admin console for Credora Fintech.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Navbar/Footer are excluded at the RootShell level for all /admin routes
  return <>{children}</>;
}
