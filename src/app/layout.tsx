import type { Metadata } from "next";
import "./globals.css";
import Providers from "src/components/Providers";

export const metadata: Metadata = {
  title: "Cedar Tech | The Pinnacle of Premium Electronics in Lebanon",
  description:
    "Experience the future of technology with Cedar Tech. Lebanon's most exclusive destination for flagship smartphones, elite Apple machinery, custom-built high-performance gaming rigs, and premium accessories. Delivering uncompromising quality directly from our Bekaa hub to anywhere in Lebanon.",
  keywords: [
    "Cedar Tech",
    "Luxury Electronics Lebanon",
    "Apple Store Lebanon",
    "Custom Gaming PC Lebanon",
    "Flagship Smartphones",
    "Premium Tech Bekaa",
    "Kabelias tech store",
    "Buy iPhone Lebanon"
  ],
  openGraph: {
    title: "Cedar Tech | Lebanon's Premier Technology Destination",
    description: "Unleash peak performance. Discover exclusive flagship devices and custom-built rigs with official warranty and rapid COD delivery across Lebanon.",
    type: "website",
    locale: "en_US",
    siteName: "Cedar Tech"
  },
  twitter: {
    card: "summary_large_image",
    title: "Cedar Tech | Elite Electronics & Custom Rigs",
    description: "Lebanon's most exclusive destination for flagship tech and custom builds.",
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
      </body>
    </html>
  );
}
