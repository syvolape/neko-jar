/** Central place for loading the Google fonts used throughout the app. */

import { Geist, Geist_Mono, Outfit } from "next/font/google";

// Geist handles the app chrome and supporting UI copy.
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// The mono face is available for any code- or data-like UI treatments.
export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Outfit is the brand-forward display face used across headings and CTAs.
export const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});
