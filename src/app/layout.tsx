import type { Metadata } from "next";
import "./globals.css";
import Providers from "src/components/Providers";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Agha Tech plus | The Pinnacle of Premium Electronics in Lebanon",
  description:
    "Experience the future of technology with Agha Tech plus. Lebanon's premier online destination for flagship smartphones, Apple devices, custom gaming rigs, and high-end accessories. Sourced directly from trusted distributors and delivered in custom Agha Tech plus packaging across all Lebanon with Cash on Delivery.",
  keywords: [
    "Agha Tech plus",
    "Agha Tech",
    "Electronics Lebanon",
    "Apple Store Lebanon",
    "Custom Gaming PC Lebanon",
    "Flagship Smartphones Lebanon",
    "Buy iPhone Lebanon",
    "Tech Store Online Lebanon",
    "Cash on Delivery Lebanon"
  ],
  openGraph: {
    title: "Agha Tech plus | Lebanon's Premier Technology Destination",
    description: "Unleash peak performance. Discover exclusive flagship devices and tech gear with official warranty and rapid COD delivery across Lebanon.",
    type: "website",
    locale: "en_US",
    siteName: "Agha Tech plus"
  },
  twitter: {
    card: "summary_large_image",
    title: "Agha Tech plus | Elite Electronics & High-Performance Tech",
    description: "Lebanon's premier online store for flagship tech, custom builds, and guaranteed packaging.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="antialiased"
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen flex flex-col bg-brand-deep text-brand-text-primary selection:bg-accent-blue/40 selection:text-white font-sans">
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
