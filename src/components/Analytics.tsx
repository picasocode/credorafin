/**
 * Analytics placeholder.
 *
 * Set NEXT_PUBLIC_GA_ID (e.g. "G-XXXXXXXXXX") in your Vercel env vars
 * to enable Google Analytics 4. Until then, this component renders
 * nothing and ships zero tracking code.
 *
 * To extend with Vercel Analytics, Plausible, etc., add additional
 * env-var gates below.
 */

import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
