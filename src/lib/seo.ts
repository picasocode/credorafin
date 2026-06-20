/**
 * Central SEO configuration for Credora Fintech.
 *
 * Single source of truth for site-wide SEO values: URLs, contact info,
 * social profiles, business details, and helper functions.
 *
 * Update SITE_URL when the production domain changes. All canonical URLs,
 * OG images, sitemap entries, and JSON-LD identifiers derive from this.
 */

export const SITE = {
  /** Production origin — no trailing slash. */
  url: "https://credorafin.com",
  name: "Credora Fintech",
  legalName: "Credora Fintech Pvt Ltd",
  tagline: "Enrich Your Cashflow",
  description:
    "Structured funding solutions for MSMEs, professionals, and growing businesses across India. Disciplined pre-underwriting, end-to-end advisory, and access to 70+ financial institutions.",
  /** ISO 639-1 language code for hreflang. */
  locale: "en",
  localeOg: "en_IN",
  /** Twitter handle (without @). Update when claimed. */
  twitterHandle: "credorafin",
  /** Default OG image — relative path, resolved against SITE.url. */
  defaultOgImage: "/og/og-default.png",
} as const;

/** Contact details — shared by Organization, LocalBusiness, and ContactPage schema. */
export const CONTACT = {
  phone: "+91 93448 99971",
  phoneE164: "+919344899971",
  email: "info@credorafin.com",
  website: "https://credorafin.com",
  /** Chennai office — Anna Nagar West Extension. */
  address: {
    street: "1157, 17th Street, Anna Nagar West Extension, Padi",
    locality: "Chennai",
    region: "Tamil Nadu",
    postalCode: "600050",
    country: "IN",
  },
  /** Approximate geo for Anna Nagar West Extension, Chennai. */
  geo: {
    latitude: 13.085,
    longitude: 80.2154,
  },
  /** Mon–Sat, 9 AM – 6 PM IST. */
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
} as const;

/** Social profile URLs — used in Organization sameAs. */
export const SOCIAL: { name: string; url: string }[] = [
  // Update with real profile URLs when claimed.
  // { name: "LinkedIn", url: "https://www.linkedin.com/company/credorafintech" },
  // { name: "Twitter",  url: "https://twitter.com/credorafin" },
  // { name: "Facebook", url: "https://www.facebook.com/credorafintech" },
  // { name: "Instagram", url: "https://www.instagram.com/credorafintech" },
];

/**
 * Navigation entries used to build sitemap.xml and BreadcrumbList schema.
 * Keep `path` values without trailing slash and starting with `/`.
 */
export const NAV_ENTRIES = [
  { path: "/", title: "Home", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/about", title: "About Us", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/products", title: "Products", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/products/msme-loans", title: "MSME Loans", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/products/supply-chain-finance", title: "Supply Chain Finance", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/products/cross-border-finance", title: "Cross Border Finance", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/products/project-finance", title: "Project Finance", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/products/specialized-finance", title: "Specialized Finance", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/services", title: "Services", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/services/credit-repair", title: "Credit Repair Services", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/services/pre-underwriting-loan-structuring", title: "Pre-Underwriting & Loan Structuring", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/services/fund-raising", title: "Fund Raising", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/services/end-to-end-support", title: "End-to-End Support", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/emi-calculator", title: "EMI Calculator", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/referral-partner", title: "Referral Partner Program", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/blog", title: "Blog", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/contact", title: "Contact Us", priority: 0.7, changeFrequency: "monthly" as const },
];

/** Helper: build an absolute URL from a path. */
export function absoluteUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${cleanPath}`;
}

/** Helper: build an OG image URL for a given page key. */
export function ogImage(pageKey: string): string {
  return absoluteUrl(`/og/og-${pageKey}.png`);
}
