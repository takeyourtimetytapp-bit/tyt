import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LangGate from "./components/LangGate";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tilt Guard",
  description: "No analysis. No advice. Just a decision.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
            <body
        style={{
          margin: 0,
          background: "#e6e8eb",
          color: "#222",
          lineHeight: 1.6,
          fontFamily: '"Noto Sans JP", system-ui, -apple-system, "Segoe UI", Arial, sans-serif',
        }}
      >
        <LangGate>{children}</LangGate>
        <Analytics />
      </body>

    </html>
  );
}
