import { Oswald, IBM_Plex_Sans, IBM_Plex_Mono, Noto_Sans_SC } from "next/font/google";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-body-sc",
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "ZSsite — 施展",
  description: "施展的个人网站与工程项目档案",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${oswald.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} ${notoSansSC.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
