import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "今日のマイニュース",
  description: "選んだXアカウントの最新情報を、小学生向けの解説付きでまとめて読むアプリ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "マイニュース",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#18181b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-zinc-50 text-zinc-900">{children}</body>
    </html>
  );
}
