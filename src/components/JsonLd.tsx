/**
 * <JsonLd /> — renders one or more schema.org objects as
 * <script type="application/ld+json"> tags in the page head.
 *
 * Usage:
 *   <JsonLd data={organizationSchema()} />
 *   <JsonLd data={[organizationSchema(), localBusinessSchema()]} />
 */

import React from "react";

interface JsonLdProps {
  /** A single schema object or an array of schema objects. */
  data: object | object[];
  /** Optional unique key for the script tag (useful when rendering multiple <JsonLd>). */
  id?: string;
}

export function JsonLd({ data, id }: JsonLdProps) {
  const arr = Array.isArray(data) ? data : [data];
  return (
    <>
      {arr.map((schema, i) => (
        <script
          key={(id ? `${id}-` : "") + i}
          type="application/ld+json"
          // JSON.stringify output is safe to inject — schema objects are
          // constructed from controlled source (seo.ts) with no user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
