import type { Metadata } from "next";
import { Marcellus, Noto_Sans_TC } from "next/font/google";
import "react-notion-x/styles.css";
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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
