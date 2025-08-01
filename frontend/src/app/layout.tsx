import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LearnSmart AI - Your AI-powered learning companion",
  description: "Personalized learning paths, AI tutoring, and interactive practice with LearnSmart AI. Transform your learning experience with AI-powered education.",
  keywords: ["AI learning", "personalized education", "online tutoring", "learning platform", "AI tutor"],
  authors: [{ name: "LearnSmart AI Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "LearnSmart AI - Your AI-powered learning companion",
    description: "Transform your learning experience with personalized AI-powered education",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnSmart AI - Your AI-powered learning companion",
    description: "Transform your learning experience with personalized AI-powered education",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
