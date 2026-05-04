import type { Metadata } from "next";
import "./globals.css";
import { SplashGate } from "@/components/splash-gate";
import { geistMono, geistSans, outfit } from "./fonts";

export const metadata: Metadata = {
  title: "Neko Jar — Goal-based savings",
  description:
    "Set your goal, start saving, and track progress with Neko Jar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <SplashGate>{children}</SplashGate>
      </body>
    </html>
  );
}
