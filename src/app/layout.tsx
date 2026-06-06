import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { LenisProvider } from "@/components/lenis-provider";
import "lenis/dist/lenis.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://mostafayaser.earth"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mostafa Yaser — Full Stack SWE & Global Health Technologist",
    template: "%s — Mostafa Yaser",
  },
  description:
    "Full Stack Software Engineer and Global Health Technologist building at the intersection of technology and human impact. Based in Cairo, Egypt.",
  keywords: [
    "Mostafa Yaser",
    "Full Stack Engineer",
    "Global Health",
    "Software Engineer",
    "React",
    "Next.js",
    "Cairo",
    "Egypt",
    "Portfolio",
    "IFMSA",
    "ScholarX",
    "McKinsey",
  ],
  authors: [{ name: "Mostafa Yaser", url: SITE_URL }],
  creator: "Mostafa Yaser",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Mostafa Yaser",
    title: "Mostafa Yaser — Full Stack SWE & Global Health Technologist",
    description:
      "Full Stack SWE and Global Health Technologist. Building at the intersection of technology and human impact.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Mostafa Yaser — Full Stack SWE & Global Health Technologist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mostafa Yaser — Full Stack SWE & Global Health Technologist",
    description:
      "Full Stack SWE & Global Health Technologist. Building at the intersection of tech and human impact.",
    images: ["/opengraph-image"],
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <ThemeProvider>
          <LenisProvider>{children}</LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
