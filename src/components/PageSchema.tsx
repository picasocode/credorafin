/**
 * <PageSchema /> — renders WebPage + BreadcrumbList JSON-LD for
 * non-service, non-article pages.
 *
 * Usage:
 *   <PageSchema
 *     name="About Us"
 *     description="About Credora Fintech..."
 *     path="/about"
 *     breadcrumbs={[{name:"Home",path:"/"},{name:"About",path:"/about"}]}
 *   />
 */

import React from "react";
import { JsonLd } from "@/components/JsonLd";
import { webPageSchema, breadcrumbSchema } from "@/lib/schema";

interface Props {
  name: string;
  description: string;
  path: string;
  breadcrumbs?: { name: string; path: string }[];
}

export function PageSchema({ name, description, path, breadcrumbs }: Props) {
  const schemas: object[] = [webPageSchema({ name, description, path })];
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(breadcrumbSchema(breadcrumbs));
  }
  return <JsonLd id={`page-${path.replace(/\//g, "-")}`} data={schemas} />;
}
