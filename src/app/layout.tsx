import type { Metadata } from "next";
import { Bricolage_Grotesque, Literata } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const GOOGLE_ADS_ID = "AW-16601595902";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Literata({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AussieCitizenshipPrep | Australian Citizenship Practice Tests 2026",
  description:
    "Free and premium Australian citizenship practice tests. Mock exams, section-wise practice, and a one-time Premium unlock to help you pass first time.",
  openGraph: {
    title: "AussieCitizenshipPrep — Australian Citizenship Practice Tests",
    description:
      "Prepare with free starter tests and unlock Premium mock exams for AU$10.99.",
    images: ["/images/hero-passport.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full antialiased">
        {/* Google tag (gtag.js) — root layout only; beforeInteractive injects into <head> */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="beforeInteractive"
        />
        <Script id="google-ads-gtag" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `}
        </Script>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
