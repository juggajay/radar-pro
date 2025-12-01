import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://radarpro.com.au"),
  title: {
    default: "RadarPro - Australia's Fastest Weather Radar",
    template: "%s | RadarPro",
  },
  description:
    "Real-time Australian weather radar with rain alerts. Faster than BOM with a modern interface. Get notified before rain arrives.",
  keywords: [
    "weather radar australia",
    "bom radar",
    "rain radar",
    "australian weather",
    "rain forecast",
    "storm tracking",
    "weather app australia",
  ],
  authors: [{ name: "RadarPro" }],
  creator: "RadarPro",
  publisher: "RadarPro",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://radarpro.com.au",
    siteName: "RadarPro",
    title: "RadarPro - Australia's Fastest Weather Radar",
    description:
      "Real-time Australian weather radar with rain alerts. Faster than BOM.",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "RadarPro Weather Radar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RadarPro - Australia's Fastest Weather Radar",
    description: "Real-time Australian weather radar with rain alerts",
    images: ["/og/home.png"],
    creator: "@radarpro_au",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RadarPro",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
