import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuandMarket - AI-Powered Multi-Asset Trading Analytics",
  description: "Unified trading analytics platform combining crypto, forex, indices, and minerals data with AI-driven forecasting and market-pattern analysis.",
  keywords: ["QuandMarket", "trading", "analytics", "crypto", "forex", "indices", "minerals", "AI forecasting", "signals", "backtesting"],
  authors: [{ name: "QuandMarket Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "QuandMarket - AI-Powered Trading Analytics",
    description: "Multi-asset trading platform with AI-driven insights and forecasting",
    url: "https://quandmarket.com",
    siteName: "QuandMarket",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuandMarket - AI-Powered Trading Analytics",
    description: "Unified trading analytics platform with AI forecasting",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
