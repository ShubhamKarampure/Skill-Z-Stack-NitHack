import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skill-Z - Blockchain Credential Platform",
  description:
    "Own your credentials forever. Tamper-proof blockchain verification. Zero-knowledge privacy. Decentralized governance. The future of education starts here.",
  generator: "v0.app",
  keywords: [
    "blockchain",
    "credentials",
    "NFT",
    "education",
    "verification",
    "skills",
    "decentralized",
  ],
  authors: [{ name: "Skill-Z Team" }],
  creator: "Skill-Z",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://skill-z.app",
    siteName: "Skill-Z",
    title: "Skill-Z - Blockchain Credential Platform",
    description:
      "Own your credentials forever. Tamper-proof blockchain verification. Zero-knowledge privacy. Decentralized governance.",
    images: [
      {
        url: "https://skill-z.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Skill-Z - Blockchain Credential Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skill-Z - Blockchain Credential Platform",
    description:
      "Own your credentials forever. Tamper-proof blockchain verification. Zero-knowledge privacy.",
    creator: "@skillz_web3",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased overflow-x-hidden bg-[#09090b] text-zinc-50`}
      >
        {/* Ambient Background Effects */}
        <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden">
          {/* Primary Aurora Orb */}
          <div
            className="absolute -top-[400px] -right-[200px] w-[800px] h-[800px] rounded-full opacity-20 blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
            }}
          />
          {/* Secondary Purple Orb */}
          <div
            className="absolute -bottom-[300px] -left-[200px] w-[600px] h-[600px] rounded-full opacity-15 blur-[100px]"
            style={{
              background:
                "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            }}
          />
          {/* Accent Cyan Orb */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-5 blur-[150px]"
            style={{
              background:
                "radial-gradient(circle, #06b6d4 0%, transparent 60%)",
            }}
          />
          {/* Grid Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
            }}
          />
          {/* Noise Texture */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-0">{children}</div>

        <Analytics />
      </body>
    </html>
  );
}
