import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import RootShell from "@/components/RootShell";
import { Analytics } from "@/components/Analytics";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, localBusinessSchema, websiteSchema } from "@/lib/schema";
import { SITE } from "@/lib/seo";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Credora Fintech — Enrich Your Cashflow",
    template: "%s | Credora Fintech",
  },
  description: SITE.description,
  applicationName: SITE.name,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Credora Fintech",
    "MSME Loans India",
    "Business Loan Chennai",
    "Credit Repair India",
    "Pre-Underwriting Service",
    "Fund Raising Advisory",
    "Supply Chain Finance",
    "Project Finance India",
    "Cross Border Finance",
    "Loan Structuring",
    "Business Funding India",
    "Working Capital Loan",
  ],
  authors: [{ name: SITE.legalName, url: SITE.url }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  category: "Finance",
  icons: {
    icon: [
      { url: "/images/credora-logo.png", type: "image/png" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/images/credora-logo.png",
    apple: "/images/credora-logo.png",
  },
  manifest: undefined,
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: SITE.localeOg,
    url: SITE.url,
    siteName: SITE.name,
    title: "Credora Fintech — Enrich Your Cashflow",
    description: SITE.description,
    images: [
      {
        url: SITE.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Credora Fintech — Enrich Your Cashflow",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE.twitterHandle}`,
    creator: `@${SITE.twitterHandle}`,
    title: "Credora Fintech — Enrich Your Cashflow",
    description: SITE.description,
    images: [SITE.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: undefined,
  other: {
    // Custom meta — useful for color-scheme and theme-color
    "theme-color": "#1C1D62",
  },
};

export const viewport: Viewport = {
  themeColor: "#1C1D62",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Sitewide JSON-LD: Organization, LocalBusiness, WebSite */}
        <JsonLd
          id="sitewide"
          data={[organizationSchema(), localBusinessSchema(), websiteSchema()]}
        />
      </head>
      <body className={`${poppins.variable} antialiased bg-background text-foreground`} suppressHydrationWarning>
        <RootShell>{children}</RootShell>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
