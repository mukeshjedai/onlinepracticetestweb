import Script from "next/script";

/**
 * Google Ads conversion fires on the Premium success page (post-checkout).
 * Base gtag config lives in the root layout; this snippet must stay after it.
 */
export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script id="google-ads-conversion-pageview" strategy="afterInteractive">
        {`
          gtag('event', 'conversion', {
            'send_to': 'AW-16601595902/a9i6CLa4qLgZEP7_oOw9',
            'value': 1.0,
            'currency': 'AUD'
          });
        `}
      </Script>
      {children}
    </>
  );
}
