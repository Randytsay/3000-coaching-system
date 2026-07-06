import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Marcellus, Noto_Sans_TC } from "next/font/google";
import "react-notion-x/styles.css";
import { PageTools } from "../components/page-tools";
import { SiteHeader } from "../components/site-header";
import "./globals.css";

const display = Marcellus({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
});

const body = Noto_Sans_TC({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "五力教練學院",
  description: "五力教練學院第一版，承接公開內容、90 天陪跑 SOP 與教練養成路徑。",
  icons: {
    icon: "/favicon.ico?v=2",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant" className={`${display.variable} ${body.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <PageTools />
        <Analytics />
      </body>
    </html>
  );
}
