import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather App - Real-Time Weather Forecast",
  description:
    "Get accurate and detailed weather forecasts for any location. Real-time weather information, hourly forecasts, and comprehensive meteorological data.",
  authors: [{ name: "EduardoProfe666" }],
  keywords: [
    "weather",
    "forecast",
    "meteorology",
    "temperature",
    "climate",
    "real-time weather",
  ],
  creator: "EduardoProfe666",
  publisher: "EduardoProfe666",
  openGraph: {
    title: "Weather App - Real-Time Weather Forecast",
    description:
      "Get accurate and detailed weather forecasts for any location. Real-time weather information, hourly forecasts, and comprehensive meteorological data.",
    type: "website",
    locale: "en_US",
    siteName: "Weather App",
    images: [
      {
        url: "/banner.png",
        width: 800,
        height: 600,
        alt: "Weather App Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weather App - Real-Time Weather Forecast",
    description: "Accurate and detailed real-time weather forecasts",
    images: ["/banner.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
