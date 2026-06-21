/**
 * Server-side SEO for product (funding) pages.
 *
 * Renders Service + BreadcrumbList JSON-LD for /products/<slug> pages.
 */

import React from "react";
import { JsonLd } from "@/components/JsonLd";
import { serviceSchema, breadcrumbSchema } from "@/lib/schema";
import { products } from "@/lib/data";

interface Props {
  slug: string;
}

export function ProductSeo({ slug }: Props) {
  const product = products.find((p) => p.slug === slug);
  if (!product) return null;

  const path = `/products/${slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: product.title, path },
  ];

  return (
    <JsonLd
      id={`product-${slug}`}
      data={[
        serviceSchema({
          name: product.title,
          description: product.fullDesc || product.shortDesc,
          path,
          category: "Financial Product",
        }),
        breadcrumbSchema(crumbs),
      ]}
    />
  );
}
