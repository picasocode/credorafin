/**
 * JSON-LD structured data builders for Credora Fintech.
 *
 * Generates schema.org objects for Organization, LocalBusiness,
 * Service, FAQPage, BreadcrumbList, and Article. These are rendered
 * into <script type="application/ld+json"> tags by the <JsonLd /> component.
 *
 * Reference: https://schema.org
 */

import { SITE, CONTACT, SOCIAL, absoluteUrl } from "./seo";

/* ────────────────────────────────────────────
   Schema builders
   ──────────────────────────────────────────── */

/** Organization schema — sitewide identity. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/images/credora-logo-full.png"),
      width: 512,
      height: 512,
    },
    image: absoluteUrl("/og/og-default.png"),
    description: SITE.description,
    foundingDate: "2024",
    founders: [
      {
        "@type": "Person",
        name: "Credora Fintech Pvt Ltd",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: CONTACT.phoneE164,
        email: CONTACT.email,
        areaServed: "IN",
        availableLanguage: ["en", "ta", "hi"],
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: CONTACT.phoneE164,
        email: CONTACT.email,
        areaServed: "IN",
        availableLanguage: ["en", "ta", "hi"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.locality,
      addressRegion: CONTACT.address.region,
      postalCode: CONTACT.address.postalCode,
      addressCountry: CONTACT.address.country,
    },
    sameAs: SOCIAL.map((s) => s.url),
  };
}

/**
 * LocalBusiness (FinancialService) schema for the Chennai office.
 * Strong for "business loan Chennai" / "MSME loan advisor near me" queries.
 */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "FinancialService"],
    "@id": `${SITE.url}/#localbusiness`,
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description,
    url: SITE.url,
    telephone: CONTACT.phoneE164,
    email: CONTACT.email,
    image: absoluteUrl("/og/og-default.png"),
    logo: absoluteUrl("/images/credora-logo-full.png"),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.locality,
      addressRegion: CONTACT.address.region,
      postalCode: CONTACT.address.postalCode,
      addressCountry: CONTACT.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CONTACT.geo.latitude,
      longitude: CONTACT.geo.longitude,
    },
    openingHoursSpecification: CONTACT.openingHours.map((oh) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: oh.days,
      opens: oh.opens,
      closes: oh.closes,
    })),
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "State", name: "Tamil Nadu" },
      { "@type": "City", name: "Chennai" },
    ],
    sameAs: SOCIAL.map((s) => s.url),
    parentOrganization: { "@id": `${SITE.url}/#organization` },
  };
}

/** WebSite schema — enables sitelinks search box eligibility. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": `${SITE.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: SITE.locale,
  };
}

/** Service schema — for individual service pages. */
export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
  category?: string;
  providerName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    image: absoluteUrl(`/og/og-${opts.path.split("/").pop()}.png`),
    serviceType: opts.category || "Financial Service",
    provider: {
      "@type": "FinancialService",
      name: opts.providerName || SITE.name,
      url: SITE.url,
      telephone: CONTACT.phoneE164,
      address: {
        "@type": "PostalAddress",
        streetAddress: CONTACT.address.street,
        addressLocality: CONTACT.address.locality,
        addressRegion: CONTACT.address.region,
        postalCode: CONTACT.address.postalCode,
        addressCountry: CONTACT.address.country,
      },
    },
    areaServed: { "@type": "Country", name: "India" },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl(opts.path),
      servicePhone: CONTACT.phoneE164,
      serviceEmail: CONTACT.email,
    },
  };
}

/** FAQPage schema — for FAQ sections on service pages. */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

/** BreadcrumbList schema — for breadcrumb trails. */
export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** Article schema — for blog posts. */
export function articleSchema(opts: {
  title: string;
  description: string;
  path: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  tags?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    image: absoluteUrl(opts.image),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified || opts.datePublished,
    author: {
      "@type": "Organization",
      name: opts.author,
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/credora-logo-full.png"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(opts.path),
    },
    keywords: (opts.tags || []).join(", "),
    articleSection: "Finance",
    inLanguage: SITE.locale,
  };
}

/** WebPage schema — generic for non-service, non-article pages. */
export function webPageSchema(opts: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: { "@id": `${SITE.url}/#organization` },
    inLanguage: SITE.locale,
  };
}
