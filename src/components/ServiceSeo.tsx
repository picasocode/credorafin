/**
 * Server-side SEO wrapper for the four service pages.
 *
 * Renders JSON-LD structured data (Service, FAQ, Breadcrumb) for a given
 * service slug. Inject this at the top of a service layout (which is a
 * server component).
 *
 * Usage:
 *   <ServiceSeo slug="credit-repair" />
 */

import React from "react";
import { JsonLd } from "@/components/JsonLd";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { services } from "@/lib/data";

interface Props {
  slug: string;
  /** Custom breadcrumb trail (defaults to Home > Services > <Service>). */
  breadcrumbs?: { name: string; path: string }[];
}

export function ServiceSeo({ slug, breadcrumbs }: Props) {
  const service = services.find((s) => s.slug === slug);
  if (!service) return null;

  const path = `/services/${slug}`;
  const crumbs =
    breadcrumbs || [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.title, path },
    ];

  return (
    <JsonLd
      id={`service-${slug}`}
      data={[
        serviceSchema({
          name: service.title,
          description: service.desc,
          path,
          category: "Financial Service",
        }),
        faqSchema(service.faqs || []),
        breadcrumbSchema(crumbs),
      ]}
    />
  );
}
